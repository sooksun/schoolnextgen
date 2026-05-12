import { redirect } from 'next/navigation'
import { AppShell } from '@/components/app-shell/app-shell'
import { resolveCurrentScope } from '@/server/tenant/scope'
import { getPersonDisplayName, listMyMemberships } from '@/server/tenant/queries'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const scope = await resolveCurrentScope()
  if (!scope) redirect('/login')

  const [memberships, displayName] = await Promise.all([
    listMyMemberships(),
    getPersonDisplayName(scope.user.personId),
  ])

  return (
    <AppShell
      scope={scope}
      displayName={displayName ?? scope.user.email}
      memberships={memberships}
    >
      {children}
    </AppShell>
  )
}
