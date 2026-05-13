import { ClipboardList } from 'lucide-react'
import { EmptyState } from '@/components/ui-state/empty-state'
import { TaskCard } from '@/components/tasks/task-card'
import { listMyTasks } from '@/server/tasks/queries'
import { requireScope } from '@/server/tenant/scope'
import { can } from '@/lib/scope/can'
import { allowedTransitions } from '@/server/tasks/state-machine'
import type { TaskStatus } from '@/lib/tasks/types'

export const metadata = { title: 'งานที่ได้รับมอบหมาย' }

const TRANSITION_LABEL: Partial<Record<TaskStatus, { label: string; variant?: 'default' | 'outline' | 'destructive' }>> = {
  assigned: { label: 'รับงาน' },
  in_progress: { label: 'เริ่มทำ', variant: 'default' },
  submitted: { label: 'ส่งตรวจ', variant: 'default' },
  human_review: { label: 'ส่งให้ผู้ตรวจ', variant: 'default' },
  approved: { label: 'อนุมัติ', variant: 'default' },
  needs_revision: { label: 'ส่งกลับให้แก้', variant: 'destructive' },
  completed: { label: 'ปิดงาน', variant: 'outline' },
  cancelled: { label: 'ยกเลิก', variant: 'destructive' },
}

export default async function TasksPage() {
  const scope = await requireScope()
  const tasks = await listMyTasks({ limit: 100 })

  return (
    <div className="container max-w-4xl mx-auto p-4 sm:p-6 space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">งานที่ได้รับมอบหมาย</h1>
        <p className="text-sm text-muted-foreground">{tasks.length} งานที่เปิดอยู่</p>
      </header>

      {tasks.length === 0 ? (
        <EmptyState
          icon={<ClipboardList />}
          title="ยังไม่มีงานที่มอบหมาย"
          description="เมื่อผู้บริหารหรือฝ่ายงานสั่งงานคุณ จะปรากฏที่นี่"
        />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {tasks.map((t) => {
            const actor = can.taskActorRole(scope, t, t.assignees)
            const transitions = actor
              ? allowedTransitions(actor).filter((x) => x.from === t.status)
              : []
            const actions = transitions
              .map((x) => {
                const meta = TRANSITION_LABEL[x.to]
                return meta ? { next: x.to, label: meta.label, variant: meta.variant } : null
              })
              .filter((x): x is NonNullable<typeof x> => x !== null)
            return <TaskCard key={t.id} task={t} actions={actions} actor={actor} />
          })}
        </div>
      )}
    </div>
  )
}
