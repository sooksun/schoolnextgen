import { beforeEach, describe, expect, it, vi } from 'vitest'
import { resetDb, seedBasic, fakeScope, testPrisma, type SeededIds } from '../../../tests/fixtures'

// Mock scope resolver — actions call requireScope() which would normally
// read cookies. We stub it to return our test scope.
const scopeMock = vi.hoisted(() => ({
  current: null as ReturnType<typeof fakeScope> | null,
}))
vi.mock('@/server/tenant/scope', () => ({
  requireScope: async () => {
    if (!scopeMock.current) throw new Error('no fake scope set')
    return scopeMock.current
  },
  resolveCurrentScope: async () => scopeMock.current,
  SCOPE_COOKIE_NAME: 'snx_test_school',
}))

// next/cache revalidatePath is fine to stub — we just want it to no-op
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Use the real Prisma client (via lib/db) — wire it to test DB
// (DATABASE_URL is already overridden by .env.test in setup.ts before any import)

// Import actions AFTER mocks are set up
const {
  createReflectionAction,
  updateReflectionAction,
  deleteReflectionAction,
  confirmAiSummaryAction,
} = await import('./actions')

let ids: SeededIds

beforeEach(async () => {
  await resetDb()
  ids = await seedBasic()
})

describe('createReflectionAction', () => {
  it('creates a reflection for the teacher', async () => {
    scopeMock.current = fakeScope({ ids, role: 'teacher' })

    const result = await createReflectionAction({
      reflectionDate: '2026-05-11',
      subject: 'ภาษาไทย',
      topic: 'คำควบกล้ำ',
      whatHappened: 'สอนได้ดี',
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data.id).toBeTruthy()

    const row = await testPrisma.teacherDailyReflection.findUnique({
      where: { id: result.data.id },
    })
    expect(row?.teacherUserId).toBe(ids.teacherUserId)
    expect(row?.schoolId).toBe(ids.schoolId)
    expect(row?.academicYearId).toBe(ids.academicYearId)
    expect(row?.classroomId).toBe(ids.classroomId)
    expect(row?.status).toBe('draft')
    expect(row?.subject).toBe('ภาษาไทย')
    expect(row?.deletedAt).toBeNull()
  })

  it('rejects director (not a teacher)', async () => {
    scopeMock.current = fakeScope({ ids, role: 'director' })

    const result = await createReflectionAction({
      reflectionDate: '2026-05-11',
      whatHappened: 'test',
    })

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.code).toBe('PERMISSION_DENIED')
  })

  it('rejects empty payload (no content fields)', async () => {
    scopeMock.current = fakeScope({ ids, role: 'teacher' })

    const result = await createReflectionAction({
      reflectionDate: '2026-05-11',
    })

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.code).toBe('VALIDATION')
  })

  it('rejects invalid date format', async () => {
    scopeMock.current = fakeScope({ ids, role: 'teacher' })

    const result = await createReflectionAction({
      reflectionDate: 'not-a-date',
      whatHappened: 'x',
    })

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.code).toBe('VALIDATION')
  })
})

describe('updateReflectionAction', () => {
  async function createOne() {
    scopeMock.current = fakeScope({ ids, role: 'teacher' })
    const r = await createReflectionAction({
      reflectionDate: '2026-05-11',
      whatHappened: 'original',
    })
    if (!r.ok) throw new Error('seed failed')
    return r.data.id
  }

  it('teacher updates own reflection', async () => {
    const id = await createOne()
    const r = await updateReflectionAction({
      id,
      whatHappened: 'edited content',
    })
    expect(r.ok).toBe(true)
    const row = await testPrisma.teacherDailyReflection.findUnique({ where: { id } })
    expect(row?.whatHappened).toBe('edited content')
  })

  it("blocks editing another teacher's reflection", async () => {
    const id = await createOne()
    // Switch to a different teacher (re-use directorUser as a stand-in non-owner with teacher role)
    scopeMock.current = {
      ...fakeScope({ ids, role: 'teacher' }),
      user: {
        id: ids.directorUserId,
        personId: 'someone-else',
        email: 'someone@test.local',
      },
    }

    const r = await updateReflectionAction({ id, whatHappened: 'evil' })
    expect(r.ok).toBe(false)
    if (r.ok) return
    expect(r.code).toBe('PERMISSION_DENIED')

    const row = await testPrisma.teacherDailyReflection.findUnique({ where: { id } })
    expect(row?.whatHappened).toBe('original') // unchanged
  })

  it('rejects updates to non-existent reflection', async () => {
    scopeMock.current = fakeScope({ ids, role: 'teacher' })
    const r = await updateReflectionAction({
      id: '00000000-0000-0000-0000-000000000000',
      whatHappened: 'x',
    })
    expect(r.ok).toBe(false)
    if (r.ok) return
    expect(r.code).toBe('NOT_FOUND')
  })
})

