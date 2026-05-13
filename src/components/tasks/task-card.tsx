'use client'

import { useTransition } from 'react'
import { Calendar, Flag, User2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TaskStatusBadge } from './status-badge'
import { formatThaiShort } from '@/lib/date/thai'
import { notify } from '@/lib/notify'
import { changeTaskStatusAction } from '@/server/tasks/actions'
import type { TaskActorRole, TaskStatus } from '@/lib/tasks/types'
import { useRouter } from 'next/navigation'

type Props = {
  task: {
    id: string
    title: string
    description: string | null
    status: string
    priority: string
    dueDate: Date | null
    classroom: { name: string; level: string } | null
    department: { name: string } | null
    createdByUser: { person: { displayName: string } | null } | null
  }
  /** Buckets of allowed next-statuses + an action-label per transition. */
  actions: ReadonlyArray<{ next: TaskStatus; label: string; variant?: 'default' | 'outline' | 'destructive' }>
  actor: TaskActorRole | null
}

export function TaskCard({ task, actions }: Props) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function onTransition(next: TaskStatus) {
    startTransition(async () => {
      const result = await changeTaskStatusAction({ id: task.id, next })
      if (result.ok) {
        notify.updated('สถานะงาน')
        router.refresh()
      } else {
        notify.error(result.error)
      }
    })
  }

  const overdue =
    task.dueDate && new Date(task.dueDate) < new Date() && !['approved', 'completed', 'cancelled'].includes(task.status)

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold leading-snug truncate">{task.title}</h3>
            {task.description ? (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2 whitespace-pre-wrap">
                {task.description}
              </p>
            ) : null}
          </div>
          <TaskStatusBadge status={task.status} />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {task.dueDate ? (
            <span className={`inline-flex items-center gap-1 ${overdue ? 'text-destructive font-medium' : ''}`}>
              <Calendar className="size-3" />
              ครบกำหนด {formatThaiShort(task.dueDate)}
              {overdue ? ' (เลยกำหนด)' : ''}
            </span>
          ) : null}
          {task.priority !== 'normal' ? (
            <span className="inline-flex items-center gap-1">
              <Flag className="size-3" />
              {task.priority === 'urgent' ? 'ด่วนมาก' : task.priority === 'high' ? 'ด่วน' : 'ต่ำ'}
            </span>
          ) : null}
          {task.classroom ? (
            <span className="inline-flex items-center gap-1">ห้อง {task.classroom.name}</span>
          ) : task.department ? (
            <span className="inline-flex items-center gap-1">ฝ่าย {task.department.name}</span>
          ) : null}
          {task.createdByUser?.person?.displayName ? (
            <span className="inline-flex items-center gap-1">
              <User2 className="size-3" />
              สั่งโดย {task.createdByUser.person.displayName}
            </span>
          ) : null}
        </div>

        {actions.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {actions.map((a) => (
              <Button
                key={a.next}
                size="sm"
                variant={a.variant ?? 'outline'}
                disabled={pending}
                onClick={() => onTransition(a.next)}
              >
                {a.label}
              </Button>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
