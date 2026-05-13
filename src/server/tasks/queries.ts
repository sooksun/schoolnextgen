import 'server-only'
import { prisma } from '@/lib/db'
import { requireScope } from '@/server/tenant/scope'
import { can } from '@/lib/scope/can'

export type TaskListItem = Awaited<ReturnType<typeof listMyTasks>>[number]

/**
 * Tasks the current user is on as a `responsible` assignee, plus tasks they
 * created. Sorted by due date asc (nulls last), then created desc.
 *
 * Excludes terminal statuses unless `includeClosed: true`.
 */
export async function listMyTasks(opts?: {
  limit?: number
  includeClosed?: boolean
}) {
  const scope = await requireScope()
  const limit = Math.min(opts?.limit ?? 50, 200)
  const excludeClosed = !opts?.includeClosed
  return prisma.task.findMany({
    where: {
      schoolId: scope.schoolId,
      deletedAt: null,
      ...(excludeClosed
        ? { status: { notIn: ['completed', 'cancelled'] } }
        : {}),
      OR: [
        { createdByUserId: scope.user.id },
        { assignees: { some: { userId: scope.user.id } } },
      ],
    },
    orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
    take: limit,
    include: {
      classroom: { select: { id: true, name: true, level: true } },
      department: { select: { id: true, name: true } },
      createdByUser: { select: { id: true, email: true, person: { select: { displayName: true } } } },
      assignees: {
        select: {
          userId: true,
          role: true,
          user: { select: { id: true, person: { select: { displayName: true } } } },
        },
      },
    },
  })
}

/** Get one task, scoped + permission-checked. */
export async function getTaskById(id: string) {
  const scope = await requireScope()
  const task = await prisma.task.findFirst({
    where: { id, schoolId: scope.schoolId, deletedAt: null },
    include: {
      classroom: { select: { id: true, name: true, level: true } },
      department: { select: { id: true, name: true } },
      academicTerm: { select: { id: true, name: true } },
      createdByUser: { select: { id: true, email: true, person: { select: { displayName: true } } } },
      assignees: {
        include: {
          user: { select: { id: true, email: true, person: { select: { displayName: true } } } },
        },
      },
      parent: { select: { id: true, title: true, status: true } },
      children: {
        select: { id: true, title: true, status: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  })
  if (!task) return null
  if (!can.viewTask(scope, task, task.assignees)) return null
  return task
}
