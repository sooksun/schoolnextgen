import 'server-only'
import { cookies } from 'next/headers'
import { env } from '@/lib/env'

const COOKIE_NAME = env.SESSION_COOKIE_NAME
const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 30 // 30 days

export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
    maxAge: COOKIE_MAX_AGE_SEC,
  })
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
}

export async function readSessionToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value ?? null
}
