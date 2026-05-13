'use server'

import 'server-only'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { requireScope } from '@/server/tenant/scope'
import { can } from '@/lib/scope/can'
import {
  ActionError,
  err,
  ok,
  requirePermission,
  type ActionResult,
} from '@/lib/result'
import { captureActionError } from '@/lib/observability'
import { canTransition } from './state-machine'
import { ChangeTaskStatusInput, CreateTaskInput } from './schema'

function toDate(v: Date | string | null | undefined): Date | null {
  if (v == null) return null
  if (v instanceof Date) return v
  return new Date(v)
}

export async function createTaskAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const scope = await requireScope()
    requirePermission(can.createTask(scope), 'เฉพาะผู้บริหารหรือฝ่ายงานเท่านั้น')

    const parsed = CreateTaskInput.safeParse(input)
    if (!parsed.success) {
      return err('VALIDATION', parsed.error.issues[0]?.message ?? 'ข้อมูลไม่ครบถ้วน')
    }
    const data = parsed.data

    const scopeLevel =
      data.classroomId ? 'classroom' :
      data.departmentId ? 'department' :
      'school'

    const created = await prisma.$transaction(async (tx) => {
      const task = await tx.task.create({
        data: {
          schoolId: scope.schoolId,
          academicYearId: scope.academicYearId,
          academicTermId: data.academicTermId ?? scope.academicTermId ?? null,
          departmentId: data.departmentId ?? scope.departmentId ?? null,
          classroomId: data.classroomId ?? null,
          parentTaskId: data.parentTaskId ?? null,
          taskType: data.taskType,
          scopeLevel,
          title: data.title,
          description: data.description ?? null,
          priority: data.priority,
          dueDate: toDate(data.dueDate),
          status: data.assigneeUserIds && data.assigneeUserIds.length > 0 ? 'assigned' : 'draft',
          createdByUserId: scope.user.id,
        },
        select: { id: true },
      })

      const rows: Array<{ taskId: string; userId: string; role: string }> = []
      for (const userId of data.assigneeUserIds ?? []) {
        rows.push({ taskId: task.id, userId, role: 'responsible' })
      }
      for (const userId of data.approverUserIds ?? []) {
        rows.push({ taskId: task.id, userId, role: 'approver' })
      }
      if (rows.length > 0) {
        await tx.taskAssignee.createMany({ data: rows })
      }
      return task
    })

    revalidatePath('/teacher/tasks')
    revalidatePath('/school/dashboard')
    return ok({ id: created.id })
  } catch (e) {
    if (e instanceof ActionError) return err(e.code, e.message)
    captureActionError('createTaskAction', e)
    return err('INTERNAL', 'เกิดข้อผิดพลาดในระบบ')
  }
}

export async function changeTaskStatusAction(
  input: unknown,
): Promise<ActionResult<{ id: string; status: string }>> {
  try {
    const scope = await requireScope()
    const parsed = ChangeTaskStatusInput.safeParse(input)
    if (!parsed.success) {
      return err('VALIDATION', parsed.error.issues[0]?.message ?? 'ข้อมูลไม่ครบถ้วน')
    }
    const { id, next } = parsed.data

    const task = await prisma.task.findFirst({
      where: { id, schoolId: scope.schoolId, deletedAt: null },
      include: {
        assignees: { select: { userId: true, role: true } },
      },
    })
    if (!task) return err('NOT_FOUND', 'ไม่พบงาน')

    const actor = can.taskActorRole(scope, task, task.assignees)
    if (!actor) return err('PERMISSION_DENIED', 'ไม่มีสิทธิ์เปลี่ยนสถานะงานนี้')

    const check = canTransition(task.status as never, next, actor)
    if (!check.ok) return err('VALIDATION', check.reason)

    const updated = await prisma.task.update({
      where: { id },
      data: { status: next },
      select: { id: true, status: true },
    })

    revalidatePath('/teacher/tasks')
    revalidatePath(`/teacher/tasks/${id}`)
    revalidatePath('/school/dashboard')
    return ok(updated)
  } catch (e) {
    if (e instanceof ActionError) return err(e.code, e.message)
    captureActionError('changeTaskStatusAction', e)
    return err('INTERNAL', 'เกิดข้อผิดพลาดในระบบ')
  }
}
