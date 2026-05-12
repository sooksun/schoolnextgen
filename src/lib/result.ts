/**
 * Server Action result contract.
 * Every server action returns `Promise<ActionResult<T>>` (or throws for streaming).
 * Client consumers do `if (result.ok) { ... } else { notify.error(result.error) }`.
 */

export type ActionCode =
  | 'UNAUTHENTICATED'
  | 'PERMISSION_DENIED'
  | 'VALIDATION'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'AI_ERROR'
  | 'FILE_TOO_LARGE'
  | 'INVALID_MIME'
  | 'INTERNAL'

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; code: ActionCode; error: string }

export const ok = <T>(data: T): ActionResult<T> => ({ ok: true, data })

export const err = (code: ActionCode, error: string): ActionResult<never> => ({
  ok: false,
  code,
  error,
})

export class ActionError extends Error {
  constructor(public code: ActionCode, message: string) {
    super(message)
    this.name = 'ActionError'
  }
}

/**
 * Throw if predicate is false. Caught by action's outer try/catch and converted
 * to `err(code, message)` shape.
 */
export function requirePermission(
  allowed: boolean,
  message = 'ไม่มีสิทธิ์ดำเนินการนี้',
): asserts allowed {
  if (!allowed) throw new ActionError('PERMISSION_DENIED', message)
}
