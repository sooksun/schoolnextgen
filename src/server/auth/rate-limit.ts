/**
 * In-memory rate limiter for the single-process Node server.
 *
 * Phase 1 only — single-server deployment. For multi-replica deploys
 * (Phase 4+) swap the backing Map for Redis-backed sliding-window or token
 * bucket. The public API stays the same.
 *
 * Pure functions: tests construct fresh state via `_resetAll` (no DI needed).
 */

// NOT 'server-only' — keep importable by tests without server-only stub gymnastics.

export type RateLimitCheck =
  | { allowed: true }
  | { allowed: false; resetIn: number /* seconds */ }

type Bucket = { count: number; resetAt: number }

const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_BUCKETS = 10_000        // hard cap; prune on insert

const buckets = new Map<string, Bucket>()

export const RATE_LIMITS = {
  /** Per IP: protects against horizontal scans of many accounts. */
  loginByIp: { max: 10, windowMs: WINDOW_MS },
  /** Per email: protects against targeted guessing on a known account. Lower. */
  loginByEmail: { max: 5, windowMs: WINDOW_MS },
} as const

export type RateLimitName = keyof typeof RATE_LIMITS

function bucketKey(name: RateLimitName, value: string): string {
  return `${name}:${value.toLowerCase()}`
}

/** Check whether a fresh attempt would be allowed. Does NOT consume a slot. */
export function checkRateLimit(name: RateLimitName, value: string, now = Date.now()): RateLimitCheck {
  const key = bucketKey(name, value)
  const b = buckets.get(key)
  if (!b || b.resetAt <= now) return { allowed: true }
  const limit = RATE_LIMITS[name].max
  if (b.count >= limit) {
    return { allowed: false, resetIn: Math.ceil((b.resetAt - now) / 1000) }
  }
  return { allowed: true }
}

/** Record a failed attempt. Call this AFTER an attempt that failed. */
export function recordFailure(name: RateLimitName, value: string, now = Date.now()): void {
  const key = bucketKey(name, value)
  pruneIfNeeded(now)

  const b = buckets.get(key)
  const window = RATE_LIMITS[name].windowMs
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + window })
  } else {
    b.count++
  }
}

/** Clear counters for a key after a successful attempt (e.g., successful login by email). */
export function resetKey(name: RateLimitName, value: string): void {
  buckets.delete(bucketKey(name, value))
}

/** Approximate prune — drops expired buckets when the map grows too big. */
function pruneIfNeeded(now: number): void {
  if (buckets.size < MAX_BUCKETS) return
  for (const [k, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(k)
  }
}

/** Test-only helper. */
export function _resetAll(): void {
  buckets.clear()
}
