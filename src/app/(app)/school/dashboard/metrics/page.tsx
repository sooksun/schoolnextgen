import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requireScope } from '@/server/tenant/scope'
import { can } from '@/lib/scope/can'
import {
  getDailyErrorRate,
  getMonthlyTokenUsageByAgent,
  getWeeklyAiCost,
  getWeeklySubmissionRate,
} from '@/server/metrics/queries'
import { CostChart } from '@/components/metrics/cost-chart'
import { SubmissionChart } from '@/components/metrics/submission-chart'
import { ErrorChart } from '@/components/metrics/error-chart'
import { AgentUsageChart } from '@/components/metrics/agent-usage-chart'

export const metadata = { title: 'Metrics — Dashboard โรงเรียน' }

// Metrics are time-sensitive; don't cache the page response.
export const dynamic = 'force-dynamic'

export default async function SchoolMetricsPage() {
  const scope = await requireScope()
  // Same gate as the main school dashboard; explicit redirect lets us reuse
  // the existing role list rather than duplicating it here.
  if (!can.viewSchoolDashboard(scope)) redirect('/teacher')

  const [costs, submissions, errors, agentUsage] = await Promise.all([
    getWeeklyAiCost(8),
    getWeeklySubmissionRate(4),
    getDailyErrorRate(7),
    getMonthlyTokenUsageByAgent(),
  ])

  return (
    <div className="container max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <header className="space-y-1">
        <Link
          href="/school/dashboard"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3" /> กลับ Dashboard
        </Link>
        <h1 className="text-2xl font-semibold">
          Metrics{' '}
          <span className="gradient-text">{scope.schoolName}</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          ค่าใช้จ่าย AI · พฤติกรรมการใช้งาน · สุขภาพระบบ — ปี {scope.academicYearLabel}
        </p>
      </header>

      <section className="grid sm:grid-cols-2 gap-3">
        <CostChart data={costs} />
        <SubmissionChart data={submissions} />
        <ErrorChart data={errors} />
        <AgentUsageChart data={agentUsage} />
      </section>

      <footer className="text-[10px] text-muted-foreground border-t pt-3">
        ข้อมูลคำนวณสดจาก <code>ai_run_logs</code> + <code>teacher_daily_reflections</code> ทุกครั้งที่เปิดหน้านี้
        (ไม่ cache). หมายเหตุ: error rate นับเฉพาะ AI run ที่บันทึกไว้, run ที่ไม่ถึง DB (เช่น network drop ก่อน insert) จะไม่ปรากฏ.
      </footer>
    </div>
  )
}
