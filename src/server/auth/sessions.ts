/**
 * Session management — Copenhagen Book pattern.
 * https://thecopenhagenbook.com/
 *
 * - Generate a secure random token (40 chars base32).
 * - Store SHA-256(token) as the session row id; raw token only in the cookie.
 * - Validate on every request; auto-extend if expiry within 15 days.
 * - Hard expiry: 30 days from issue.
 */
import 'server-only'
import { sha256 } from '@oslojs/crypto/sha2'
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding'
import { prisma } from '@/lib/db'

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30 // 30 days
const SESSION_REFRESH_THRESHOLD_MS = 1000 * 60 * 60 * 24 * 15 // refresh if within 15 days of expiry

export type SessionUser = { id: string; personId: string; email: string; status: string }
export type SessionRow = { id: string; userId: string; expiresAt: Date }

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20)
  crypto.getRandomValues(bytes)
  return encodeBase32LowerCaseNoPadding(bytes)
}

export function hashToken(token: string): string {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
}

export async function createSession(token: string, userId: string): Promise<SessionRow> {
  const id = hashToken(token)
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
  await prisma.session.create({ data: { id, userId, expiresAt } })
  return { id, userId, expiresAt }
}

export type ValidateResult =
  | { session: SessionRow; user: SessionUser }
  | { session: null; user: null }

export async function validateSessionToken(token: string): Promise<ValidateResult> {
  const id = hashToken(token)
  const row = await prisma.session.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, personId: true, email: true, status: true },
      },
    },
  })

  if (!row) return { session: null, user: null }

  // Expired
  if (Date.now() >= row.expiresAt.getTime()) {
    await prisma.session.delete({ where: { id } })
    return { session: null, user: null }
  }

  // User deactivated
  if (row.user.status !== 'active') {
    await prisma.session.delete({ where: { id } })
    return { session: null, user: null }
  }

  // Sliding refresh: if within 15 days of expiry, push out 30 more days
  if (Date.now() >= row.expiresAt.getTime() - SESSION_REFRESH_THRESHOLD_MS) {
    const newExpiresAt = new Date(Date.now() + SESSION_TTL_MS)
    await prisma.session.update({
      where: { id },
      data: { expiresAt: newExpiresAt },
    })
    return {
      session: { id: row.id, userId: row.userId, expiresAt: newExpiresAt },
      user: row.user,
    }
  }

  return {
    session: { id: row.id, userId: row.userId, expiresAt: row.expiresAt },
    user: row.user,
  }
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { id: sessionId } })
}

export async function invalidateAllUserSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } })
}
