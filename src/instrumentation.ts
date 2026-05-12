/**
 * Next.js convention — auto-loaded on server boot (and Edge).
 * Wires Sentry only when SENTRY_DSN is set; otherwise this file is a no-op.
 */
import type { Instrumentation } from 'next'

export async function register() {
  // Start cron jobs on Node runtime boot (gated by CRON_ENABLED inside startCronJobs).
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startCronJobs } = await import('@/server/cron')
    startCronJobs()
  }

  if (!process.env.SENTRY_DSN) return

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const Sentry = await import('@sentry/nextjs')
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? '0.1'),

      // Don't ship the SDK's default integrations that touch fs/network
      // unless we actually use them.
      sendDefaultPii: false,

      // App-level errors (validation, permission denied, rate-limit) are user-
      // facing outcomes, NOT bugs. Suppress them to keep the Sentry budget
      // focused on actual failures.
      ignoreErrors: [
        /PERMISSION_DENIED/,
        /UNAUTHENTICATED/,
        /RATE_LIMITED/,
        /VALIDATION/,
        /NOT_FOUND/,
      ],

      // Scrub cookies + auth headers from breadcrumbs.
      beforeSend(event) {
        if (event.request?.headers) {
          const h = event.request.headers as Record<string, string>
          delete h.cookie
          delete h.authorization
          delete h['x-forwarded-for']
        }
        // Reflection content is potentially PII — drop free-text bodies.
        if (event.request?.data && typeof event.request.data === 'object') {
          event.request.data = '[redacted]'
        }
        return event
      },
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    const Sentry = await import('@sentry/nextjs')
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? '0.1'),
    })
  }
}

/**
 * Next.js 15+ hook — captures errors thrown during React Server Component
 * rendering, route handlers, and server actions. Without this, those errors
 * never reach Sentry.
 */
export const onRequestError: Instrumentation.onRequestError = async (...args) => {
  if (!process.env.SENTRY_DSN) return
  const Sentry = await import('@sentry/nextjs')
  Sentry.captureRequestError(...args)
}
