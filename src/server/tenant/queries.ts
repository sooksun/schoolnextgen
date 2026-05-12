import 'server-only'
import { cache } from 'react'
import { prisma } from '@/lib/db'
import { validateRequest } from '@/server/auth/validate-request'

export const listMyMemberships = cache(async () => {
  const { user } = await validateRequest()
  if (!user) return []
  return prisma.userSchoolMembership.findMany({
    where: { personId: user.personId, status: 'active' },
    include: {
      school: { select: { id: true, name: true, code: true } },
      academicYear: { select: { id: true, yearLabel: true, isCurrent: true } },
      classroom: { select: { id: true, name: true, level: true } },
      department: { select: { id: true, name: true, code: true } },
      role: { select: { id: true, code: true, name: true } },
    },
    orderBy: [{ academicYear: { isCurrent: 'desc' } }, { createdAt: 'desc' }],
  })
})

export async function getSchoolById(id: string) {
  return prisma.school.findUnique({ where: { id } })
}

export async function getCurrentTerm(academicYearId: string) {
  return prisma.academicTerm.findFirst({
    where: { academicYearId, isCurrent: true },
  })
}

/** Resolve a person's display name. Returns null if person not found. */
export async function getPersonDisplayName(personId: string): Promise<string | null> {
  const p = await prisma.person.findUnique({
    where: { id: personId },
    select: { displayName: true },
  })
  return p?.displayName ?? null
}
