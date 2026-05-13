import { Badge } from '@/components/ui/badge'
import type { TaskStatus } from '@/lib/tasks/types'

const LABEL: Record<TaskStatus, string> = {
  draft: 'ร่าง',
  assigned: 'มอบหมายแล้ว',
  in_progress: 'กำลังทำ',
  submitted: 'ส่งแล้ว',
  ai_review: 'AI ตรวจ',
  human_review: 'รอผู้ตรวจ',
  needs_revision: 'แก้ไข',
  approved: 'อนุมัติ',
  completed: 'เสร็จสิ้น',
  cancelled: 'ยกเลิก',
}

const VARIANT: Record<TaskStatus, 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'> = {
  draft: 'outline',
  assigned: 'secondary',
  in_progress: 'default',
  submitted: 'secondary',
  ai_review: 'secondary',
  human_review: 'secondary',
  needs_revision: 'destructive',
  approved: 'default',
  completed: 'outline',
  cancelled: 'ghost',
}

export function TaskStatusBadge({ status }: { status: TaskStatus | string }) {
  const s = (status in LABEL ? status : 'draft') as TaskStatus
  return <Badge variant={VARIANT[s]}>{LABEL[s]}</Badge>
}
