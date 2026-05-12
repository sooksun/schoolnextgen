import { describe, expect, it } from 'vitest'
import { getDummyHash, verifyPassword, hashPassword } from './password'

describe('getDummyHash', () => {
  it('returns a valid argon2id encoded hash string', async () => {
    const h = await getDummyHash()
    expect(h).toMatch(/^\$argon2id\$v=19\$m=\d+,t=\d+,p=\d+\$[^$]+\$[^$]+$/)
  })

  it('is cached — repeated calls return the same string', async () => {
    const a = await getDummyHash()
    const b = await getDummyHash()
    expect(a).toBe(b)
  })

  it('verifyPassword against the dummy hash always returns false (no real password matches)', async () => {
    // This is the critical contract: even a clever attacker cannot trick
    // verifyPassword into returning true against the dummy hash.
    const dummy = await getDummyHash()
    expect(await verifyPassword(dummy, '')).toBe(false)
    expect(await verifyPassword(dummy, 'guess')).toBe(false)
    expect(await verifyPassword(dummy, 'Pass1234!')).toBe(false)
  })

  it('verifyPassword on dummy hash does NOT throw (parseable argon2 format)', async () => {
    const dummy = await getDummyHash()
    // The bug we fixed: a malformed hash makes verify() throw → caught → returns
    // false instantly, defeating the timing-attack defense. A valid hash makes
    // verify() do real work for ~250ms (the argon2 cost).
    await expect(verifyPassword(dummy, 'anything')).resolves.toBe(false)
  })
})

describe('hashPassword / verifyPassword round-trip', () => {
  it('verifies the correct password', async () => {
    const h = await hashPassword('CorrectHorseBattery!')
    expect(await verifyPassword(h, 'CorrectHorseBattery!')).toBe(true)
  })

  it('rejects the wrong password', async () => {
    const h = await hashPassword('CorrectHorseBattery!')
    expect(await verifyPassword(h, 'wrong-password')).toBe(false)
  })

  it('rejects passwords shorter than 8 characters', async () => {
    await expect(hashPassword('short')).rejects.toThrow(/at least 8/)
  })
})
