import { beforeEach, describe, expect, it, vi } from 'vitest'
import { resetDb, seedBasic, testPrisma, type SeededIds } from '../../../tests/fixtures'

// ─── Mock cookies() from next/headers ─────────────────────────────────────
const cookiesMock = vi.hoisted(() => ({ value: null as string | null }))
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) =>
      name === 'snx_school' && cookiesMock.value
        ? { value: cookiesMock.value }
        : undefined,
  }),
  headers: async () => ({ get: () => null }),
}))

// ─── Mock validate-request ────────────────────────────────────────────────
const authMock = vi.hoisted(() => ({
  user: null as null | { id: string; personId: string; email: string; status: string },
}))
vi.mock('@/server/auth/validate-request', () => ({
  validateRequest: async () => ({ user: authMock.user, session: null }),
}))

vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`)
  },
}))

const { resolveCurrentScope, requireScope } = await import('./scope')
const { listMyMemberships } = await import('./queries')

let ids: SeededIds

beforeEach(async () => {
  await resetDb()
  ids = await seedBasic()
  cookiesMock.value = null
  authMock.user = null
})

describe('resolveCurrentScope', () => {
  it('returns null when not authenticated', async () => {
    expect(await resolveCurrentScope()).toBeNull()
  })

  it('returns null when authenticated but no memberships exist', async () => {
    // Authenticate as a brand-new person with no memberships
    const orphanPerson = await testPrisma.person.create({
      data: { displayName: 'No Memberships', email: 'orphan@x' },
    })
    const orphanUser = await testPrisma.user.create({
      data: { personId: orphanPerson.id, email: 'orphan@x', passwordHash: 'x' },
    })
    authMock.user = {
      id: orphanUser.id,
      personId: orphanPerson.id,
      email: 'orphan@x',
      status: 'active',
    }
    expect(await resolveCurrentScope()).toBeNull()
  })

  it('falls back to first active membership when no school cookie set', async () => {
    authMock.user = {
      id: ids.teacherUserId,
      personId: ids.teacherPersonId,
      email: 'teacher@test.local',
      status: 'active',
    }
    const scope = await resolveCurrentScope()
    expect(scope).not.toBeNull()
    expect(scope!.schoolId).toBe(ids.schoolId)
    expect(scope!.role).toBe('teacher')
    expect(scope!.classroomId).toBe(ids.classroomId)
    expect(scope!.academicYearLabel).toBe('2569')
  })

  it('honors the school cookie when the user has membership for it', async () => {
    // Director has membership at the same school. Set the cookie explicitly.
    authMock.user = {
      id: ids.directorUserId,
      personId: (await testPrisma.user.findUniqueOrThrow({
        where: { id: ids.directorUserId },
      })).personId,
      email: 'director@test.local',
      status: 'active',
    }
    cookiesMock.value = ids.schoolId
    const scope = await resolveCurrentScope()
    expect(scope!.schoolId).toBe(ids.schoolId)
    expect(scope!.role).toBe('director')
    expect(scope!.classroomId).toBeNull() // director has no classroom binding
  })

  it('ignores stale cookie pointing at a school where user has no membership', async () => {
    authMock.user = {
      id: ids.teacherUserId,
      personId: ids.teacherPersonId,
      email: 'teacher@test.local',
      status: 'active',
    }
    cookiesMock.value = '00000000-0000-0000-0000-000000000000' // bogus
    // Falls back to first available membership for this person
    const scope = await resolveCurrentScope()
    expect(scope!.schoolId).toBe(ids.schoolId)
  })

  it('exposes academic term name when current term exists', async () => {
    await testPrisma.academicTerm.create({
      data: {
        academicYearId: ids.academicYearId,
        termNo: 1,
        name: 'ภาคเรียนที่ 1',
        isCurrent: true,
      },
    })
    authMock.user = {
      id: ids.teacherUserId,
      personId: ids.teacherPersonId,
      email: 'teacher@test.local',
      status: 'active',
    }
    const scope = await resolveCurrentScope()
    expect(scope!.academicTermName).toBe('ภาคเรียนที่ 1')
    expect(scope!.academicTermId).not.toBeNull()
  })
})

describe('requireScope', () => {
  it('redirects to /login when no scope', async () => {
    await expect(requireScope()).rejects.toThrow(/REDIRECT:\/login/)
  })

  it('returns scope when authenticated', async () => {
    authMock.user = {
      id: ids.teacherUserId,
      personId: ids.teacherPersonId,
      email: 'teacher@test.local',
      status: 'active',
    }
    const scope = await requireScope()
    expect(scope.schoolId).toBe(ids.schoolId)
  })
})

describe('listMyMemberships', () => {
  it('returns [] when not authenticated', async () => {
    expect(await listMyMemberships()).toEqual([])
  })

  it('returns active memberships for the authenticated person', async () => {
    authMock.user = {
      id: ids.teacherUserId,
      personId: ids.teacherPersonId,
      email: 'teacher@test.local',
      status: 'active',
    }
    const list = await listMyMemberships()
    expect(list).toHaveLength(1)
    expect(list[0].schoolId).toBe(ids.schoolId)
    expect(list[0].role.code).toBe('teacher')
    expect(list[0].classroom?.name).toBe('ป.2/1')
  })

  it('filters out inactive memberships', async () => {
    await testPrisma.userSchoolMembership.updateMany({
      where: { personId: ids.teacherPersonId },
      data: { status: 'inactive' },
    })
    authMock.user = {
      id: ids.teacherUserId,
      personId: ids.teacherPersonId,
      email: 'teacher@test.local',
      status: 'active',
    }
    expect(await listMyMemberships()).toEqual([])
  })
})
