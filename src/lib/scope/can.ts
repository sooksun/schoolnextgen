/**
 * Permission helpers. Pure synchronous functions on (scope, resource).
 * Do NOT call DB here — pass loaded subsets in. Server actions resolve
 * scope + load resource, then call these.
 */

import type { Scope } from './types'
import type { TaskActorRole, TaskStatus } from '@/lib/tasks/types'

type ReflectionSubset = {
  teacherUserId: string
  schoolId: string
  classroomId: string | null
  status: string
}

type TaskSubset = {
  schoolId: string
  departmentId: string | null
  classroomId: string | null
  createdByUserId: string
  status: string
}

type TaskAssigneeRow = {
  userId: string | null
  role: string // responsible | reviewer | approver | observer
}

const STAFF_ROLES = new Set([
  'director',
  'academic_lead',
  'deputy_academic',
  'deputy_budget',
  'deputy_hr',
  'deputy_general_affairs',
])

const APPROVER_ROLES = new Set([
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

  // ───── Tasks (Phase 2) ────────────────────────────────────
  /**
   * View: assignees see their own tasks; staff see anything in their school
   * (further dept/classroom narrowing can be added when we know the UX).
   */
  viewTask(scope: Scope, task: TaskSubset, assignees: ReadonlyArray<TaskAssigneeRow>): boolean {
    if (task.schoolId !== scope.schoolId) return false
    if (STAFF_ROLES.has(scope.role)) return true
    if (scope.role === 'teacher') {
      return assignees.some((a) => a.userId === scope.user.id)
    }
    return false
  },

  /** Only director / deputies create tasks in Phase 2. Teachers receive. */
  createTask(scope: Scope): boolean {
    return STAFF_ROLES.has(scope.role)
  },

  /**
   * Resolve the actor bucket (`creator | responsible | approver | admin | agent`)
   * for state-machine checks. `null` if user has no standing to act.
   *
   * `admin` here = director-equivalent (only director gets cancel-anything).
   * Deputies are approvers in their department's chain, not admins.
   */
  taskActorRole(
    scope: Scope,
    task: TaskSubset,
    assignees: ReadonlyArray<TaskAssigneeRow>,
  ): TaskActorRole | null {
    if (task.schoolId !== scope.schoolId) return null
    if (scope.role === 'director') return 'admin'
    if (task.createdByUserId === scope.user.id) return 'creator'
    if (assignees.some((a) => a.userId === scope.user.id && a.role === 'approver')) {
      return 'approver'
    }
    if (APPROVER_ROLES.has(scope.role)) {
      // Deputy/academic_lead: approver IF the task is in their department.
      if (task.departmentId && task.departmentId === scope.departmentId) return 'approver'
    }
    if (assignees.some((a) => a.userId === scope.user.id && a.role === 'responsible')) {
      return 'responsible'
    }
    return null
  },

  /** Convenience wrapper. UI/actions call this to decide which next-state buttons to render. */
  canChangeTaskStatus(
    scope: Scope,
    task: TaskSubset,
    assignees: ReadonlyArray<TaskAssigneeRow>,
    _next: TaskStatus,
  ): TaskActorRole | null {
    return can.taskActorRole(scope, task, assignees)
  },
}
