import 'server-only'
import { prisma } from '@/lib/db'
import { requireScope, type Scope } from '@/server/tenant/scope'
import { can } from '@/lib/scope/can'

export type ReflectionListItem = Awaited<ReturnType<typeof listMyReflections>>[number]

/** Teacher: list my reflections (newest first, with attachment count). */
export async function listMyReflections(opts?: {
  limit?: number
  cursor?: string | null
  status?: string
}) {
  const scope = await requireScope()
  const limit = Math.min(opts?.limit ?? 30, 100)

  return prisma.teacherDailyReflection.findMany({
    where: {
      teacherUserId: scope.user.id,
      schoolId: scope.schoolId,
      deletedAt: null,
      ...(opts?.status ? { status: opts.status } : {}),
    },
    orderBy: [{ reflectionDate: 'desc' }, { createdAt: 'desc' }],
    take: limit,
    ...(opts?.cursor ? { cursor: { id: opts.cursor }, skip: 1 } : {}),
    include: {
      classroom: { select: { id: true, name: true, level: true } },
      _count: { select: { attachments: true, aiSummaries: true } },
    },
  })
}

/** Get one reflection by id, scoped + permission-checked. Returns null if forbidden. */
export async function getReflectionById(id: string) {
  const scope = await requireScope()
  const r = await prisma.teacherDailyReflection.findFirst({
    where: { id, schoolId: scope.schoolId, deletedAt: null },
    include: {
      classroom: { select: { id: true, name: true, level: true } },
      attachments: {
        include: {
          evidenceFile: {
            select: { id: true, fileType: true, fileUrl: true, title: true, mimeType: true, fileSizeBytes: true },
          },
        },
        orderBy: { displayOrder: 'asc' },
      },
      aiSummaries: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  })
  if (!r) return null
  if (!can.viewReflection(scope, r)) return null
  return r
}

/** School-wide: list today's reflections (Director/Deputy dashboard). */
export async function listTodayReflections() {
  const scope = await requireScope()
  if (!can.viewSchoolDashboard(scope)) return []
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return prisma.teacherDailyReflection.findMany({
    where: {
      schoolId: scope.schoolId,
      academicYearId: scope.academicYearId,
      reflectionDate: { gte: start, lt: end },
      deletedAt: null,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      teacherUser: { select: { id: true, email: true } },
      teacherPerson: { select: { id: true, displayName: true } },
      classroom: { select: { id: true, name: true, level: true } },
    },
  })
}

/** Count reflections for the current term, grouped by status. */
export async function countReflectionsByStatus(scope?: Scope) {
  const s = scope ?? (await requireScope())
  if (!can.viewSchoolDashboard(s)) return {}
  const rows = await prisma.teacherDailyReflection.groupBy({
    by: ['status'],
    where: {
      schoolId: s.schoolId,
      academicYearId: s.academicYearId,
      deletedAt: null,
    },
    _count: { _all: true },
  })
  return Object.fromEntries(rows.map((r) => [r.status, r._count._all])) as Record<string, number>
}

/** Streak: consecutive days back from today the teacher has a teacher_confirmed reflection. */
export async function getTeacherStreak(): Promise<number> {
  const scope = await requireScope()
  if (scope.role !== 'teacher') return 0

  // Pull last 60 distinct reflection_date values where status >= teacher_confirmed.
  const rows = await prisma.teacherDailyReflection.findMany({
    where: {
      teacherUserId: scope.user.id,
      schoolId: scope.schoolId,
      status: { in: ['teacher_confirmed', 'academic_reviewed', 'sar_candidate', 'sar_selected', 'sar_exported'] },
      deletedAt: null,
    },
    select: { reflectionDate: true },
    orderBy: { reflectionDate: 'desc' },
    take: 60,
  })

  const dateSet = new Set(rows.map((r) => isoOf(r.reflectionDate)))
  let streak = 0
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  // Count consecutive days going backwards, skipping weekends (Sat=6, Sun=0)
  while (streak < 60) {
    const dow = cursor.getDay()
    if (dow !== 0 && dow !== 6) {
      if (dateSet.has(isoOf(cursor))) {
        streak++
      } else if (cursor.getTime() < Date.now() - 24 * 60 * 60 * 1000) {
        // Allow today to be missing (still in progress), break otherwise
        break
      }
    }
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

function isoOf(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * Whether the current teacher has any reflection (any status, not deleted)
 * for today's date. Drives the in-app reminder banner on /teacher.
 */
export async function hasReflectionToday(): Promise<boolean> {
  const scope = await requireScope()
  if (scope.role !== 'teacher') return true // banner only shows for teachers
  // Use UTC day boundaries — Prisma @db.Date round-trips through UTC.
  const start = new Date()
  start.setUTCHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setUTCDate(end.getUTCDate() + 1)
  const found = await prisma.teacherDailyReflection.findFirst({
    where: {
      teacherUserId: scope.user.id,
      schoolId: scope.schoolId,
      reflectionDate: { gte: start, lt: end },
      deletedAt: null,
    },
    select: { id: true },
  })
  return Boolean(found)
}

/** Top tags this month (used in Director Dashboard). */
export async function getTopTagsThisMonth(limit = 10) {
  const scope = await requireScope()
  if (!can.viewSchoolDashboard(scope)) return []

  const start = new Date()
  start.setDate(1)
  start.setHours(0, 0, 0, 0)

  const rows = await prisma.teacherDailyReflection.findMany({
    where: {
      schoolId: scope.schoolId,
      academicYearId: scope.academicYearId,
      reflectionDate: { gte: start },
      deletedAt: null,
      aiTags: { not: null as never },
    },
    select: { aiTags: true },
  })

  const counts = new Map<string, number>()
  for (const r of rows) {
    const tags = (Array.isArray(r.aiTags) ? r.aiTags : []) as unknown as string[]
    for (const t of tags) {
      if (typeof t !== 'string') continue
      counts.set(t, (counts.get(t) ?? 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }))
}
