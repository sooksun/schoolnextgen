'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Building2, GraduationCap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { switchSchoolAction } from '@/server/tenant/actions'
import { notify } from '@/lib/notify'

type Membership = {
  id: string
  school: { id: string; name: string; code: string }
  academicYear: { id: string; yearLabel: string; isCurrent: boolean } | null
  role: { code: string; name: string }
}

export function SelectContextForm({ memberships }: { memberships: Membership[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function pick(schoolId: string) {
    startTransition(async () => {
      const r = await switchSchoolAction(schoolId)
      if (r.ok) {
        router.push('/teacher')
        router.refresh()
      } else {
        notify.error(r.error)
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 space-y-4">
      <header className="text-center space-y-1">
        <h1 className="text-2xl font-semibold">เลือกบทบาทที่ต้องการใช้งาน</h1>
        <p className="text-sm text-muted-foreground">
          คุณมีสิทธิ์ในหลายโรงเรียน เลือกหนึ่งเพื่อเริ่มทำงาน
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {memberships.map((m) => (
          <Card key={m.id} className="p-4 hover:border-primary/40 transition-colors">
            <div className="flex items-start gap-3">
              <span className="grid place-items-center size-10 rounded-lg bg-primary/10 text-primary">
                <Building2 className="size-5" />
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{m.school.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{m.school.code}</p>
                <p className="text-xs mt-2 flex items-center gap-1">
                  <GraduationCap className="size-3" />
                  {m.role.name}
                  {m.academicYear ? ` · ปี ${m.academicYear.yearLabel}` : ''}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="w-full mt-3"
              onClick={() => pick(m.school.id)}
              disabled={pending}
            >
              เลือกบทบาทนี้
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