describe('deleteReflectionAction', () => {
  async function createOne() {
    scopeMock.current = fakeScope({ ids, role: 'teacher' })
    const r = await createReflectionAction({
      reflectionDate: '2026-05-11',
      whatHappened: 'to be deleted',
    })
    if (!r.ok) throw new Error('seed failed')
    return r.data.id
  }

  it('teacher soft-deletes own draft', async () => {
    const id = await createOne()
    const r = await deleteReflectionAction({ id })
    expect(r.ok).toBe(true)

    const row = await testPrisma.teacherDailyReflection.findUnique({ where: { id } })
    expect(row).toBeTruthy()
    expect(row?.deletedAt).toBeInstanceOf(Date) // soft delete, not hard
  })

  it("blocks deleting another teacher's reflection", async () => {
    const id = await createOne()
    scopeMock.current = {
      ...fakeScope({ ids, role: 'teacher' }),
      user: { id: 'other', personId: 'other-p', email: 'other@x' },
    }
    const r = await deleteReflectionAction({ id })
    expect(r.ok).toBe(false)

    const row = await testPrisma.teacherDailyReflection.findUnique({ where: { id } })
    expect(row?.deletedAt).toBeNull() // not deleted
  })

  it('blocks deleting non-draft reflection (e.g., ai_summarized)', async () => {
    const id = await createOne()
    // Manually advance state to simulate AI summary having run
    await testPrisma.teacherDailyReflection.update({
      where: { id },
      data: { status: 'ai_summarized' },
    })

    scopeMock.current = fakeScope({ ids, role: 'teacher' })
    const r = await deleteReflectionAction({ id })
    expect(r.ok).toBe(false)
    if (r.ok) return
    expect(r.code).toBe('PERMISSION_DENIED')
  })
})

describe('confirmAiSummaryAction', () => {
  /**
   * Sets up a reflection that has already been through AI summarize — i.e.,
   * has aiSummary populated and status=ai_summarized. From here the teacher
   * may edit tags before confirming.
   */
  async function createAiSummarizedReflection(): Promise<string> {
    scopeMock.current = fakeScope({ ids, role: 'teacher' })
    const r = await createReflectionAction({
      reflectionDate: '2026-05-11',
      whatHappened: 'พื้นฐาน',
    })
    if (!r.ok) throw new Error('seed')
    await testPrisma.teacherDailyReflection.update({
      where: { id: r.data.id },
      data: {
        status: 'ai_summarized',
        aiSummary: 'AI สรุปแล้ว',
        aiTags: ['อ่านออกเขียนได้', 'Active Learning'],
      },
    })
    return r.data.id
  }

  it('teacher confirms with the AI-generated tags unchanged', async () => {
    const id = await createAiSummarizedReflection()
    const r = await confirmAiSummaryAction({
      id,
      summary: 'AI สรุปแล้ว',
      tags: ['อ่านออกเขียนได้', 'Active Learning'],
    })
    expect(r.ok).toBe(true)
    const row = await testPrisma.teacherDailyReflection.findUniqueOrThrow({ where: { id } })
    expect(row.status).toBe('teacher_confirmed')
    expect(row.aiTags).toEqual(['อ่านออกเขียนได้', 'Active Learning'])
  })

  it('teacher edits tags before confirming — edits persist (D-4 contract)', async () => {
    const id = await createAiSummarizedReflection()
    const r = await confirmAiSummaryAction({
      id,
      summary: 'AI สรุปแล้ว',
      // Removed one AI tag, added two custom tags
      tags: ['อ่านออกเขียนได้', 'จิตศึกษา', 'ห้องเรียน ป.2'],
    })
    expect(r.ok).toBe(true)
    const row = await testPrisma.teacherDailyReflection.findUniqueOrThrow({ where: { id } })
    expect(row.status).toBe('teacher_confirmed')
    expect(row.aiTags).toEqual(['อ่านออกเขียนได้', 'จิตศึกษา', 'ห้องเรียน ป.2'])
    expect(row.aiTags).not.toContain('Active Learning')
  })

  it('rejects confirm from another teacher', async () => {
    const id = await createAiSummarizedReflection()
    scopeMock.current = {
      ...fakeScope({ ids, role: 'teacher' }),
      user: { id: 'evil', personId: 'evil-p', email: 'e@x' },
    }
    const r = await confirmAiSummaryAction({ id, summary: 'evil', tags: [] })
    expect(r.ok).toBe(false)
    if (r.ok) return
    expect(r.code).toBe('PERMISSION_DENIED')

    const row = await testPrisma.teacherDailyReflection.findUniqueOrThrow({ where: { id } })
    expect(row.status).toBe('ai_summarized') // unchanged
    expect(row.aiSummary).toBe('AI สรุปแล้ว') // unchanged
  })

  it('rejects when reflection has neither existing nor new AI summary', async () => {
    scopeMock.current = fakeScope({ ids, role: 'teacher' })
    const r = await createReflectionAction({
      reflectionDate: '2026-05-11',
      whatHappened: 'draft only',
    })
    if (!r.ok) throw new Error('seed')

    const confirm = await confirmAiSummaryAction({ id: r.data.id, tags: [] })
    expect(confirm.ok).toBe(false)
    if (confirm.ok) return
    expect(confirm.code).toBe('VALIDATION')
  })
})
