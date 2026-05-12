import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resetDb, seedBasic, testPrisma, type SeededIds } from '../../../tests/fixtures'

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

// Mock Resend SDK so the cron's email call path is exercisable without network.
const emailMock = vi.hoisted(() => ({
  send: vi.fn<
    (args: unknown) => Promise<{ data: { id: string } | null; error: { message: string } | null }>
  >(),
}))
vi.mock('resend', () => {
  class Resend {
    emails = emailMock
    constructor(_key: string) {}
  }
  return { Resend }
})

const { runDailyReminder } = await import('./daily-reminder')
const { _resetResendCache } = await import('@/server/email/resend-client')

const ORIGINAL_KEY = process.env.RESEND_API_KEY

function setKey(key: string | undefined) {
  if (key === undefined) delete process.env.RESEND_API_KEY
  else process.env.RESEND_API_KEY = key
  _resetResendCache()
}

afterEach(() => {
  setKey(ORIGINAL_KEY)
})

let ids: SeededIds

beforeEach(async () => {
  await resetDb()
  ids = await seedBasic()
})

// UTC midnight — Prisma @db.Date round-trips through UTC, so test rows
// MUST be inserted at UTC midnight to match the cron's query boundaries.
function midnight(d: Date): Date {
  const out = new Date(d)
  out.setUTCHours(0, 0, 0, 0)
  return out
}

describe('runDailyReminder — basic', () => {
  it('flags the seeded teacher as missing when no reflection exists', async () => {
    const results = await runDailyReminder({ triggeredBy: 'test' })

    expect(results).toHaveLength(1)
    expect(results[0].schoolId).toBe(ids.schoolId)
    expect(results[0].teachersTotal).toBe(1)
    expect(results[0].teachersMissing).toBe(1)
    expect(results[0].alreadyRanToday).toBe(false)
  })

  it('does NOT flag a teacher who has logged today', async () => {
    await testPrisma.teacherDailyReflection.create({
      data: {
        schoolId: ids.schoolId,
        academicYearId: ids.academicYearId,
        classroomId: ids.classroomId,
        teacherUserId: ids.teacherUserId,
        teacherPersonId: ids.teacherPersonId,
        reflectionDate: midnight(new Date()),
        whatHappened: 'logged today',
        status: 'draft',
      },
    })

    const results = await runDailyReminder({ triggeredBy: 'test' })
    expect(results[0].teachersMissing).toBe(0)
  })

  it('counts a soft-deleted reflection as MISSING (it does not count as today\'s log)', async () => {
    await testPrisma.teacherDailyReflection.create({
      data: {
        schoolId: ids.schoolId,
        academicYearId: ids.academicYearId,
        classroomId: ids.classroomId,
        teacherUserId: ids.teacherUserId,
        teacherPersonId: ids.teacherPersonId,
        reflectionDate: midnight(new Date()),
        whatHappened: 'will be deleted',
        status: 'draft',
        deletedAt: new Date(),
      },
    })

    const results = await runDailyReminder({ triggeredBy: 'test' })
    expect(results[0].teachersMissing).toBe(1)
  })

  it('skips inactive teachers', async () => {
    await testPrisma.user.update({
      where: { id: ids.teacherUserId },
      data: { status: 'suspended' },
    })

    const results = await runDailyReminder({ triggeredBy: 'test' })
    expect(results[0].teachersTotal).toBe(0)
    expect(results[0].teachersMissing).toBe(0)
  })
})

describe('runDailyReminder — idempotency', () => {
  it('second run on the same day is a no-op (alreadyRanToday=true)', async () => {
    const first = await runDailyReminder({ triggeredBy: 'test' })
    expect(first[0].alreadyRanToday).toBe(false)
    expect(first[0].teachersMissing).toBe(1)

    // Even if state changes between runs, the second run reads the cached row
    await testPrisma.teacherDailyReflection.create({
      data: {
        schoolId: ids.schoolId,
        academicYearId: ids.academicYearId,
        classroomId: ids.classroomId,
        teacherUserId: ids.teacherUserId,
        teacherPersonId: ids.teacherPersonId,
        reflectionDate: midnight(new Date()),
        whatHappened: 'late entry',
        status: 'draft',
      },
    })

    const second = await runDailyReminder({ triggeredBy: 'test' })
    expect(second[0].alreadyRanToday).toBe(true)
    // Reports stats from the FIRST run — not re-checked
    expect(second[0].teachersMissing).toBe(1)
  })

  it('persists an audit row in daily_reminder_logs', async () => {
    await runDailyReminder({ triggeredBy: 'test' })

    const logs = await testPrisma.dailyReminderLog.findMany()
    expect(logs).toHaveLength(1)
    expect(logs[0].schoolId).toBe(ids.schoolId)
    expect(logs[0].jobKind).toBe('reminder')
    expect(logs[0].triggeredBy).toBe('test')
    expect(logs[0].status).toBe('success')
    expect(logs[0].teachersTotal).toBe(1)
    expect(logs[0].teachersMissing).toBe(1)
    expect(logs[0].completedAt).toBeInstanceOf(Date)
  })
})

