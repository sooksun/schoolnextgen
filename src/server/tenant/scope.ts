import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { validateRequest } from '@/server/auth/validate-request'
import type { Scope } from '@/lib/scope/types'

// Re-export so existing imports `import { Scope } from '@/server/tenant/scope'` keep working.
export type { Scope }

const SCHOOL_COOKIE = 'snx_school'

/**
 * Resolves the current user's active scope (which school/year/role).
 * - Cached per request via React `cache()`.
 * - Picks membership based on `snx_school` cookie, falls back to first active.
 * - Returns null if not authenticated or no memberships.
 */
export const resolveCurrentScope = cache(async (): Promise<Scope | null> => {
  const { user } = await validateRequest()
  if (!user) return null

  const memberships = await prisma.userSchoolMembership.findMany({
    where: { personId: user.personId, status: 'active' },
    include: {
      school: true,
      academicYear: true,
      role: true,
      classroom: true,
    },
    orderBy: [
      { academicYear: { isCurrent: 'desc' } },
      { createdAt: 'desc' },
    ],
  })

  if (memberships.length === 0) return null

  const cookieStore = await cookies()
  const selectedSchoolId = cookieStore.get(SCHOOL_COOKIE)?.value
  const m = memberships.find((x) => x.schoolId === selectedSchoolId) ?? memberships[0]

  if (!m.academicYearId || !m.academicYear) {
    // Membership without year context — fall back to the school's current year
    const currentYear = await prisma.academicYear.findFirst({
      where: { schoolId: m.schoolId, isCurrent: true },
    })
    if (!currentYear) return null
    return {
      user: { id: user.id, personId: user.personId, email: user.email },
      membershipId: m.id,
      schoolId: m.schoolId,
      schoolName: m.school.name,
      academicYearId: currentYear.id,
      academicYearLabel: currentYear.yearLabel,
      academicTermId: null,
      academicTermName: null,
      role: m.role.code,
      roleName: m.role.name,
      departmentId: m.departmentId,
      classroomId: m.classroomId,
      classroomName: m.classroom?.name ?? null,
    }
  }

  // Current term within the current year
  const currentTerm = await prisma.academicTerm.findFirst({
    where: { academicYearId: m.academicYearId, isCurrent: true },
  })

  return {
    user: { id: user.id, personId: user.personId, email: user.email },
    membershipId: m.id,
    schoolId: m.schoolId,
    schoolName: m.school.name,
    academicYearId: m.academicYearId,
    academicYearLabel: m.academicYear.yearLabel,
    academicTermId: currentTerm?.id ?? null,
    academicTermName: currentTerm?.name ?? null,
    role: m.role.code,
    roleName: m.role.name,
    departmentId: m.departmentId,
    classroomId: m.classroomId,
    classroomName: m.classroom?.name ?? null,
  }
})

/** Throw redirect to /login (no membership → /select-context). */
export async function requireScope(): Promise<Scope> {
  const s = await resolveCurrentScope()
  if (!s) redirect('/login')
  return s
}

export const SCOPE_COOKIE_NAME = SCHOOL_COOKIE
