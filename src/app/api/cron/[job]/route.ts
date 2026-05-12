import { type NextRequest } from 'next/server'
import { JOBS, type JobName } from '@/server/cron'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * POST /api/cron/:job
 *
 * Manually trigger a scheduled job. Used by:
 *   - External cron schedulers (cron-on-host, Vercel Cron, GitHub Actions)
 *   - Ops during incident response
 *   - E2E tests against a deployed environment
 *
 * Auth: CRON_SECRET in `Authorization: Bearer <secret>` header.
 * If CRON_SECRET is unset on the server, the endpoint refuses ALL requests —
 * never trust an empty secret as "anyone can call it".
 *
 * Returns:
 *   200 { job, triggeredBy: 'manual', result: <job-specific> }
 *   401 if secret missing/invalid
 *   404 if unknown job
 *   500 on job error (body has the message)
 */
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ job: string }> },
) {
  const { job } = await ctx.params
  const expected = process.env.CRON_SECRET
  if (!expected) {
    return Response.json(
      { error: 'CRON_SECRET not configured on this server' },
      { status: 401 },
    )
  }
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${expected}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!(job in JOBS)) {
    return Response.json(
      { error: `Unknown job. Known: ${Object.keys(JOBS).join(', ')}` },
      { status: 404 },
    )
  }
  try {
    const result = await JOBS[job as JobName]('manual')
    return Response.json({
      job,
      triggeredBy: 'manual',
      timestamp: new Date().toISOString(),
      result,
    })
  } catch (e) {
    return Response.json(
      {
        job,
        error: e instanceof Error ? e.message : String(e),
      },
      { status: 500 },
    )
  }
}
