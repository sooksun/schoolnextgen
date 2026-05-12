import 'server-only'
import { ActionError, type ActionCode } from '@/lib/result'

/**
 * Codes that represent user-facing outcomes — NOT bugs. The action returned
 * an `err(...)` result; we don't want these in Sentry because they're
 * already conveyed to the user via notify.error().
 */
const SUPPRESSED_CODES = new Set<ActionCode>([
  'VALIDATION',
  'UNAUTHENTICATED',
  'PERMISSION_DENIED',
  'NOT_FOUND',
  'CONFLICT',
  'RATE_LIMITED',
])

type Context = Record<string, string | number | boolean | null | undefined>

/**
 * Log + report an error from a server action.
 *
 *   try { ... } catch (e) {
 *     captureActionError('createReflection', e, { reflectionId })
 *     return err('INTERNAL', '...')
 *   }
 *
 * - Always logs to console (visible via `docker compose logs app`)
 * - Reports to Sentry ONLY when SENTRY_DSN is configured AND the error is
 *   not a user-facing ActionError (no point alerting on permission denials)
 * - Scrubs `context` to keys + scalar values only (never reflection content)
 */
export function captureActionError(
  actionName: string,
  err: unknown,
  context?: Context,
): void {
  console.error(`[${actionName}]`, err, context ?? '')

  if (!process.env.SENTRY_DSN) return

  // Skip Sentry for known user-facing outcomes
  if (err instanceof ActionError && SUPPRESSED_CODES.has(err.code)) return

  // Lazy import — keeps cold-start fast when Sentry isn't configured
  import('@sentry/nextjs')
    .then((Sentry) => {
      Sentry.withScope((scope) => {
        scope.setTag('action', actionName)
        if (err instanceof ActionError) scope.setTag('error_code', err.code)
        if (context) scope.setContext('action_context', context as Record<string, unknown>)
        Sentry.captureException(err)
      })
    })
    .catch(() => {
      // Never let observability failure crash the request
    })
}
