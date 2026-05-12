import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { stat } from 'node:fs/promises'
import path from 'node:path'
import {
  resetDb,
  seedBasic,
  fakeScope,
  testPrisma,
  cleanUploadDir,
  type SeededIds,
} from '../../../tests/fixtures'

const scopeMock = vi.hoisted(() => ({ current: null as ReturnType<typeof fakeScope> | null }))
vi.mock('@/server/tenant/scope', () => ({
  requireScope: async () => {
    if (!scopeMock.current) throw new Error('no fake scope set')
    return scopeMock.current
  },
  resolveCurrentScope: async () => scopeMock.current,
  SCOPE_COOKIE_NAME: 'snx_test_school',
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

const { uploadAttachmentsAction, removeAttachmentAction } = await import('./upload')
const { createReflectionAction } = await import('@/server/reflection/actions')

let ids: SeededIds

function makeFile(name: string, mime: string, sizeBytes: number): File {
  const bytes = new Uint8Array(sizeBytes)
  // Mark first few bytes so we can verify content roundtrips
  for (let i = 0; i < Math.min(16, sizeBytes); i++) bytes[i] = (i + 7) & 0xff
  return new File([bytes], name, { type: mime })
}

beforeEach(async () => {
  await resetDb()
  await cleanUploadDir()
  ids = await seedBasic()
  scopeMock.current = fakeScope({ ids, role: 'teacher' })
})

afterEach(async () => {
  await cleanUploadDir()
})

async function createReflection(): Promise<string> {
  const r = await createReflectionAction({
    reflectionDate: '2026-05-11',
    whatHappened: 'test',
  })
  if (!r.ok) throw new Error('create failed: ' + r.error)
  return r.data.id
}

describe('uploadAttachmentsAction — happy path', () => {
  it('writes file to disk and creates evidence + attachment rows in one tx', async () => {
    const reflectionId = await createReflection()

    const fd = new FormData()
    fd.append('reflectionId', reflectionId)
    fd.append('files', makeFile('photo.jpg', 'image/jpeg', 2048))

    const r = await uploadAttachmentsAction(fd)
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.data.count).toBe(1)

    const evidence = await testPrisma.evidenceFile.findMany({
      where: { schoolId: ids.schoolId },
    })
    expect(evidence).toHaveLength(1)
    expect(evidence[0].fileType).toBe('image')
    expect(evidence[0].fileSizeBytes).toBe(2048)
    expect(evidence[0].mimeType).toBe('image/jpeg')
    expect(evidence[0].title).toBe('photo.jpg')
    expect(evidence[0].uploadedByUserId).toBe(ids.teacherUserId)

    const links = await testPrisma.reflectionAttachment.findMany({ where: { reflectionId } })
    expect(links).toHaveLength(1)
    expect(links[0].evidenceFileId).toBe(evidence[0].id)

    // File exists on disk under {school}/{year}/{user}/
    const uploadRoot = path.resolve(process.cwd(), process.env.UPLOAD_DIR!)
    const absPath = path.join(uploadRoot, evidence[0].fileUrl)
    const st = await stat(absPath)
    expect(st.size).toBe(2048)
  })

  it('handles multiple files in one request', async () => {
    const reflectionId = await createReflection()
    const fd = new FormData()
    fd.append('reflectionId', reflectionId)
    fd.append('files', makeFile('a.jpg', 'image/jpeg', 1024))
    fd.append('files', makeFile('b.pdf', 'application/pdf', 3000))
    fd.append('files', makeFile('c.png', 'image/png', 2048))

    const r = await uploadAttachmentsAction(fd)
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.data.count).toBe(3)

    expect(await testPrisma.evidenceFile.count()).toBe(3)
    expect(await testPrisma.reflectionAttachment.count({ where: { reflectionId } })).toBe(3)
  })
})

describe('uploadAttachmentsAction — error paths', () => {
  it('rejects when no files provided', async () => {
    const reflectionId = await createReflection()
    const fd = new FormData()
    fd.append('reflectionId', reflectionId)

    const r = await uploadAttachmentsAction(fd)
    expect(r.ok).toBe(false)
    if (r.ok) return
    expect(r.code).toBe('VALIDATION')
  })

  it('rejects unknown MIME (e.g., SVG — common XSS vector)', async () => {
    const reflectionId = await createReflection()
    const fd = new FormData()
    fd.append('reflectionId', reflectionId)
    fd.append('files', makeFile('xss.svg', 'image/svg+xml', 100))

    const r = await uploadAttachmentsAction(fd)
    expect(r.ok).toBe(false)
    if (r.ok) return
    expect(r.code).toBe('INVALID_MIME')

    // CRITICAL: nothing persisted
    expect(await testPrisma.evidenceFile.count()).toBe(0)
    expect(await testPrisma.reflectionAttachment.count()).toBe(0)
  })

  it('rejects file over the per-type size cap (image > 10MB)', async () => {
    const reflectionId = await createReflection()
    const fd = new FormData()
    fd.append('reflectionId', reflectionId)
    // 11 MB JPEG — over the 10 MB image cap
    fd.append('files', makeFile('huge.jpg', 'image/jpeg', 11 * 1024 * 1024))

    const r = await uploadAttachmentsAction(fd)
    expect(r.ok).toBe(false)
    if (r.ok) return
    expect(r.code).toBe('FILE_TOO_LARGE')

    expect(await testPrisma.evidenceFile.count()).toBe(0)
  })

  it('rejects if even one file in a multi-upload is invalid (atomic)', async () => {
    const reflectionId = await createReflection()
    const fd = new FormData()
    fd.append('reflectionId', reflectionId)
    fd.append('files', makeFile('ok.jpg', 'image/jpeg', 1024))
    fd.append('files', makeFile('bad.exe', 'application/octet-stream', 100))

    const r = await uploadAttachmentsAction(fd)
    expect(r.ok).toBe(false)
    if (r.ok) return
    expect(r.code).toBe('INVALID_MIME')

    // Atomicity: zero rows even though one file was valid
    expect(await testPrisma.evidenceFile.count()).toBe(0)
  })

  it('rejects upload to another teacher\'s reflection', async () => {
    const reflectionId = await createReflection()

    // Switch to a different user (still teacher role)
    scopeMock.current = {
      ...fakeScope({ ids, role: 'teacher' }),
      user: { id: 'evil-user', personId: 'evil-person', email: 'evil@x' },
    }
    const fd = new FormData()
    fd.append('reflectionId', reflectionId)
    fd.append('files', makeFile('a.jpg', 'image/jpeg', 1024))

    const r = await uploadAttachmentsAction(fd)
    expect(r.ok).toBe(false)
    if (r.ok) return
    expect(r.code).toBe('PERMISSION_DENIED')
    expect(await testPrisma.evidenceFile.count()).toBe(0)
  })

  it('rejects when reflection does not exist', async () => {
    const fd = new FormData()
    fd.append('reflectionId', '00000000-0000-0000-0000-000000000000')
    fd.append('files', makeFile('a.jpg', 'image/jpeg', 1024))

    const r = await uploadAttachmentsAction(fd)
    expect(r.ok).toBe(false)
    if (r.ok) return
    expect(r.code).toBe('NOT_FOUND')
  })
})

describe('removeAttachmentAction', () => {
  it('soft-deletes the evidence and removes the linker', async () => {
    const reflectionId = await createReflection()
    const fd = new FormData()
    fd.append('reflectionId', reflectionId)
    fd.append('files', makeFile('a.jpg', 'image/jpeg', 512))
    await uploadAttachmentsAction(fd)

    const evidence = await testPrisma.evidenceFile.findFirstOrThrow()
    const r = await removeAttachmentAction({ reflectionId, evidenceFileId: evidence.id })
    expect(r.ok).toBe(true)

    // Linker gone
    expect(await testPrisma.reflectionAttachment.count({ where: { reflectionId } })).toBe(0)
    // Evidence soft-deleted, not hard
    const ev = await testPrisma.evidenceFile.findUniqueOrThrow({ where: { id: evidence.id } })
    expect(ev.deletedAt).toBeInstanceOf(Date)
  })

  it('blocks removing another teacher\'s attachment', async () => {
    const reflectionId = await createReflection()
    const fd = new FormData()
    fd.append('reflectionId', reflectionId)
    fd.append('files', makeFile('a.jpg', 'image/jpeg', 512))
    await uploadAttachmentsAction(fd)
    const evidence = await testPrisma.evidenceFile.findFirstOrThrow()

    scopeMock.current = {
      ...fakeScope({ ids, role: 'teacher' }),
      user: { id: 'other', personId: 'other-p', email: 'o@x' },
    }
    const r = await removeAttachmentAction({ reflectionId, evidenceFileId: evidence.id })
    expect(r.ok).toBe(false)
    if (r.ok) return
    expect(r.code).toBe('PERMISSION_DENIED')

    // Nothing changed
    expect(await testPrisma.reflectionAttachment.count({ where: { reflectionId } })).toBe(1)
  })
})
