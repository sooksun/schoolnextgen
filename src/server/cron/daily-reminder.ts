import 'server-only'
import { prisma } from '@/lib/db'
import { captureActionError } from '@/lib/observability'
import { sendReminderEmail, type SendResult } from '@/server/email/send-reminder'

export type ReminderResult = {
  schoolId: string
  schoolName: string
  date: string // ISO date YYYY-MM-DD
  teachersTotal: number
  teachersMissing: number
  notificationsSent: number
  alreadyRanToday: boolean
}

/**
 * For each school that has a current academic year, find teachers (role=teacher,
 * status=active) who do NOT have a non-deleted Reflection with reflectionDate = today.
 *
 * Idempotent per (school, date) — a UNIQUE constraint on daily_reminder_logs
 * prevents running twice on the same school on the same day. A second run
 * returns `alreadyRanToday: true` and does not re-notify.
 *
 * Currently logs only. T-131 (Resend) will plug into the per-teacher loop
 * below to send emails.
 */
export async function runDailyReminder(opts: {
  triggeredBy: 'schedule' | 'manual' | 'test'
  now?: Date // override for testing
}): Promise<ReminderResult[]> {
  const now = opts.now ?? new Date()
  // Prisma's @db.Date column round-trips through UTC. Use UTC midnight
  // for both writes and range queries so they align — otherwise local
  // midnight can shift the date by ±1 day on storage.
  const today = startOfUtcDay(now)
  const tomorrow = new Date(today)
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)

  const isoDate = formatIsoDate(today)
  const results: ReminderResult[] = []

  const schools = await prisma.school.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      academicYears: {
        where: { isCurrent: true },
        select: { id: true },
      },
    },
  })

  for (const school of schools) {
    if (school.academicYears.length === 0) continue
    const academicYearId = school.academicYears[0].id

    // Idempotency: try to claim today's slot. If already exists → skip.
    const existing = await prisma.dailyReminderLog.findUnique({
      where: {
        uq_reminder_log_school_date_kind: {
          schoolId: school.id,
          runDate: today,
          jobKind: 'reminder',
        },
      },
    })
    if (existing) {
      results.push({
        schoolId: school.id,
        schoolName: school.name,
        date: isoDate,
        teachersTotal: existing.teachersTotal,
        teachersMissing: existing.teachersMissing,
        notificationsSent: existing.notificationsSent,
        alreadyRanToday: true,
      })
      continue
    }

    const logRow = await prisma.dailyReminderLog.create({
      data: {
        schoolId: school.id,
        runDate: today,
        jobKind: 'reminder',
        triggeredBy: opts.triggeredBy,
        status: 'running',
      },
    })

    try {
      const teacherRole = await prisma.role.findUnique({ where: { code: 'teacher' } })
      if (!teacherRole) {
        // Without the teacher role we cannot identify recipients — log + skip.
        await prisma.dailyReminderLog.update({
          where: { id: logRow.id },
          data: {
            status: 'success',
            completedAt: new Date(),
            details: { reason: 'no_teacher_role' },
          },
        })
        continue
      }

      const teachers = await prisma.user.findMany({
        where: {
          status: 'active',
          schoolMemberships: {
            some: {
              schoolId: school.id,
              academicYearId,
              roleId: teacherRole.id,
              status: 'active',
            },
          },
        },
        select: {
          id: true,
          email: true,
          personId: true,
          person: { select: { displayName: true } },
        },
      })

      const appUrl = process.env.PUBLIC_APP_URL ?? 'http://localhost:3000'
      let teachersMissing = 0
      let notificationsSent = 0
      const missingIds: string[] = []
      const sendResults: Array<{ userId: string; result: SendResult }> = []

      for (const t of teachers) {
        const has = await prisma.teacherDailyReflection.findFirst({
          where: {
            teacherUserId: t.id,
            schoolId: school.id,
            reflectionDate: { gte: today, lt: tomorrow },
            deletedAt: null,
          },
          select: { id: true },
        })
        if (has) continue
        teachersMissing++
        missingIds.push(t.id)

        // T-131: send reminder email. Opt-in via RESEND_API_KEY. Always returns
        // a SendResult; never throws — so one teacher's email failure can't
        // poison the cron run.
        const result = await sendReminderEmail({
          to: t.email,
          teacherName: t.person?.displayName ?? null,
          schoolName: school.name,
          appUrl,
        })
        sendResults.push({ userId: t.id, result })
        if (result.sent) notificationsSent++
      }

      await prisma.dailyReminderLog.update({
        where: { id: logRow.id },
        data: {
          status: 'success',
          completedAt: new Date(),
          teachersTotal: teachers.length,
          teachersMissing,
          notificationsSent,
          details: {
            missingUserIds: missingIds.slice(0, 50),
            emailMode: sendResults.find((s) => s.result.sent || s.result.dryRun === false)
              ? 'live'
              : 'dry_run',
            sendFailures: sendResults
              .filter((s) => !s.result.sent && !('dryRun' in s.result && s.result.dryRun))
              .map((s) => ({ userId: s.userId, reason: (s.result as { reason: string }).reason }))
              .slice(0, 50),
          },
        },
      })

      results.push({
        schoolId: school.id,
        schoolName: school.name,
        date: isoDate,
        teachersTotal: teachers.length,
        teachersMissing,
        notificationsSent,
        alreadyRanToday: false,
      })
    } catch (e) {
      await prisma.dailyReminderLog.update({
        where: { id: logRow.id },
        data: {
          status: 'error',
          completedAt: new Date(),
          errorMessage: e instanceof Error ? e.message.slice(0, 1000) : String(e),
        },
      })
      captureActionError('cron.daily-reminder', e, { schoolId: school.id })
    }
  }

  return results
}

/**
 * UTC midnight of the same UTC calendar day as `d`. Use for DATE-column
 * round-trips through Prisma (which serializes via toISOString).
 */
export function startOfUtcDay(d: Date): Date {
  const out = new Date(d)
  out.setUTCHours(0, 0, 0, 0)
  return out
}

function formatIsoDate(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}
