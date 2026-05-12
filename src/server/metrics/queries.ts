import 'server-only'
import { prisma } from '@/lib/db'
import { requireScope } from '@/server/tenant/scope'
import { can } from '@/lib/scope/can'

// ── Date bucket helpers (UTC week, Monday start) ──────────────────
// Aggregation is done in JS rather than SQL because MariaDB lacks a
// portable date_trunc and we need year-boundary safety. For pilot
// volume (≪10k rows / month) this is fine; switch to a $queryRaw with
// YEARWEEK if it ever shows up in slow query log.

/** UTC midnight of the Monday of d's ISO week. */
function weekStartUTC(d: Date): Date {
  const out = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  const dow = out.getUTCDay() || 7 // Sun=7
  out.setUTCDate(out.getUTCDate() - (dow - 1))
  return out
}

function weekKey(d: Date): string {
  return weekStartUTC(d).toISOString().slice(0, 10)
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

// ── 1. Weekly AI cost ─────────────────────────────────────────────

export type WeeklyCostRow = {
  weekKey: string
  weekStart: Date
  totalUsd: number
  runCount: number
}

/** Cost (USD) per ISO week, oldest → newest. Empty weeks included. */
export async function getWeeklyAiCost(weeks = 8): Promise<WeeklyCostRow[]> {
  const scope = await requireScope()
  if (!can.viewSchoolDashboard(scope)) return []

  const now = new Date()
  const earliest = weekStartUTC(now)
  earliest.setUTCDate(earliest.getUTCDate() - (weeks - 1) * 7)

  const rows = await prisma.aiRunLog.findMany({
    where: {
      schoolId: scope.schoolId,
      createdAt: { gte: earliest },
      status: 'success',
    },
    select: { createdAt: true, costUsd: true },
  })

  const buckets = new Map<string, WeeklyCostRow>()
  for (const r of rows) {
    const key = weekKey(r.createdAt)
    const b = buckets.get(key) ?? {
      weekKey: key,
      weekStart: weekStartUTC(r.createdAt),
      totalUsd: 0,
      runCount: 0,
    }
    b.totalUsd += Number(r.costUsd ?? 0)
    b.runCount += 1
    buckets.set(key, b)
  }

  // Fill empty weeks chronologically
  const out: WeeklyCostRow[] = []
  const cursor = new Date(earliest)
  while (cursor <= now) {
    const key = dayKey(cursor)
    out.push(
      buckets.get(key) ?? {
        weekKey: key,
        weekStart: new Date(cursor),
        totalUsd: 0,
        runCount: 0,
      },
    )
    cursor.setUTCDate(cursor.getUTCDate() + 7)
  }
  return out
}

// ── 2. Weekly submission rate ─────────────────────────────────────

export type WeeklySubmissionRow = {
  weekKey: string
  weekStart: Date
  activeTeachers: number
  totalTeachers: number
  rate: number // 0..1
}

/**
 * Percentage of active teachers who wrote ≥1 reflection that week,
 * oldest → newest. Denominator is total active teachers in scope's
 * school+year (membership.role.code='teacher').
 */
export async function getWeeklySubmissionRate(weeks = 4): Promise<WeeklySubmissionRow[]> {
  const scope = await requireScope()
  if (!can.viewSchoolDashboard(scope)) return []

  const totalTeachers = await prisma.userSchoolMembership.count({
    where: {
      schoolId: scope.schoolId,
      academicYearId: scope.academicYearId,
      status: 'active',
      role: { code: 'teacher' },
    },
  })
  if (totalTeachers === 0) return []

  const now = new Date()
  const earliest = weekStartUTC(now)
  earliest.setUTCDate(earliest.getUTCDate() - (weeks - 1) * 7)

  const rows = await prisma.teacherDailyReflection.findMany({
    where: {
      schoolId: scope.schoolId,
      academicYearId: scope.academicYearId,
      reflectionDate: { gte: earliest },
      deletedAt: null,
    },
    select: { teacherUserId: true, reflectionDate: true },
  })

  const buckets = new Map<string, { weekStart: Date; teachers: Set<string> }>()
  for (const r of rows) {
    const key = weekKey(r.reflectionDate)
    const b = buckets.get(key) ?? { weekStart: weekStartUTC(r.reflectionDate), teachers: new Set<string>() }
    b.teachers.add(r.teacherUserId)
    buckets.set(key, b)
  }

  const out: WeeklySubmissionRow[] = []
  const cursor = new Date(earliest)
  while (cursor <= now) {
    const key = dayKey(cursor)
    const b = buckets.get(key)
    const active = b?.teachers.size ?? 0
    out.push({
      weekKey: key,
      weekStart: b?.weekStart ?? new Date(cursor),
      activeTeachers: active,
      totalTeachers,
      rate: active / totalTeachers,
    })
    cursor.setUTCDate(cursor.getUTCDate() + 7)
  }
  return out
}

// ── 3. Daily error rate ───────────────────────────────────────────

export type DailyErrorRow = {
  day: string
  totalRuns: number
  errorCount: number
  errorRate: number // 0..1
}

/**
 * AI error rate per day, oldest → newest. Days with zero runs have
 * rate=0 (not NaN) so the sparkline can render cleanly.
 */
export async function getDailyErrorRate(days = 7): Promise<DailyErrorRow[]> {
  const scope = await requireScope()
  if (!can.viewSchoolDashboard(scope)) return []

  const now = new Date()
  const earliest = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  earliest.setUTCDate(earliest.getUTCDate() - (days - 1))

  const rows = await prisma.aiRunLog.findMany({
    where: { schoolId: scope.schoolId, createdAt: { gte: earliest } },
    select: { createdAt: true, status: true },
  })

  const buckets = new Map<string, { total: number; errors: number }>()
  for (const r of rows) {
    const key = dayKey(r.createdAt)
    const b = buckets.get(key) ?? { total: 0, errors: 0 }
    b.total += 1
    if (r.status === 'error') b.errors += 1
    buckets.set(key, b)
  }

  const out: DailyErrorRow[] = []
  const cursor = new Date(earliest)
  while (cursor <= now) {
    const key = dayKey(cursor)
    const b = buckets.get(key) ?? { total: 0, errors: 0 }
    out.push({
      day: key,
      totalRuns: b.total,
      errorCount: b.errors,
      errorRate: b.total > 0 ? b.errors / b.total : 0,
    })
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return out
}

// ── 4. Monthly token usage by agent ───────────────────────────────

export type AgentUsageRow = {
  agentId: string
  name: string
  agentType: string
  modelName: string
  tokens: number
  cost: number
  runs: number
  budget: number | null
  budgetUsedPct: number | null // 0..1
}

/**
 * Token+cost usage per agent for the current calendar month (UTC),
 * sorted by tokens desc. Only successful runs count toward budget —
 * errors don't burn the school's quota.
 */
export async function getMonthlyTokenUsageByAgent(): Promise<AgentUsageRow[]> {
  const scope = await requireScope()
  if (!can.viewSchoolDashboard(scope)) return []

  const monthStart = new Date()
  monthStart.setUTCDate(1)
  monthStart.setUTCHours(0, 0, 0, 0)

  const usage = await prisma.aiRunLog.groupBy({
    by: ['agentId'],
    where: {
      schoolId: scope.schoolId,
      createdAt: { gte: monthStart },
      status: 'success',
    },
    _sum: { totalTokens: true, costUsd: true },
    _count: { _all: true },
  })
  if (usage.length === 0) return []

  const agents = await prisma.agent.findMany({
    where: { id: { in: usage.map((u) => u.agentId) } },
    select: {
      id: true,
      name: true,
      agentType: true,
      modelName: true,
      monthlyTokenBudget: true,
    },
  })
  const byId = new Map(agents.map((a) => [a.id, a]))

  return usage
    .map<AgentUsageRow | null>((u) => {
      const a = byId.get(u.agentId)
      if (!a) return null
      const tokens = u._sum.totalTokens ?? 0
      const cost = Number(u._sum.costUsd ?? 0)
      // BigInt → Number is safe for budgets (max few million tokens).
      const budget = a.monthlyTokenBudget == null ? null : Number(a.monthlyTokenBudget)
      return {
        agentId: a.id,
        name: a.name,
        agentType: a.agentType,
        modelName: a.modelName,
        tokens,
        cost,
        runs: u._count._all,
        budget,
        budgetUsedPct: budget && budget > 0 ? tokens / budget : null,
      }
    })
    .filter((x): x is AgentUsageRow => x !== null)
    .sort((a, b) => b.tokens - a.tokens)
}
