'use server'

import 'server-only'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { err, ok, type ActionResult } from '@/lib/result'
import { captureActionError } from '@/lib/observability'
import { verifyPassword, getDummyHash } from './password'
import { createSession, generateSessionToken, hashToken, invalidateSession } from './sessions'
import { setSessionCookie, clearSessionCookie, readSessionToken } from './cookies'
import { validateRequest } from './validate-request'
import { checkRateLimit, recordFailure, resetKey } from './rate-limit'

async function getClientIp(): Promise<string> {
  const h = await headers()
  const fwd = h.get('x-forwarded-for')?.split(',')[0]?.trim()
  return fwd || h.get('x-real-ip') || h.get('cf-connecting-ip') || 'unknown'
}

const SignInInput = z.object({
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  password: z.string().min(1, 'กรุณากรอกรหัสผ่าน'),
})

export async function signInAction(
  _prevState: ActionResult<{ redirectTo: string }> | null,
  formData: FormData,
): Promise<ActionResult<{ redirectTo: string }>> {
  try {
    const raw = {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    }
    const parsed = SignInInput.safeParse(raw)
    if (!parsed.success) {
      return err('VALIDATION', parsed.error.issues[0]?.message ?? 'ข้อมูลไม่ครบถ้วน')
    }
    const email = parsed.data.email.toLowerCase()

    // Rate-limit BEFORE any DB lookup or argon2 work (cheap + protects argon2 CPU).
    const ip = await getClientIp()
    const ipCheck = checkRateLimit('loginByIp', ip)
    if (!ipCheck.allowed) {
      return err(
        'RATE_LIMITED',
        `ลองเข้าระบบบ่อยเกินไป กรุณารอ ${Math.ceil(ipCheck.resetIn / 60)} นาที`,
      )
    }
    const emailCheck = checkRateLimit('loginByEmail', email)
    if (!emailCheck.allowed) {
      return err(
        'RATE_LIMITED',
        `ลองเข้าระบบบ่อยเกินไป กรุณารอ ${Math.ceil(emailCheck.resetIn / 60)} นาที`,
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Equalize work between "user found wrong password" and "user not found"
    // by verifying against a real argon2 hash either way (timing-attack defense).
    const passwordOk = user
      ? await verifyPassword(user.passwordHash, parsed.data.password)
      : await verifyPassword(await getDummyHash(), parsed.data.password)

    if (!user || !passwordOk) {
      recordFailure('loginByIp', ip)
      recordFailure('loginByEmail', email)
      return err('VALIDATION', 'อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    }
    if (user.status !== 'active') {
      recordFailure('loginByIp', ip)
      recordFailure('loginByEmail', email)
      return err('VALIDATION', 'บัญชีนี้ถูกระงับการใช้งาน')
    }

    // Success — reset the email counter so a legit user isn't penalized
    // by past wrong-attempts. IP counter stays (an IP is still suspect).
    resetKey('loginByEmail', email)

    const token = generateSessionToken()
    const session = await createSession(token, user.id)
    await setSessionCookie(token, session.expiresAt)

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // Determine redirect based on memberships
    const memberships = await prisma.userSchoolMembership.findMany({
      where: { personId: user.personId, status: 'active' },
    })
    if (memberships.length === 0) {
      return err('VALIDATION', 'บัญชีนี้ยังไม่ได้รับสิทธิ์ในโรงเรียนใด ติดต่อผู้ดูแลระบบ')
    }
    const redirectTo = memberships.length > 1 ? '/select-context' : '/teacher'
    return ok({ redirectTo })
  } catch (e) {
    captureActionError('signInAction', e)
    return err('INTERNAL', 'เกิดข้อผิดพลาดในระบบ')
  }
}

export async function signOutAction(): Promise<void> {
  const token = await readSessionToken()
  if (token) {
    await invalidateSession(hashToken(token))
  }
  await clearSessionCookie()
  redirect('/login')
}

/** Convenience: throw redirect to /login when not authenticated. */
export async function requireUser() {
  const { user } = await validateRequest()
  if (!user) redirect('/login')
  return user
}
