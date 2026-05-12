import { NextResponse, type NextRequest } from 'next/server'

/**
 * Edge proxy (Next.js 16 renamed `middleware.ts` → `proxy.ts`).
 *
 * Copenhagen Book pattern: session validation happens in Server Components
 * and Server Actions, not here. Proxy does ONE thing — CSRF origin check
 * for non-GET requests.
 *
 * Auth redirects live in route layouts (e.g., src/app/(app)/layout.tsx).
 */
export function proxy(request: NextRequest) {
  const method = request.method

  if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
    const origin = request.headers.get('Origin')
    const host = request.headers.get('Host')
    if (origin) {
      try {
        const originHost = new URL(origin).host
        if (originHost !== host) {
          return new NextResponse(null, { status: 403, statusText: 'Forbidden (CSRF)' })
        }
      } catch {
        return new NextResponse(null, { status: 403, statusText: 'Forbidden (CSRF)' })
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/uploads/).*)'],
}
