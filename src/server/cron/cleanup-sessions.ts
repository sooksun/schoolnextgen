import 'server-only'
import { prisma } from '@/lib/db'

/**
 * Delete sessions whose expiresAt is more than 1 day in the past.
 * Idempotent — running it twice the same day is fine, it just no-ops the
 * second time.
 *
 * Runs daily at 03:00 (low traffic window).
 *
 * Why the 1-day grace period: protects against clock skew between web nodes
 * and DB. A token that expired 30 seconds ago is "valid" elsewhere being
 * validated; let the next cron pass clean it up.
 */
export async function cleanupExpiredSessions(): Promise<{ deleted: number }> {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const result = await prisma.session.deleteMany({
    where: { expiresAt: { lt: cutoff } },
  })
  return { deleted: result.count }
}
