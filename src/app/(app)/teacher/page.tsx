import Link from 'next/link'
import { NotebookPen, Plus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReflectionTimeline } from '@/components/reflection/reflection-timeline'
import { StreakIndicator } from '@/components/reflection/streak-indicator'
import { ReminderBanner } from '@/components/reflection/reminder-banner'
import { EmptyState } from '@/components/ui-state/empty-state'
import {
  listMyReflections,
  getTeacherStreak,
  hasReflectionToday,
} from '@/server/reflection/queries'
import { requireScope } from '@/server/tenant/scope'
import { formatThaiWeekday } from '@/lib/date/thai'

export const metadata = { title: 'หน้าหลักครู — SchoolNextgen' }

export default async function TeacherHome() {
  const scope = await requireScope()
  const [reflections, streak, hasToday] = await Promise.all([
    listMyReflections({ limit: 10 }),
    getTeacherStreak(),
    hasReflectionToday(),
  ])

  return (
    <div className="container max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <header className="space-y-1">
        <p className="text-xs text-muted-foreground">{formatThaiWeekday(new Date())}</p>
        <h1 className="text-2xl font-semibold">สวัสดีค่ะ คุณครู</h1>
        {scope.classroomName ? (
          <p className="text-sm text-muted-foreground">
            ห้อง <span className="text-primary font-medium">{scope.classroomName}</span> · ปี{' '}
            {scope.academicYearLabel}
          </p>
        ) : null}
      </header>

      <ReminderBanner show={!hasToday} />

      <StreakIndicator streak={streak} />

      <Card className="border-primary/20 bg-gradient-to-br from-violet-50/50 via-white to-sky-50/50 dark:from-violet-950/30 dark:via-slate-950 dark:to-sky-950/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base flex items-center gap-2">
            <NotebookPen className="size-4 text-primary" />
            บันทึก Reflection วันนี้
          </CardTitle>
          <Link href="/teacher/reflections/new" className={buttonVariants({ size: 'sm' })}>
            <Plus /> บันทึกใหม่
          </Link>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          กรอกสั้น ๆ 3-5 นาที — ครอบคลุม 5 คำถามหลัก: วันนี้สอนอะไร, นักเรียนเป็นยังไง, สำเร็จอะไร, ปัญหา, จะปรับครั้งต่อไป
        </CardContent>
      </Card>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-2 px-1">บันทึกล่าสุด</h2>
        {reflections.length === 0 ? (
          <EmptyState
            icon={<NotebookPen />}
            title="ยังไม่มีบันทึก Reflection"
            description="เริ่มจากบันทึกสั้น ๆ หลังสอนคาบแรกของวัน — ใช้เวลา 3 นาที AI ช่วยสรุปต่อ"
            action={
              <Link href="/teacher/reflections/new" className={buttonVariants()}>
                <Plus /> บันทึกอันแรก
              </Link>
            }
          />
        ) : (
          <ReflectionTimeline items={reflections} />
        )}
      </section>
    </div>
  )
}
