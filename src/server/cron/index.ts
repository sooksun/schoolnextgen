import 'server-only'
import * as cron from 'node-cron'
import { runDailyReminder } from './daily-reminder'
import { cleanupExpiredSessions } from './cleanup-sessions'

export type TriggerKind = 'schedule' | 'manual' | 'test'

/**
 * Job registry. Keys are job names (used by /api/cron/[job] manual trigger).
 * Each handler is idempotent — safe to invoke multiple times.
 * Pass the trigger kind so the audit log reflects the actual source.
 */
export const JOBS = {
  'daily-reminder': (trigger: TriggerKind = 'schedule') =>
    runDailyReminder({ triggeredBy: trigger }),
  'cleanup-sessions': (_trigger?: TriggerKind) => cleanupExpiredSessions(),
} as const

export type JobName = keyof typeof JOBS

const TIMEZONE = 'Asia/Bangkok'

let started = false

/**
 * Start all cron schedules. Called once from instrumentation.ts.
 *
 * No-op if:
 *   - CRON_ENABLED !== 'true' (default off in dev/test, on in prod docker)
 *   - Already started in this process (defensive against hot reload)
 *   - NODE_ENV === 'test' (vitest must never spin up real cron timers)
 */
export function startCronJobs(): void {
  if (started) return
  if (process.env.NODE_ENV === 'test') return
  if (process.env.CRON_ENABLED !== 'true') {
    console.log('[cron] Disabled (set CRON_ENABLED=true to enable)')
    return
  }

  started = true

  // Daily reminder — 15:30 weekdays (Mon-Fri) in Bangkok time
  cron.schedule(
    '30 15 * * 1-5',
    async () => {
      console.log('[cron] daily-reminder firing')
      try {
        const results = await runDailyReminder({ triggeredBy: 'schedule' })
        const totalMissing = results.reduce((sum, r) => sum + r.teachersMissing, 0)
        console.log(`[cron] daily-reminder OK — ${results.length} school(s), ${totalMissing} teacher(s) missing today`)
      } catch (e) {
        console.error('[cron] daily-reminder FAILED', e)
      }
    },
    { timezone: TIMEZONE },
  )

  // Session cleanup — 03:00 daily
  cron.schedule(
    '0 3 * * *',
    async () => {
      console.log('[cron] cleanup-sessions firing')
      try {
        const { deleted } = await cleanupExpiredSessions()
        console.log(`[cron] cleanup-sessions OK — deleted ${deleted} expired session(s)`)
      } catch (e) {
        console.error('[cron] cleanup-sessions FAILED', e)
      }
    },
    { timezone: TIMEZONE },
  )

  console.log(`[cron] 2 job(s) scheduled (tz=${TIMEZONE})`)
}