describe('runDailyReminder — multi-school', () => {
  it('processes each active school independently', async () => {
    // Seed second school + teacher
    const { seedSecondSchool } = await import('../../../tests/fixtures')
    const schoolB = await seedSecondSchool()

    const results = await runDailyReminder({ triggeredBy: 'test' })
    expect(results).toHaveLength(2)

    const a = results.find((r) => r.schoolId === ids.schoolId)
    const b = results.find((r) => r.schoolId === schoolB.schoolId)
    expect(a?.teachersTotal).toBe(1)
    expect(b?.teachersTotal).toBe(1)
  })

  it('skips schools without a current academic year', async () => {
    await testPrisma.academicYear.update({
      where: { id: ids.academicYearId },
      data: { isCurrent: false },
    })

    const results = await runDailyReminder({ triggeredBy: 'test' })
    expect(results).toHaveLength(0)
  })
})

describe('runDailyReminder — T-131 email integration', () => {
  beforeEach(() => {
    emailMock.send.mockReset()
  })

  it('without RESEND_API_KEY: notifications_sent stays 0 and Resend never called', async () => {
    setKey(undefined)

    const results = await runDailyReminder({ triggeredBy: 'test' })

    expect(emailMock.send).not.toHaveBeenCalled()
    expect(results[0].notificationsSent).toBe(0)
    expect(results[0].teachersMissing).toBe(1)

    const log = await testPrisma.dailyReminderLog.findFirstOrThrow()
    expect(log.notificationsSent).toBe(0)
    expect((log.details as { emailMode?: string })?.emailMode).toBe('dry_run')
  })

  it('with RESEND_API_KEY: sends one email per missing teacher, counts increments', async () => {
    setKey('re_test_key_long_enough_to_pass_check')
    emailMock.send.mockResolvedValue({ data: { id: 'msg_001' }, error: null })

    const results = await runDailyReminder({ triggeredBy: 'test' })

    expect(emailMock.send).toHaveBeenCalledOnce()
    const call = emailMock.send.mock.calls[0][0] as { to: string; subject: string; text: string }
    expect(call.to).toBe('teacher@test.local')
    expect(call.subject).toContain('โรงเรียนทดสอบ')

    expect(results[0].notificationsSent).toBe(1)
    const log = await testPrisma.dailyReminderLog.findFirstOrThrow()
    expect(log.notificationsSent).toBe(1)
    expect((log.details as { emailMode?: string })?.emailMode).toBe('live')
  })

  it('email failure does NOT poison the run — log records success but counts the failure', async () => {
    setKey('re_test_key_long_enough_to_pass_check')
    emailMock.send.mockRejectedValue(new Error('SMTP down'))

    const results = await runDailyReminder({ triggeredBy: 'test' })

    // Cron itself succeeded — email failure shouldn't surface as cron error
    expect(results[0].teachersMissing).toBe(1)
    expect(results[0].notificationsSent).toBe(0) // failed to send

    const log = await testPrisma.dailyReminderLog.findFirstOrThrow()
    expect(log.status).toBe('success')
    expect(log.notificationsSent).toBe(0)
    const details = log.details as { sendFailures?: Array<{ reason: string }> }
    expect(details.sendFailures).toBeDefined()
    expect(details.sendFailures!.length).toBe(1)
    expect(details.sendFailures![0].reason).toContain('SMTP down')
  })

  it('only sends to missing teachers, never to teachers who already logged', async () => {
    setKey('re_test_key_long_enough_to_pass_check')
    emailMock.send.mockResolvedValue({ data: { id: 'x' }, error: null })

    // Pre-create today's reflection so the teacher is NOT missing
    await testPrisma.teacherDailyReflection.create({
      data: {
        schoolId: ids.schoolId,
        academicYearId: ids.academicYearId,
        classroomId: ids.classroomId,
        teacherUserId: ids.teacherUserId,
        teacherPersonId: ids.teacherPersonId,
        reflectionDate: midnight(new Date()),
        whatHappened: 'already logged',
        status: 'draft',
      },
    })

    await runDailyReminder({ triggeredBy: 'test' })

    expect(emailMock.send).not.toHaveBeenCalled()
  })
})
