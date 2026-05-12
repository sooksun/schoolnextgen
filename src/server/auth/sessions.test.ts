import { describe, it, expect } from 'vitest'
import { generateSessionToken, hashToken } from './sessions'

describe('generateSessionToken', () => {
  it('returns a non-empty string', () => {
    expect(generateSessionToken()).toMatch(/^[a-z2-7]+$/) // base32 lowercase
  })

  it('is 32 chars (20 bytes × 8 / 5)', () => {
    expect(generateSessionToken()).toHaveLength(32)
  })

  it('returns distinct tokens on repeated calls (cryptographic uniqueness)', () => {
    const set = new Set<string>()
    for (let i = 0; i < 100; i++) set.add(generateSessionToken())
    expect(set.size).toBe(100)
  })
})

describe('hashToken', () => {
  it('returns a 64-char hex string (SHA-256)', () => {
    const h = hashToken('test-token')
    expect(h).toMatch(/^[0-9a-f]{64}$/)
  })

  it('is deterministic — same input → same output', () => {
    expect(hashToken('abc')).toBe(hashToken('abc'))
  })

  it('is sensitive to input — different inputs → different hashes', () => {
    expect(hashToken('a')).not.toBe(hashToken('b'))
  })

  it('hashes a real generated token correctly', () => {
    const token = generateSessionToken()
    const h1 = hashToken(token)
    const h2 = hashToken(token)
    expect(h1).toBe(h2)
    expect(h1).toMatch(/^[0-9a-f]{64}$/)
  })
})
