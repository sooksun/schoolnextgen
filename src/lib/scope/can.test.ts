import { describe, it, expect } from 'vitest'
import { can } from './can'
import type { Scope } from '@/server/tenant/scope'

function makeScope(role: string, overrides: Partial<Scope> = {}): Scope {
  return {
    user: { id: 'user-1', personId: 'person-1', email: 'u@demo.local' },
    membershipId: 'm1',
    schoolId: 'school-A',
    schoolName: 'โรงเรียน A',
    academicYearId: 'year-1',
    academicYearLabel: '2569',
    academicTermId: null,
    academicTermName: null,
    role,
    roleName: 'role',
    departmentId: null,
    classroomId: role === 'teacher' ? 'classroom-1' : null,
    classroomName: null,
    ...overrides,
  }
}

function makeReflection(overrides: Partial<Parameters<typeof can.viewReflection>[1]> = {}) {
  return {
    teacherUserId: 'user-1',
    schoolId: 'school-A',
    classroomId: 'classroom-1',
    status: 'draft',
    ...overrides,
  }
}

describe('can.viewReflection', () => {
  it('teacher sees own reflection', () => {
    expect(can.viewReflection(makeScope('teacher'), makeReflection())).toBe(true)
  })

  it("teacher CANNOT see another teacher's reflection", () => {
    expect(
      can.viewReflection(makeScope('teacher'), makeReflection({ teacherUserId: 'other-user' })),
    ).toBe(false)
  })

  it('director sees any reflection in their school', () => {
    expect(
      can.viewReflection(makeScope('director'), makeReflection({ teacherUserId: 'someone' })),
    ).toBe(true)
  })

  it('director CANNOT see reflection from another school', () => {
    expect(
      can.viewReflection(makeScope('director'), makeReflection({ schoolId: 'school-B' })),
    ).toBe(false)
  })

  it('deputy_academic sees any reflection in their school', () => {
    expect(
      can.viewReflection(makeScope('deputy_academic'), makeReflection({ teacherUserId: 'x' })),
    ).toBe(true)
  })

  it('unknown role denied', () => {
    expect(can.viewReflection(makeScope('unknown_role'), makeReflection())).toBe(false)
  })
})

describe('can.createReflection', () => {
  it('teacher with classroom can create', () => {
    expect(can.createReflection(makeScope('teacher'))).toBe(true)
  })

  it('teacher WITHOUT classroom cannot create', () => {
    expect(can.createReflection(makeScope('teacher', { classroomId: null }))).toBe(false)
  })

  it('director cannot create reflections', () => {
    expect(can.createReflection(makeScope('director'))).toBe(false)
  })
})

describe('can.editReflection', () => {
  it('teacher edits own draft', () => {
    expect(can.editReflection(makeScope('teacher'), makeReflection({ status: 'draft' }))).toBe(true)
  })

  it('teacher edits own ai_summarized', () => {
    expect(
      can.editReflection(makeScope('teacher'), makeReflection({ status: 'ai_summarized' })),
    ).toBe(true)
  })

  it('teacher CANNOT edit sar_selected (frozen)', () => {
    expect(
      can.editReflection(makeScope('teacher'), makeReflection({ status: 'sar_selected' })),
    ).toBe(false)
  })

  it('teacher CANNOT edit sar_exported (frozen)', () => {
    expect(
      can.editReflection(makeScope('teacher'), makeReflection({ status: 'sar_exported' })),
    ).toBe(false)
  })

  it("teacher CANNOT edit another teacher's draft", () => {
    expect(
      can.editReflection(
        makeScope('teacher'),
        makeReflection({ teacherUserId: 'other', status: 'draft' }),
      ),
    ).toBe(false)
  })

  it('director cannot edit reflections at all', () => {
    expect(can.editReflection(makeScope('director'), makeReflection())).toBe(false)
  })
})

describe('can.deleteReflection', () => {
  it('teacher deletes own draft', () => {
    expect(
      can.deleteReflection(makeScope('teacher'), makeReflection({ status: 'draft' })),
    ).toBe(true)
  })

  it('teacher CANNOT delete own non-draft (e.g., ai_summarized)', () => {
    expect(
      can.deleteReflection(makeScope('teacher'), makeReflection({ status: 'ai_summarized' })),
    ).toBe(false)
  })

  it("teacher CANNOT delete another teacher's draft", () => {
    expect(
      can.deleteReflection(
        makeScope('teacher'),
        makeReflection({ teacherUserId: 'other', status: 'draft' }),
      ),
    ).toBe(false)
  })

  it('director CANNOT delete reflections', () => {
    expect(
      can.deleteReflection(makeScope('director'), makeReflection({ status: 'draft' })),
    ).toBe(false)
  })
})

describe('can.viewSchoolDashboard', () => {
  it.each([
    'director',
    'academic_lead',
    'deputy_academic',
    'deputy_budget',
    'deputy_hr',
    'deputy_general_affairs',
  ])('%s allowed', (role) => {
    expect(can.viewSchoolDashboard(makeScope(role))).toBe(true)
  })

  it('teacher denied', () => {
    expect(can.viewSchoolDashboard(makeScope('teacher'))).toBe(false)
  })
})

describe('can.viewEvidenceFile', () => {
  it('teacher views own file', () => {
    expect(
      can.viewEvidenceFile(makeScope('teacher'), {
        schoolId: 'school-A',
        uploadedByUserId: 'user-1',
      }),
    ).toBe(true)
  })

  it("teacher CANNOT view another teacher's file", () => {
    expect(
      can.viewEvidenceFile(makeScope('teacher'), {
        schoolId: 'school-A',
        uploadedByUserId: 'other',
      }),
    ).toBe(false)
  })

  it('director views any file in school', () => {
    expect(
      can.viewEvidenceFile(makeScope('director'), {
        schoolId: 'school-A',
        uploadedByUserId: 'anyone',
      }),
    ).toBe(true)
  })

  it('cross-school access denied for all roles', () => {
    for (const role of ['teacher', 'director', 'deputy_academic']) {
      expect(
        can.viewEvidenceFile(makeScope(role), {
          schoolId: 'school-B',
          uploadedByUserId: 'user-1',
        }),
      ).toBe(false)
    }
  })
})
