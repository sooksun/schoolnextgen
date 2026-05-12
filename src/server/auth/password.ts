import 'server-only'
import { hash, verify } from '@node-rs/argon2'

// Argon2id parameters tuned for ~250ms on a typical laptop CPU.
// Adjust upward as hardware improves; downward if seed/login becomes too slow.
const ARGON2_OPTIONS = {
  memoryCost: 19456, // 19 MiB
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
}

export async function hashPassword(plain: string): Promise<string> {
  if (plain.length < 8) throw new Error('Password must be at least 8 characters')
  return hash(plain, ARGON2_OPTIONS)
}

export async function verifyPassword(hashStored: string, plain: string): Promise<boolean> {
  try {
    return await verify(hashStored, plain)
  } catch {
    return false
  }
}

/**
 * Lazily computed reference hash used to equalize work between "user not found"
 * and "user found, wrong password" code paths in signInAction.
 *
 * Generated on first call using real argon2id with our production parameters,
 * so `verifyPassword(getDummyHash(), 'anything')` takes the same ~250 ms as a
 * real password check. Cached for the lifetime of the Node process.
 *
 * DO NOT inline a string literal here — a malformed hash makes verify() throw
 * immediately, breaking the timing-attack defense this function exists for.
 */
let dummyHashPromise: Promise<string> | null = null
export function getDummyHash(): Promise<string> {
  if (!dummyHashPromise) {
    dummyHashPromise = hash('snx-dummy-hash-input-never-matches-real-passwords', ARGON2_OPTIONS)
  }
  return dummyHashPromise
}
