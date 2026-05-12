import { prisma } from '@/lib/db'

// Disable static optimization — health must reflect live DB state.
export const dynamic = 'force-dynamic'
export const revalidate = 0

const startedAt = Date.now()

/**
 * GET /api/health
 *
 * Public endpoint (no auth) intended for:
 *   - Load balancers / reverse proxies
 *   - Container orchestrators (Docker HEALTHCHECK, K8s probes)
 *   - Uptime monitors
 *
 * Returns 200 when everything's OK, 503 when a check fails.
 * Never expose secrets, stack traces, or internal data here.
 */
export async function GET() {
  const checks: Record<string, { status: 'ok' | 'error'; latencyMs?: number; message?: string }> = {}

  // ── DB ping ──────────────────────────────────────────
  const t0 = Date.now()
  try {
    await prisma.$queryRawUnsafe('SELECT 1')
    checks.db = { status: 'ok', latencyMs: Date.now() - t0 }
  } catch (e) {
    checks.db = {
      status: 'error',
      latencyMs: Date.now() - t0,
      message: e instanceof Error ? e.message.slice(0, 200) : 'unknown',
    }
  }

  const allOk = Object.values(checks).every((c) => c.status === 'ok')

  const body = {
    status: allOk ? 'ok' : 'degraded',
    uptimeSec: Math.floor((Date.now() - startedAt) / 1000),
    version: process.env.npm_package_version ?? '0.0.0',
    timestamp: new Date().toISOString(),
    checks,
  }

  return Response.json(body, {
    status: allOk ? 200 : 503,
    headers: { 'Cache-Control': 'no-store, must-revalidate' },
  })
}
