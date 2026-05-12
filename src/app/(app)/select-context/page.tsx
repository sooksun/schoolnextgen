import { redirect } from 'next/navigation'
import { listMyMemberships } from '@/server/tenant/queries'
import { validateRequest } from '@/server/auth/validate-request'
import { SelectContextForm } from './select-context-form'

export const metadata = { title: 'เลือกบทบาท — SchoolNextgen' }

export default async function SelectContextPage() {
  const { user } = await validateRequest()
  if (!user) redirect('/login')
  const memberships = await listMyMemberships()
  if (memberships.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 rounded-2xl border border-border bg-card text-center">
        <h2 className="text-lg font-semibold">ไม่พบสิทธิ์ในโรงเรียนใด</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          กรุณาติดต่อผู้ดูแลระบบเพื่อกำหนดสิทธิ์
        </p>
      </div>
    )
  }
  if (memberships.length === 1) {
    // Auto-pick — go straight to teacher area
    redirect('/teacher')
  }
  return <SelectContextForm memberships={memberships} />
}
