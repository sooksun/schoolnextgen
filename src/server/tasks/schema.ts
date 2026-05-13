import { z } from 'zod'
import { TASK_PRIORITIES, TASK_STATUSES } from '@/lib/tasks/types'

const isoDate = z.union([z.string().datetime(), z.date()])

export const TaskTypeEnum = z.enum([
  'general',
  'lesson_plan',
  'worksheet',
  'plc',
  'sar_evidence',
  'reflection',
  'observation',
])
export type TaskType = z.infer<typeof TaskTypeEnum>

export const CreateTaskInput = z.object({
  title: z.string().trim().min(3, 'หัวข้อสั้นเกินไป').max(500),
  description: z.string().max(20_000).nullable().optional(),
  taskType: TaskTypeEnum.default('general'),
  priority: z.enum(TASK_PRIORITIES).default('normal'),
  dueDate: isoDate.nullable().optional(),
  departmentId: z.string().uuid().nullable().optional(),
  classroomId: z.string().uuid().nullable().optional(),
  academicTermId: z.string().uuid().nullable().optional(),
  parentTaskId: z.string().uuid().nullable().optional(),
  // Initial assignees (Phase 2 ships responsible + approver only).
  assigneeUserIds: z.array(z.string().uuid()).max(50).optional(),
  approverUserIds: z.array(z.string().uuid()).max(20).optional(),
})
export type CreateTaskInput = z.infer<typeof CreateTaskInput>

export const ChangeTaskStatusInput = z.object({
  id: z.string().uuid(),
  next: z.enum(TASK_STATUSES),
  note: z.string().max(1000).optional(),
})
export type ChangeTaskStatusInput = z.infer<typeof ChangeTaskStatusInput>

export const TaskIdInput = z.object({ id: z.string().uuid() })
