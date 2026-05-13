/**
 * Task workflow state machine.
 *
 * Statuses + transitions follow `docs/database-schema.md` line 322 and
 * `docs/architecture.md` lines 169–172. Implemented as a transition map so
 * `canTransition` can return a specific reason and tests can assert the
 * contract directly.
 *
 * Phase 2 Slice 1A ships the full status enum but only wires the linear
 * happy path + cancel + revision-loop. Approver-role gating lives in
 * `lib/scope/can.ts` via `can.taskActorRole(scope, task, assignees)`.
 */

import {
  TASK_STATUSES,
  TERMINAL_STATUSES,
  type TaskActorRole,
  type TaskStatus,
} from '@/lib/tasks/types'

export { TASK_STATUSES, TERMINAL_STATUSES, type TaskActorRole, type TaskStatus }

type Transition = {
  from: TaskStatus
  to: TaskStatus
  actors: ReadonlyArray<TaskActorRole>
}

const TRANSITIONS: ReadonlyArray<Transition> = [
  // Director / deputy creates and assigns
  { from: 'draft', to: 'assigned', actors: ['creator', 'admin'] },

  // Teacher (responsible) starts work
  { from: 'assigned', to: 'in_progress', actors: ['responsible'] },

  // Teacher submits for review
  { from: 'in_progress', to: 'submitted', actors: ['responsible'] },

  // AI agent flags submitted work for AI review (Phase 2.5+ — placeholder)
  { from: 'submitted', to: 'ai_review', actors: ['agent', 'admin'] },

  // Either submitted → human_review directly, or after AI sanity pass
  { from: 'submitted', to: 'human_review', actors: ['admin', 'approver'] },
  { from: 'ai_review', to: 'human_review', actors: ['admin', 'approver'] },

  // Approver decides
  { from: 'human_review', to: 'approved', actors: ['approver'] },
  { from: 'human_review', to: 'needs_revision', actors: ['approver'] },

  // Teacher re-works after revision request
  { from: 'needs_revision', to: 'in_progress', actors: ['responsible'] },

  // Final completion
  { from: 'approved', to: 'completed', actors: ['responsible', 'admin'] },
]

/**
 * Compute allowed (from, to) pairs given an actor role.
 * Includes the implicit "any non-terminal → cancelled" rule for admin.
 */
export function allowedTransitions(
  actor: TaskActorRole,
): ReadonlyArray<{ from: TaskStatus; to: TaskStatus }> {
  const out: Array<{ from: TaskStatus; to: TaskStatus }> = []
  for (const t of TRANSITIONS) {
    if (t.actors.includes(actor)) out.push({ from: t.from, to: t.to })
  }
  if (actor === 'admin') {
    for (const s of TASK_STATUSES) {
      if (!TERMINAL_STATUSES.has(s)) out.push({ from: s, to: 'cancelled' })
    }
  }
  return out
}

export type TransitionResult = { ok: true } | { ok: false; reason: string }

/** Pure check — does `actor` have a documented transition from `from → to`? */
export function canTransition(
  from: TaskStatus,
  to: TaskStatus,
  actor: TaskActorRole,
): TransitionResult {
  if (from === to) {
    return { ok: false, reason: 'สถานะเดิม' }
  }
  if (TERMINAL_STATUSES.has(from)) {
    return { ok: false, reason: 'งานปิดแล้ว ไม่สามารถเปลี่ยนสถานะ' }
  }
  // Admin escape hatch: cancel anything non-terminal.
  if (to === 'cancelled' && actor === 'admin') return { ok: true }

  const match = TRANSITIONS.find(
    (t) => t.from === from && t.to === to && t.actors.includes(actor),
  )
  if (!match) {
    return { ok: false, reason: `เปลี่ยน ${from} → ${to} ไม่ได้สำหรับบทบาทนี้` }
  }
  return { ok: true }
}
