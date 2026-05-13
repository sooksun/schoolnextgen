/**
 * Task workflow types. Lives in `lib/` so both `lib/scope/can.ts` (which
 * decides who can transition) and `server/tasks/state-machine.ts` (which
 * decides which transitions are allowed from a given status) can share
 * them without violating the lib → server import ban.
 */

export const TASK_STATUSES = [
  'draft',
  'assigned',
  'in_progress',
  'submitted',
  'ai_review',
  'human_review',
  'needs_revision',
  'approved',
  'completed',
  'cancelled',
] as const

export type TaskStatus = (typeof TASK_STATUSES)[number]

/** Statuses that can no longer be transitioned out of. */
export const TERMINAL_STATUSES: ReadonlySet<TaskStatus> = new Set([
  'completed',
  'cancelled',
])

/**
 * Actor bucket used by the state-machine + permission checks. Resolved from
 * `(scope, task, assignees)` via `can.taskActorRole`.
 */
export type TaskActorRole = 'creator' | 'responsible' | 'approver' | 'admin' | 'agent'

export const TASK_PRIORITIES = ['low', 'normal', 'high', 'urgent'] as const
export type TaskPriority = (typeof TASK_PRIORITIES)[number]
