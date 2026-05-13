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

// ────────────────────────────────────────────────────────────
// Tasks (Phase 2)
// ────────────────────────────────────────────────────────────

function makeTask(overrides: Partial<Parameters<typeof can.viewTask>[1]> = {}) {
  return {
    schoolId: 'school-A',
    departmentId: 'dept-academic',
    classroomId: 'classroom-1',
    createdByUserId: 'director-1',
    status: 'assigned',
    ...overrides,
  }
}

describe('can.viewTask', () => {
  it('assigned teacher sees own task', () => {
    expect(
      can.viewTask(makeScope('teacher'), makeTask(), [{ userId: 'user-1', role: 'responsible' }]),
    ).toBe(true)
  })

  it('non-assigned teacher CANNOT see task', () => {
    expect(
      can.viewTask(makeScope('teacher'), makeTask(), [{ userId: 'other', role: 'responsible' }]),
    ).toBe(false)
  })

  it('director sees any task in their school', () => {
    expect(can.viewTask(makeScope('director'), makeTask(), [])).toBe(true)
  })

  it('cross-school denied even for director', () => {
    expect(
      can.viewTask(makeScope('director'), makeTask({ schoolId: 'school-B' }), []),
    ).toBe(false)
  })
})

describe('can.createTask', () => {
  it('director, academic_lead, all deputies allowed', () => {
    for (const role of ['director', 'academic_lead', 'deputy_academic', 'deputy_budget', 'deputy_hr', 'deputy_general_affairs']) {
      expect(can.createTask(makeScope(role))).toBe(true)
    }
  })

  it('teacher cannot create tasks (Phase 2 — receive only)', () => {
    expect(can.createTask(makeScope('teacher'))).toBe(false)
  })
})

describe('can.taskActorRole', () => {
  it('director is always admin in own school', () => {
    expect(
      can.taskActorRole(makeScope('director'), makeTask(), [{ userId: 'someone', role: 'responsible' }]),
    ).toBe('admin')
  })

  it('creator (non-director) reports as creator', () => {
    expect(
      can.taskActorRole(makeScope('deputy_academic', { user: { id: 'director-1', personId: 'p', email: 'x' } }), makeTask(), []),
    ).toBe('creator')
  })

  it('responsible teacher reports as responsible', () => {
    expect(
      can.taskActorRole(makeScope('teacher'), makeTask(), [{ userId: 'user-1', role: 'responsible' }]),
    ).toBe('responsible')
  })

  it('deputy_academic in matching department is approver', () => {
    expect(
      can.taskActorRole(
        makeScope('deputy_academic', { departmentId: 'dept-academic' }),
        makeTask({ departmentId: 'dept-academic' }),
        [],
      ),
    ).toBe('approver')
  })

  it('deputy_academic in MISMATCHED department is null (not approver)', () => {
    expect(
      can.taskActorRole(
        makeScope('deputy_academic', { departmentId: 'dept-other' }),
        makeTask({ departmentId: 'dept-academic' }),
        [],
      ),
    ).toBeNull()
  })

  it('explicit approver assignment beats role check', () => {
    // teacher who happens to be listed as approver on a specific task
    expect(
      can.taskActorRole(makeScope('teacher'), makeTask(), [{ userId: 'user-1', role: 'approver' }]),
    ).toBe('approver')
  })

  it('cross-school returns null', () => {
    expect(
      can.taskActorRole(makeScope('director'), makeTask({ schoolId: 'school-B' }), []),
    ).toBeNull()
  })

  it('unrelated user returns null', () => {
    expect(can.taskActorRole(makeScope('teacher'), makeTask(), [])).toBeNull()
  })
})
