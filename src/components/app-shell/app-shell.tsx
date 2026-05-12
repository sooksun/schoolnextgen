import { Sidebar } from './sidebar'
import { TopBar } from './top-bar'

type Membership = {
  id: string
  school: { id: string; name: string; code: string }
  academicYear: { id: string; yearLabel: string; isCurrent: boolean } | null
  role: { code: string; name: string }
}

type Props = {
  scope: {
    schoolId: string
    schoolName: string
    academicYearLabel: string
    academicTermName: string | null
    roleName: string
    role: string
    user: { email: string }
  }
  displayName: string
  memberships: Membership[]
  children: React.ReactNode
}

export function AppShell({ scope, displayName, memberships, children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar scope={scope} displayName={displayName} memberships={memberships} />
      <div className="flex flex-1">
        <aside className="hidden md:flex w-60 border-r border-border/60 bg-card/40 shrink-0">
          <Sidebar role={scope.role} className="w-full" />
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
