'use server'

import 'server-only'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { env } from '@/lib/env'
import { requireScope } from '@/server/tenant/scope'
import { ok, err, type ActionResult } from '@/lib/result'
import { captureActionError } from '@/lib/observability'
import { ALLOWED_MIMES, MAX_SIZE, mimeToType, type EvidenceMime } from './schema'

/**
 * Upload multiple files for a reflection. Server Action multipart pattern.
 *
 * FormData keys:
 *   - reflectionId: string
 *   - files: File[] (one or more)
 *
 * Returns count uploaded or first error encountered.
 */
export async function uploadAttachmentsAction(
  formData: FormData,
): Promise<ActionResult<{ count: number }>> {
  try {
    const scope = await requireScope()
    const reflectionId = String(formData.get('reflectionId') ?? '')
    if (!reflectionId) return err('VALIDATION', 'reflectionId required')

    const reflection = await prisma.teacherDailyReflection.findFirst({
      where: { id: reflectionId, schoolId: scope.schoolId, deletedAt: null },
    })
    if (!reflection) return err('NOT_FOUND', 'ไม่พบบันทึก')
    if (reflection.teacherUserId !== scope.user.id) {
      return err('PERMISSION_DENIED', 'แนบไฟล์ได้เฉพาะบันทึกของตนเอง')
    }

    const files = formData.getAll('files').filter((f): f is File => f instanceof File && f.size > 0)
    if (files.length === 0) return err('VALIDATION', 'ไม่มีไฟล์ที่อัปโหลด')

    // Validate first (fail fast — no partial writes)
    for (const file of files) {
      if (!ALLOWED_MIMES.includes(file.type as EvidenceMime)) {
        return err('INVALID_MIME', `ไฟล์ ${file.name} ประเภทไม่รองรับ (${file.type})`)
      }
      const type = mimeToType(file.type)
      if (file.size > MAX_SIZE[type]) {
        const limitMb = Math.round(MAX_SIZE[type] / (1024 * 1024))
        return err('FILE_TOO_LARGE', `ไฟล์ ${file.name} เกิน ${limitMb} MB`)
      }
    }

    const baseDir = path.join(
      env.UPLOAD_DIR,
      scope.schoolId,
      scope.academicYearLabel,
      scope.user.id,
    )
    await mkdir(baseDir, { recursive: true })

    // Parallel disk writes
    const written = await Promise.all(
      files.map(async (file) => {
        const id = randomUUID()
        const ext = (file.name.split('.').pop() ?? 'bin').toLowerCase().replace(/[^a-z0-9]/g, '')
        const filename = `${id}.${ext || 'bin'}`
        const fullPath = path.join(baseDir, filename)
        const buf = Buffer.from(await file.arrayBuffer())
        await writeFile(fullPath, buf)
        const relUrl = path.relative(env.UPLOAD_DIR, fullPath).replace(/\\/g, '/')
        return { id, file, relUrl }
      }),
    )

    // Single transaction for evidence + linker rows
    await prisma.$transaction(async (tx) => {
      for (const w of written) {
        await tx.evidenceFile.create({
          data: {
            id: w.id,
            schoolId: scope.schoolId,
            academicYearId: scope.academicYearId,
            classroomId: scope.classroomId,
            fileType: mimeToType(w.file.type),
            fileUrl: w.relUrl,
            fileSizeBytes: w.file.size,
            mimeType: w.file.type,
            title: w.file.name,
            uploadedByUserId: scope.user.id,
          },
        })
        await tx.reflectionAttachment.create({
          data: { reflectionId, evidenceFileId: w.id },
        })
      }
    })

    revalidatePath(`/teacher/reflections/${reflectionId}`)
    return ok({ count: written.length })
  } catch (e) {
    captureActionError('uploadAttachmentsAction', e)
    return err('INTERNAL', 'อัปโหลดไม่สำเร็จ')
  }
}

/** Remove a single attachment (linker row + file on disk). */
export async function removeAttachmentAction(input: {
  reflectionId: string
  evidenceFileId: string
}): Promise<ActionResult<{ id: string }>> {
  try {
    const scope = await requireScope()
    const reflection = await prisma.teacherDailyReflection.findFirst({
      where: { id: input.reflectionId, schoolId: scope.schoolId, deletedAt: null },
    })
    if (!reflection) return err('NOT_FOUND', 'ไม่พบบันทึก')
    if (reflection.teacherUserId !== scope.user.id) {
      return err('PERMISSION_DENIED', 'ลบได้เฉพาะของตนเอง')
    }

    const link = await prisma.reflectionAttachment.findFirst({
      where: { reflectionId: input.reflectionId, evidenceFileId: input.evidenceFileId },
    })
    if (!link) return err('NOT_FOUND', 'ไม่พบไฟล์แนบ')

    // Soft-delete evidence; remove linker row.
    await prisma.$transaction([
      prisma.reflectionAttachment.delete({ where: { id: link.id } }),
      prisma.evidenceFile.update({
        where: { id: input.evidenceFileId },
        data: { deletedAt: new Date() },
      }),
    ])

    revalidatePath(`/teacher/reflections/${input.reflectionId}`)
    return ok({ id: input.evidenceFileId })
  } catch (e) {
    captureActionError('removeAttachmentAction', e)
    return err('INTERNAL', 'ลบไฟล์แนบไม่สำเร็จ')
  }
}
