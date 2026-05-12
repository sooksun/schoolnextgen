/**
 * Next.js convention — auto-loaded in the browser before any client component
 * runs. Wires Sentry only when NEXT_PUBLIC_SENTRY_DSN is set at build time.
 */
import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
    tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? '0.1'),

    // Browser-only: don't capture session replays by default (paid feature
    // + privacy implications with classroom content visible on screen).
    integrations: [],

    // Filter app-level user-facing errors that aren't bugs.
    ignoreErrors: [
      /ResizeObserver/i,
      /Network request failed/i, // intermittent mobile offline noise
      /PERMISSION_DENIED/,
      /UNAUTHENTICATED/,
      /RATE_LIMITED/,
      /VALIDATION/,
      /NOT_FOUND/,
    ],
  })
}

// Next.js 15+ hook for navigation transitions (App Router)
export const onRouterTransitionStart = dsn
  ? Sentry.captureRouterTransitionStart
  : () => undefined
