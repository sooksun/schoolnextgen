import 'server-only'
import { Resend } from 'resend'

/**
 * Lazily-constructed Resend client.
 * Returns `null` when `RESEND_API_KEY` is missing — callers treat null as
 * "dry-run mode" (log instead of send). This keeps email opt-in across the
 * codebase: no key → no risk of accidentally hitting Resend in dev/test.
 */
let cached: Resend | null | undefined

export function getResend(): Resend | null {
  if (cached !== undefined) return cached
  const key = process.env.RESEND_API_KEY
  if (!key || key.length < 8) {
    cached = null
    return null
  }
  cached = new Resend(key)
  return cached
}

export function getEmailFrom(): string {
  return process.env.EMAIL_FROM || 'SchoolNextgen <onboarding@resend.dev>'
}

/** Test-only: reset the cached client so vi.stubEnv changes take effect. */
export function _resetResendCache(): void {
  cached = undefined
}
