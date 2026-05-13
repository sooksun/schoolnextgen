'use client'

import { Building2, GraduationCap, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { switchSchoolAction } from '@/server/tenant/actions'
import { notify } from '@/lib/notify'
import { useRouter } from 'next/navigation'

type Membership = {
  id: string
  school: { id: string; name: string; code: string }
  academicYear: { id: string; yearLabel: string; isCurrent: boolean } | null
  role: { code: string; name: string }
}

type Props = {
  current: {
    schoolId: string
    schoolName: string
    academicYearLabel: string
    academicTermName: string | null
    roleName: string
  }
  memberships: Membership[]
}

export function ContextSwitcher({ current, memberships }: Props) {
  const router = useRouter()
  const hasMultiple = memberships.length > 1

  async function onSwitch(schoolId: string) {
    if (schoolId === current.schoolId) return
    const result = await switchSchoolAction(schoolId)
    if (result.ok) {
      notify.info('สลับโรงเรียนเรียบร้อย')
      router.refresh()
    } else {
      notify.error(result.error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" className="gap-2 max-w-[16rem]">
            <Building2 className="size-4 text-primary" />
            <span className="truncate text-sm font-medium">{current.schoolName}</span>
            <span className="hidden lg:inline text-xs text-muted-foreground">
              · {current.academicYearLabel}
              {current.academicTermName ? ` · ${current.academicTermName}` : ''}
            </span>
            {hasMultiple ? <ChevronDown className="size-4 text-muted-foreground" /> : null}
          </Button>
        }
        disabled={!hasMultiple}
      />
      {hasMultiple ? (
        <DropdownMenuContent align="start" className="min-w-72">
          <DropdownMenuGroup>
            <DropdownMenuLabel>โรงเรียนของฉัน</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {memberships.map((m) => (
            <DropdownMenuItem
              key={m.id}
              onClick={() => onSwitch(m.school.id)}
              className="flex flex-col items-start gap-0.5"
            >
              <span className="flex items-center gap-2 w-full">
                <GraduationCap className="size-4 text-primary" />
                <span className="font-medium truncate">{m.school.name}</span>
                {m.school.id === current.schoolId ? (
                  <span className="ml-auto text-xs text-primary">ปัจจุบัน</span>
                ) : null}
              </span>
              <span className="ml-6 text-xs text-muted-foreground">
                {m.role.name}
                {m.academicYear ? ` · ปี ${m.academicYear.yearLabel}` : ''}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      ) : null}
    </DropdownMenu>
  )
}
