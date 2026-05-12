import 'server-only'
import { cache } from 'react'
import { readSessionToken } from './cookies'
import { validateSessionToken, type SessionUser, type SessionRow } from './sessions'

export type ValidatedRequest =
  | { user: SessionUser; session: SessionRow }
  | { user: null; session: null }

/**
 * Resolves the current session from the cookie.
 * Cached per request via React `cache()` — multiple calls within one request
 * hit memory, not the DB.
 *
 * NOTE: cookie refresh (sliding expiry) happens inside validateSessionToken().
 * We can't write cookies from Server Components in App Router, so the cookie
 * `expires` attribute is set on first issue and on explicit sign-in only.
 * The DB session expiry is the source of truth.
 */
export const validateRequest = cache(async (): Promise<ValidatedRequest> => {
  const token = await readSessionToken()
  if (!token) return { user: null, session: null }
  const result = await validateSessionToken(token)
  if (!result.session) return { user: null, session: null }
  return { user: result.user, session: result.session }
})
