import { beforeEach, describe, expect, it } from 'vitest'
import {
  createSession,
  generateSessionToken,
  hashToken,
  validateSessionToken,
  invalidateSession,
  invalidateAllUserSessions,
} from './sessions'
import { resetDb, seedBasic, testPrisma, type SeededIds } from '../../../tests/fixtures'

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30 // 30d
const REFRESH_WINDOW_MS = 1000 * 60 * 60 * 24 * 15 // 15d

let ids: SeededIds

beforeEach(async () => {
  await resetDb()
  ids = await seedBasic()
})

describe('createSession + validateSessionToken — happy path', () => {
  it('issues a session and validates the raw token', async () => {
    const token = generateSessionToken()
    const session = await createSession(token, ids.teacherUserId)

    const result = await validateSessionToken(token)
    expect(result.session).not.toBeNull()
    expect(result.user).not.toBeNull()
    expect(result.user?.id).toBe(ids.teacherUserId)
    expect(result.session?.id).toBe(session.id)
    expect(result.session?.id).toBe(hashToken(token)) // id is the hash
  })

  it('hash is what is stored, never the raw token', async () => {
    const token = generateSessionToken()
    await createSession(token, ids.teacherUserId)

    // DB row has the hash, NOT the raw token
    const row = await testPrisma.session.findUniqueOrThrow({
      where: { id: hashToken(token) },
    })
    expect(row.id).not.toBe(token)
    expect(row.id).toMatch(/^[0-9a-f]{64}$/)
  })

  it('returns null for an unknown token', async () => {
    const result = await validateSessionToken('not-a-real-token-zzz')
    expect(result.session).toBeNull()
    expect(result.user).toBeNull()
  })
})

describe('validateSessionToken — expiry', () => {
  it('returns null AND deletes the row when the session is past expiry', async () => {
    const token = generateSessionToken()
    const id = hashToken(token)
    // Insert a session that expired 1 second ago
    await testPrisma.session.create({
      data: {
        id,
        userId: ids.teacherUserId,
        expiresAt: new Date(Date.now() - 1000),
      },
    })

    const result = await validateSessionToken(token)
    expect(result.session).toBeNull()
    expect(result.user).toBeNull()

    // Row deleted as a side-effect
    const row = await testPrisma.session.findUnique({ where: { id } })
    expect(row).toBeNull()
  })

  it('returns null AND deletes when the user is inactive', async () => {
    const token = generateSessionToken()
    await createSession(token, ids.teacherUserId)
    await testPrisma.user.update({
      where: { id: ids.teacherUserId },
      data: { status: 'suspended' },
    })

    const result = await validateSessionToken(token)
    expect(result.session).toBeNull()

    // Session row was force-cleaned
    const row = await testPrisma.session.findUnique({ where: { id: hashToken(token) } })
    expect(row).toBeNull()
  })
})

describe('validateSessionToken — sliding refresh', () => {
  it('extends expiresAt when session is within the 15-day refresh window', async () => {
    const token = generateSessionToken()
    const id = hashToken(token)
    // Session expires in 10 days (well within 15-day refresh window)
    const originalExpiry = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    await testPrisma.session.create({
      data: { id, userId: ids.teacherUserId, expiresAt: originalExpiry },
    })

    const result = await validateSessionToken(token)
    expect(result.session).not.toBeNull()

    const refreshed = await testPrisma.session.findUniqueOrThrow({ where: { id } })
    // Should now expire ~30 days from now (newly extended)
    expect(refreshed.expiresAt.getTime()).toBeGreaterThan(originalExpiry.getTime())
    const drift = Math.abs(refreshed.expiresAt.getTime() - (Date.now() + SESSION_TTL_MS))
    expect(drift).toBeLessThan(5000) // within 5s of "now + 30d"
  })

  it('does NOT extend when session is outside the refresh window (e.g., 20 days left)', async () => {
    const token = generateSessionToken()
    const id = hashToken(token)
    const originalExpiry = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
    await testPrisma.session.create({
      data: { id, userId: ids.teacherUserId, expiresAt: originalExpiry },
    })

    await validateSessionToken(token)

    const unchanged = await testPrisma.session.findUniqueOrThrow({ where: { id } })
    expect(unchanged.expiresAt.getTime()).toBe(originalExpiry.getTime())
  })

  it('refresh window boundary: refresh fires when remaining ≤ 15 days', async () => {
    const token = generateSessionToken()
    const id = hashToken(token)
    // Exactly 14 days remaining — should refresh
    const justInside = new Date(Date.now() + REFRESH_WINDOW_MS - 24 * 60 * 60 * 1000)
    await testPrisma.session.create({
      data: { id, userId: ids.teacherUserId, expiresAt: justInside },
    })

    await validateSessionToken(token)
    const after = await testPrisma.session.findUniqueOrThrow({ where: { id } })
    expect(after.expiresAt.getTime()).toBeGreaterThan(justInside.getTime())
  })
})

describe('invalidateSession / invalidateAllUserSessions', () => {
  it('invalidateSession removes a single session', async () => {
    const token = generateSessionToken()
    const session = await createSession(token, ids.teacherUserId)

    await invalidateSession(session.id)

    const result = await validateSessionToken(token)
    expect(result.session).toBeNull()
  })

  it('invalidateAllUserSessions removes every session for a user', async () => {
    // Create 3 sessions from "3 devices"
    const tokens = [generateSessionToken(), generateSessionToken(), generateSessionToken()]
    await Promise.all(tokens.map((t) => createSession(t, ids.teacherUserId)))
    expect(await testPrisma.session.count({ where: { userId: ids.teacherUserId } })).toBe(3)

    await invalidateAllUserSessions(ids.teacherUserId)

    expect(await testPrisma.session.count({ where: { userId: ids.teacherUserId } })).toBe(0)
    for (const t of tokens) {
      const r = await validateSessionToken(t)
      expect(r.session).toBeNull()
    }
  })

  it('invalidateAllUserSessions does NOT touch other users\' sessions', async () => {
    const t1 = generateSessionToken()
    const t2 = generateSessionToken()
    await createSession(t1, ids.teacherUserId)
    await createSession(t2, ids.directorUserId)

    await invalidateAllUserSessions(ids.teacherUserId)

    expect((await validateSessionToken(t1)).session).toBeNull()
    expect((await validateSessionToken(t2)).user?.id).toBe(ids.directorUserId)
  })
})
