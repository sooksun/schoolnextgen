import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  resetDb,
  seedBasic,
  seedSecondSchool,
  fakeScope,
  testPrisma,
  type SeededIds,
  type SecondSchoolIds,
} from '../../../tests/fixtures'

const scopeMock = vi.hoisted(() => ({ current: null as ReturnType<typeof fakeScope> | null }))
vi.mock('@/server/tenant/scope', () => ({
  requireScope: async () => {
    if (!scopeMock.current) throw new Error('no fake scope set')
    return scopeMock.current
  },
  resolveCurrentScope: async () => scopeMock.current,
  SCOPE_COOKIE_NAME: 'snx_test_school',
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

const { createReflectionAction, deleteReflectionAction, updateReflectionAction } = await import(
  './actions'
)
const { listMyReflections, getReflectionById } = await import('./queries')

let schoolA: SeededIds
let schoolB: SecondSchoolIds

function asTeacherOf(
  ids: SeededIds | SecondSchoolIds,
  schoolName: string,
): ReturnType<typeof fakeScope> {
  return {
    user: {
      id: ids.teacherUserId,
      personId: ids.teacherPersonId,
      email: 'unused@test.local',
    },
    membershipId: 'm',
    schoolId: ids.schoolId,
    schoolName,
    academicYearId: ids.academicYearId,
    academicYearLabel: '2569',
    academicTermId: null,
    academicTermName: null,
    role: 'teacher',
    roleName: 'ครู',
    departmentId: null,
    classroomId: ids.classroomId,
    classroomName: 'ป.2/1',
  }
}

beforeEach(async () => {
  await resetDb()
  schoolA = await seedBasic()
  schoolB = await seedSecondSchool()
})

describe('Cross-school isolation — reflection visibility', () => {
  it("teacher B's listMyReflections does not include school A's reflections", async () => {
    // Create reflection as teacher A
    scopeMock.current = asTeacherOf(schoolA, 'รร.A')
    const a1 = await createReflectionAction({
      reflectionDate: '2026-05-11',
      whatHappened: 'A1 content',
    })
    expect(a1.ok).toBe(true)

    // Create reflection as teacher B
    scopeMock.current = asTeacherOf(schoolB, 'รร.B')
    const b1 = await createReflectionAction({
      reflectionDate: '2026-05-11',
      whatHappened: 'B1 content',
    })
    expect(b1.ok).toBe(true)

    // Teacher B should only see their own
    const bList = await listMyReflections({ limit: 50 })
    expect(bList).toHaveLength(1)
    expect(bList[0].whatHappened).toBe('B1 content')
    expect(bList[0].schoolId).toBe(schoolB.schoolId)

    // Teacher A should only see their own
    scopeMock.current = asTeacherOf(schoolA, 'รร.A')
    const aList = await listMyReflections({ limit: 50 })
    expect(aList).toHaveLength(1)
    expect(aList[0].whatHappened).toBe('A1 content')
  })

  it("getReflectionById returns null when reflection belongs to another school", async () => {
    // School A creates a reflection
    scopeMock.current = asTeacherOf(schoolA, 'รร.A')
    const a = await createReflectionAction({
      reflectionDate: '2026-05-11',
      whatHappened: 'private to A',
    })
    if (!a.ok) throw new Error('seed')

    // School B tries to fetch by id
    scopeMock.current = asTeacherOf(schoolB, 'รร.B')
    const result = await getReflectionById(a.data.id)
    expect(result).toBeNull()
  })
})

describe('Cross-school isolation — mutation blocked', () => {
  it("teacher B cannot update teacher A's reflection (NOT_FOUND)", async () => {
    scopeMock.current = asTeacherOf(schoolA, 'รร.A')
    const a = await createReflectionAction({
      reflectionDate: '2026-05-11',
      whatHappened: 'A says',
    })
    if (!a.ok) throw new Error('seed')

    scopeMock.current = asTeacherOf(schoolB, 'รร.B')
    const result = await updateReflectionAction({
      id: a.data.id,
      whatHappened: 'B tries to overwrite',
    })

    expect(result.ok).toBe(false)
    if (result.ok) return
    // School-scope filter in queries.ts means the row is INVISIBLE to teacher B,
    // returning NOT_FOUND rather than PERMISSION_DENIED. Either is fine —
    // both prevent leakage of "this id exists in another school".
    expect(['NOT_FOUND', 'PERMISSION_DENIED']).toContain(result.code)

    // Data unchanged
    const row = await testPrisma.teacherDailyReflection.findUniqueOrThrow({
      where: { id: a.data.id },
    })
    expect(row.whatHappened).toBe('A says')
  })

  it("teacher B cannot delete teacher A's reflection", async () => {
    scopeMock.current = asTeacherOf(schoolA, 'รร.A')
    const a = await createReflectionAction({
      reflectionDate: '2026-05-11',
      whatHappened: 'A keeps this',
    })
    if (!a.ok) throw new Error('seed')

    scopeMock.current = asTeacherOf(schoolB, 'รร.B')
    const result = await deleteReflectionAction({ id: a.data.id })
    expect(result.ok).toBe(false)

    // Row still exists, not soft-deleted
    const row = await testPrisma.teacherDailyReflection.findUniqueOrThrow({
      where: { id: a.data.id },
    })
    expect(row.deletedAt).toBeNull()
  })
})

describe('Cross-school isolation — DB-level check', () => {
  it('school A and B reflections have distinct schoolIds in the DB', async () => {
    scopeMock.current = asTeacherOf(schoolA, 'รร.A')
    await createReflectionAction({ reflectionDate: '2026-05-11', whatHappened: 'A' })

    scopeMock.current = asTeacherOf(schoolB, 'รร.B')
    await createReflectionAction({ reflectionDate: '2026-05-11', whatHappened: 'B' })

    const all = await testPrisma.teacherDailyReflection.findMany({
      orderBy: { createdAt: 'asc' },
    })
    expect(all).toHaveLength(2)
    expect(all[0].schoolId).toBe(schoolA.schoolId)
    expect(all[1].schoolId).toBe(schoolB.schoolId)
    expect(all[0].schoolId).not.toBe(all[1].schoolId)
  })

  it('queries always filter by scope.schoolId — confirmed by counting raw vs scoped', async () => {
    // Both schools create reflections
    scopeMock.current = asTeacherOf(schoolA, 'รร.A')
    await createReflectionAction({ reflectionDate: '2026-05-11', whatHappened: 'A1' })
    await createReflectionAction({ reflectionDate: '2026-05-12', whatHappened: 'A2' })

    scopeMock.current = asTeacherOf(schoolB, 'รร.B')
    await createReflectionAction({ reflectionDate: '2026-05-11', whatHappened: 'B1' })

    // Raw count
    expect(await testPrisma.teacherDailyReflection.count()).toBe(3)

    // Scoped: B only sees 1
    scopeMock.current = asTeacherOf(schoolB, 'รร.B')
    const bList = await listMyReflections({ limit: 100 })
    expect(bList).toHaveLength(1)

    // Scoped: A only sees 2
    scopeMock.current = asTeacherOf(schoolA, 'รร.A')
    const aList = await listMyReflections({ limit: 100 })
    expect(aList).toHaveLength(2)
  })
})
