import { describe, it, expect } from 'vitest'
import { allowedTransitions, canTransition } from './state-machine'

describe('canTransition', () => {
  it('blocks no-op transition (same status)', () => {
    expect(canTransition('draft', 'draft', 'creator')).toEqual({
      ok: false,
      reason: 'สถานะเดิม',
    })
  })

  it('blocks transitions out of completed (terminal)', () => {
    const r = canTransition('completed', 'in_progress', 'admin')
    expect(r.ok).toBe(false)
  })

  it('blocks transitions out of cancelled (terminal)', () => {
    const r = canTransition('cancelled', 'draft', 'admin')
    expect(r.ok).toBe(false)
  })

  it('admin can cancel any non-terminal status', () => {
    expect(canTransition('draft', 'cancelled', 'admin').ok).toBe(true)
    expect(canTransition('assigned', 'cancelled', 'admin').ok).toBe(true)
    expect(canTransition('in_progress', 'cancelled', 'admin').ok).toBe(true)
    expect(canTransition('human_review', 'cancelled', 'admin').ok).toBe(true)
  })

  it('non-admin (responsible) CANNOT cancel', () => {
    expect(canTransition('in_progress', 'cancelled', 'responsible').ok).toBe(false)
  })

  it('responsible (teacher) drives the work path: assigned → in_progress → submitted', () => {
    expect(canTransition('assigned', 'in_progress', 'responsible').ok).toBe(true)
    expect(canTransition('in_progress', 'submitted', 'responsible').ok).toBe(true)
  })

  it('responsible CANNOT skip review and self-approve', () => {
    expect(canTransition('submitted', 'approved', 'responsible').ok).toBe(false)
    expect(canTransition('human_review', 'approved', 'responsible').ok).toBe(false)
  })

  it('approver decides at human_review (approve or send back)', () => {
    expect(canTransition('human_review', 'approved', 'approver').ok).toBe(true)
    expect(canTransition('human_review', 'needs_revision', 'approver').ok).toBe(true)
  })

  it('approver CANNOT decide before review reaches them', () => {
    expect(canTransition('assigned', 'approved', 'approver').ok).toBe(false)
    expect(canTransition('in_progress', 'approved', 'approver').ok).toBe(false)
  })

  it('revision loop: needs_revision → in_progress is open to responsible', () => {
    expect(canTransition('needs_revision', 'in_progress', 'responsible').ok).toBe(true)
  })

  it('agent can flag submitted → ai_review (Phase 2.5 placeholder)', () => {
    expect(canTransition('submitted', 'ai_review', 'agent').ok).toBe(true)
  })

  it('completion: only responsible or admin can close approved → completed', () => {
    expect(canTransition('approved', 'completed', 'responsible').ok).toBe(true)
    expect(canTransition('approved', 'completed', 'admin').ok).toBe(true)
    expect(canTransition('approved', 'completed', 'approver').ok).toBe(false)
  })
})

describe('allowedTransitions', () => {
  it('admin gets full cancel matrix (8 non-terminal sources)', () => {
    const out = allowedTransitions('admin')
    const cancels = out.filter((t) => t.to === 'cancelled')
    expect(cancels).toHaveLength(8) // 10 statuses − 2 terminal
  })

  it('responsible gets work-path + revision-loop + completion', () => {
    const out = allowedTransitions('responsible')
    const pairs = out.map((t) => `${t.from}→${t.to}`)
    expect(pairs).toContain('assigned→in_progress')
    expect(pairs).toContain('in_progress→submitted')
    expect(pairs).toContain('needs_revision→in_progress')
    expect(pairs).toContain('approved→completed')
    // responsible should NOT see review-stage decisions
    expect(pairs).not.toContain('human_review→approved')
  })

  it('approver gets review decisions only (no cancel, no work-path)', () => {
    const out = allowedTransitions('approver')
    const pairs = out.map((t) => `${t.from}→${t.to}`)
    expect(pairs).toContain('human_review→approved')
    expect(pairs).toContain('human_review→needs_revision')
    expect(pairs).toContain('submitted→human_review')
    expect(pairs.every((p) => !p.endsWith('→cancelled'))).toBe(true)
  })
})
