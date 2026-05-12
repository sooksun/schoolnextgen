/**
 * Permission helpers. Pure synchronous functions on (scope, resource).
 * Do NOT call DB here — pass loaded subsets in. Server actions resolve
 * scope + load resource, then call these.
 */

import type { Scope } from './types'

type ReflectionSubset = {
  teacherUserId: string
  schoolId: string
  classroomId: string | null
  status: string
}

const STAFF_ROLES = new Set([
  'director',
  'academic_lead',
  'deputy_academic',
  'deputy_budget',
  'deputy_hr',
  'deputy_general_affairs',
])

const FROZEN_REFLECTION_STATUSES = new Set(['sar_selected', 'sar_exported'])

export const can = {
  // ───── Reflection ─────────────────────────────────────────
  viewReflection(scope: Scope, r: ReflectionSubset): boolean {
    if (r.schoolId !== scope.schoolId) return false
    if (scope.role === 'teacher') return r.teacherUserId === scope.user.id
    return STAFF_ROLES.has(scope.role)
  },

  createReflection(scope: Scope): boolean {
    return scope.role === 'teacher' && !!scope.classroomId
  },

  editReflection(scope: Scope, r: ReflectionSubset): boolean {
    if (scope.role !== 'teacher') return false
    if (r.teacherUserId !== scope.user.id) return false
    return !FROZEN_REFLECTION_STATUSES.has(r.status)
  },

  summarizeReflection(scope: Scope, r: ReflectionSubset): boolean {
    return can.editReflection(scope, r)
  },

  deleteReflection(scope: Scope, r: ReflectionSubset): boolean {
    if (scope.role !== 'teacher') return false
    return r.teacherUserId === scope.user.id && r.status === 'draft'
  },

  // ───── Dashboard ──────────────────────────────────────────
  viewSchoolDashboard(scope: Scope): boolean {
    return STAFF_ROLES.has(scope.role)
  },

  // ───── Evidence ───────────────────────────────────────────
  viewEvidenceFile(scope: Scope, file: { schoolId: string; uploadedByUserId: string }): boolean {
    if (file.schoolId !== scope.schoolId) return false
    if (scope.role === 'teacher') return file.uploadedByUserId === scope.user.id
    return STAFF_ROLES.has(scope.role)
  },
}
