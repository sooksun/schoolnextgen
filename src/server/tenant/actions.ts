'use server'

import 'server-only'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { validateRequest } from '@/server/auth/validate-request'
import { ok, err, type ActionResult } from '@/lib/result'
import { SCOPE_COOKIE_NAME } from './scope'

/**
 * Switch the current user's active school context.
 * Verifies that the user has an active membership for the target school.
 */
export async function switchSchoolAction(schoolId: string): Promise<ActionResult<{ schoolId: string }>> {
  const { user } = await validateRequest()
  if (!user) return err('UNAUTHENTICATED', 'กรุณาเข้าสู่ระบบ')

  const membership = await prisma.userSchoolMembership.findFirst({
    where: { personId: user.personId, schoolId, status: 'active' },
  })
  if (!membership) return err('PERMISSION_DENIED', 'ไม่พบสิทธิ์ในโรงเรียนนี้')

  const cookieStore = await cookies()
  cookieStore.set(SCOPE_COOKIE_NAME, schoolId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })

  revalidatePath('/', 'layout')
  return ok({ schoolId })
}
