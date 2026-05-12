import { afterEach, describe, expect, it } from 'vitest'
import {
  checkRateLimit,
  recordFailure,
  resetKey,
  RATE_LIMITS,
  _resetAll,
} from './rate-limit'

afterEach(() => {
  _resetAll()
})

describe('checkRateLimit', () => {
  it('allows the first attempt for any new key', () => {
    expect(checkRateLimit('loginByEmail', 'fresh@x.com')).toEqual({ allowed: true })
    expect(checkRateLimit('loginByIp', '1.2.3.4')).toEqual({ allowed: true })
  })

  it('keys are isolated — recording failure on A does not affect B', () => {
    recordFailure('loginByEmail', 'a@x.com')
    expect(checkRateLimit('loginByEmail', 'b@x.com')).toEqual({ allowed: true })
  })

  it('blocks after the configured max', () => {
    const max = RATE_LIMITS.loginByEmail.max
    for (let i = 0; i < max; i++) recordFailure('loginByEmail', 'attacker@x.com')
    const r = checkRateLimit('loginByEmail', 'attacker@x.com')
    expect(r.allowed).toBe(false)
    if (!r.allowed) {
      expect(r.resetIn).toBeGreaterThan(0)
      expect(r.resetIn).toBeLessThanOrEqual(RATE_LIMITS.loginByEmail.windowMs / 1000)
    }
  })

  it('lets the count grow up to the threshold (off-by-one safety)', () => {
    const max = RATE_LIMITS.loginByEmail.max
    for (let i = 0; i < max - 1; i++) recordFailure('loginByEmail', 'borderline@x.com')
    // After max-1 failures the next attempt should still be allowed
    expect(checkRateLimit('loginByEmail', 'borderline@x.com')).toEqual({ allowed: true })
  })

  it('IP limit is higher than email limit', () => {
    // Sanity: protect against accidental config flip
    expect(RATE_LIMITS.loginByIp.max).toBeGreaterThan(RATE_LIMITS.loginByEmail.max)
  })
})

describe('time-based reset', () => {
  it('considers the bucket fresh once the window elapses', () => {
    // Simulate clock by passing an explicit `now`.
    const start = 1_700_000_000_000 // arbitrary ms
    for (let i = 0; i < RATE_LIMITS.loginByEmail.max; i++) {
      recordFailure('loginByEmail', 'tick@x.com', start)
    }
    // Right at window boundary
    const justBefore = start + RATE_LIMITS.loginByEmail.windowMs - 1
    expect(checkRateLimit('loginByEmail', 'tick@x.com', justBefore).allowed).toBe(false)

    // Just after the window — fresh again
    const justAfter = start + RATE_LIMITS.loginByEmail.windowMs + 1
    expect(checkRateLimit('loginByEmail', 'tick@x.com', justAfter).allowed).toBe(true)
  })
})

describe('resetKey', () => {
  it('clears the counter for a successful login', () => {
    recordFailure('loginByEmail', 'legit@x.com')
    recordFailure('loginByEmail', 'legit@x.com')
    resetKey('loginByEmail', 'legit@x.com')

    // After reset the user gets a fresh window
    const max = RATE_LIMITS.loginByEmail.max
    for (let i = 0; i < max - 1; i++) recordFailure('loginByEmail', 'legit@x.com')
    expect(checkRateLimit('loginByEmail', 'legit@x.com').allowed).toBe(true)
  })

  it('reset on key A does not affect key B', () => {
    recordFailure('loginByEmail', 'a@x.com')
    recordFailure('loginByEmail', 'b@x.com')
    resetKey('loginByEmail', 'a@x.com')

    expect(checkRateLimit('loginByEmail', 'a@x.com').allowed).toBe(true)
    // B should still have 1 failure counted (not yet at limit, still allowed)
    expect(checkRateLimit('loginByEmail', 'b@x.com').allowed).toBe(true)
  })
})

describe('key normalization', () => {
  it('email is case-insensitive (Bob@x.com == bob@x.com)', () => {
    const max = RATE_LIMITS.loginByEmail.max
    for (let i = 0; i < max; i++) recordFailure('loginByEmail', 'Bob@x.com')
    expect(checkRateLimit('loginByEmail', 'bob@x.com').allowed).toBe(false)
  })
})
