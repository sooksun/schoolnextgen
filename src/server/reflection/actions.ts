'use server'

import 'server-only'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { requireScope } from '@/server/tenant/scope'
import { can } from '@/lib/scope/can'
import {
  ActionError,
  err,
  ok,
  requirePermission,
  type ActionResult,
} from '@/lib/result'
import { captureActionError } from '@/lib/observability'
import {
  CreateReflectionInput,
  UpdateReflectionInput,
  ReflectionIdInput,
} from './schema'

function toDate(v: Date | string): Date {
  if (v instanceof Date) return v
  // YYYY-MM-DD → Date at local midnight
  const [y, m, d] = v.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export async function createReflectionAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const scope = await requireScope()
    requirePermission(can.createReflection(scope), 'ต้องเป็นครูประจำชั้น')

    const parsed = CreateReflectionInput.safeParse(input)
    if (!parsed.success) {
      return err('VALIDATION', parsed.error.issues[0]?.message ?? 'ข้อมูลไม่ครบถ้วน')
    }
    const data = parsed.data

    const created = await prisma.teacherDailyReflection.create({
      data: {
        schoolId: scope.schoolId,
        academicYearId: scope.academicYearId,
        academicTermId: data.academicTermId ?? scope.academicTermId ?? null,
        classroomId: data.classroomId ?? scope.classroomId ?? null,
        teacherUserId: scope.user.id,
        teacherPersonId: scope.user.personId,
        reflectionDate: toDate(data.reflectionDate),
        periodNo: data.periodNo ?? null,
        subject: data.subject ?? null,
        topic: data.topic ?? null,
        whatHappened: data.whatHappened ?? null,
        whatStudentsDid: data.whatStudentsDid ?? null,
        successes: data.successes ?? null,
        problems: data.problems ?? null,
        nextImprovement: data.nextImprovement ?? null,
        summaryShort: data.summaryShort ?? null,
        status: 'draft',
      },
      select: { id: true },
    })

    revalidatePath('/teacher/reflections')
    return ok({ id: created.id })
  } catch (e) {
    if (e instanceof ActionError) return err(e.code, e.message)
    captureActionError('createReflectionAction', e)
    return err('INTERNAL', 'เกิดข้อผิดพลาดในระบบ')
  }
}

export async function updateReflectionAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const scope = await requireScope()
    const parsed = UpdateReflectionInput.safeParse(input)
    if (!parsed.success) {
      return err('VALIDATION', parsed.error.issues[0]?.message ?? 'ข้อมูลไม่ครบถ้วน')
    }
    const { id, ...rest } = parsed.data

    const existing = await prisma.teacherDailyReflection.findFirst({
      where: { id, schoolId: scope.schoolId, deletedAt: null },
    })
    if (!existing) return err('NOT_FOUND', 'ไม่พบบันทึก')
    requirePermission(can.editReflection(scope, existing), 'ไม่สามารถแก้ไขบันทึกนี้')

    const updated = await prisma.teacherDailyReflection.update({
      where: { id },
      data: {
        ...(rest.reflectionDate !== undefined ? { reflectionDate: toDate(rest.reflectionDate) } : {}),
        ...(rest.classroomId !== undefined ? { classroomId: rest.classroomId } : {}),
        ...(rest.academicTermId !== undefined ? { academicTermId: rest.academicTermId } : {}),
        ...(rest.periodNo !== undefined ? { periodNo: rest.periodNo } : {}),
        ...(rest.subject !== undefined ? { subject: rest.subject } : {}),
        ...(rest.topic !== undefined ? { topic: rest.topic } : {}),
        ...(rest.whatHappened !== undefined ? { whatHappened: rest.whatHappened } : {}),
        ...(rest.whatStudentsDid !== undefined ? { whatStudentsDid: rest.whatStudentsDid } : {}),
        ...(rest.successes !== undefined ? { successes: rest.successes } : {}),
        ...(rest.problems !== undefined ? { problems: rest.problems } : {}),
        ...(rest.nextImprovement !== undefined ? { nextImprovement: rest.nextImprovement } : {}),
        ...(rest.summaryShort !== undefined ? { summaryShort: rest.summaryShort } : {}),
      },
      select: { id: true },
    })

    revalidatePath(`/teacher/reflections/${id}`)
    revalidatePath('/teacher/reflections')
    return ok({ id: updated.id })
  } catch (e) {
    if (e instanceof ActionError) return err(e.code, e.message)
    captureActionError('updateReflectionAction', e)
    return err('INTERNAL', 'เกิดข้อผิดพลาดในระบบ')
  }
}

export async function deleteReflectionAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const scope = await requireScope()
    const parsed = ReflectionIdInput.safeParse(input)
    if (!parsed.success) return err('VALIDATION', 'invalid id')
    const { id } = parsed.data

    const existing = await prisma.teacherDailyReflection.findFirst({
      where: { id, schoolId: scope.schoolId, deletedAt: null },
    })
    if (!existing) return err('NOT_FOUND', 'ไม่พบบันทึก')
    requirePermission(can.deleteReflection(scope, existing), 'ลบได้เฉพาะ draft ของตนเอง')

    await prisma.teacherDailyReflection.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    revalidatePath('/teacher/reflections')
    return ok({ id })
  } catch (e) {
    if (e instanceof ActionError) return err(e.code, e.message)
    captureActionError('deleteReflectionAction', e)
    return err('INTERNAL', 'เกิดข้อผิดพลาดในระบบ')
  }
}

/**
 * Teacher confirms the AI summary → status moves to teacher_confirmed.
 * Optionally accepts edited summary + tags.
 */
export async function confirmAiSummaryAction(input: {
  id: string
  summary?: string
  tags?: string[]
}): Promise<ActionResult<{ id: string }>> {
  try {
    const scope = await requireScope()
    const id = String(input?.id ?? '')
    if (!id) return err('VALIDATION', 'invalid id')

    const existing = await prisma.teacherDailyReflection.findFirst({
      where: { id, schoolId: scope.schoolId, deletedAt: null },
    })
    if (!existing) return err('NOT_FOUND', 'ไม่พบบันทึก')
    requirePermission(can.editReflection(scope, existing), 'ไม่สามารถยืนยันบันทึกนี้')

    if (!existing.aiSummary && !input.summary) {
      return err('VALIDATION', 'ยังไม่มี AI summary ให้ยืนยัน')
    }

    await prisma.teacherDailyReflection.update({
      where: { id },
      data: {
        aiSummary: input.summary ?? existing.aiSummary,
        aiTags: input.tags ?? (existing.aiTags as never),
        status: 'teacher_confirmed',
      },
    })

    revalidatePath(`/teacher/reflections/${id}`)
    revalidatePath('/teacher/reflections')
    return ok({ id })
  } catch (e) {
    if (e instanceof ActionError) return err(e.code, e.message)
    captureActionError('confirmAiSummaryAction', e)
    return err('INTERNAL', 'เกิดข้อผิดพลาดในระบบ')
  }
}
