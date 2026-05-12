import 'server-only'
import { cookies } from 'next/headers'
import { env } from '@/lib/env'

const COOKIE_NAME = env.SESSION_COOKIE_NAME
const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 30 // 30 days

// Cookie's `Secure` flag must follow whether the deployment actually serves
// over HTTPS — NOT whether NODE_ENV is "production". A prod container behind
// plain HTTP (e.g. pilot deploys before a TLS proxy is set up) would set the
// flag, browsers would silently drop the cookie, and login would loop back
// to /login. PUBLIC_APP_URL is the right signal.
const COOKIE_SECURE = env.PUBLIC_APP_URL.startsWith('https://')

export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: COOKIE_SECURE,
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
    secure: COOKIE_SECURE,
    path: '/',
    maxAge: 0,
  })
}

export async function readSessionToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value ?? null
}
