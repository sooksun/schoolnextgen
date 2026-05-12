'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { ContextSwitcher } from './context-switcher'
import { Sidebar } from './sidebar'
import { ThemeToggle } from './theme-toggle'
import { UserMenu } from './user-menu'

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
}

export function TopBar({ scope, displayName, memberships }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-border/60 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="h-full flex items-center gap-2 px-3 sm:px-4">
        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="เปิดเมนู">
                <Menu className="size-5" />
              </Button>
            }
          />
          <SheetContent side="left" className="p-0 w-72">
            <SheetTitle className="sr-only">เมนู</SheetTitle>
            <Sidebar role={scope.role} onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <ContextSwitcher
          current={{
            schoolId: scope.schoolId,
            schoolName: scope.schoolName,
            academicYearLabel: scope.academicYearLabel,
            academicTermName: scope.academicTermName,
            roleName: scope.roleName,
          }}
          memberships={memberships}
        />

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <UserMenu email={scope.user.email} displayName={displayName} roleName={scope.roleName} />
        </div>
      </div>
    </header>
  )
}
