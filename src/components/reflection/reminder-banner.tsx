import Link from 'next/link'
import { Bell, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'

/**
 * Non-dismissable nudge for teachers who haven't logged today.
 *
 * Renders only on weekdays (Mon-Fri) — weekends are a non-school day.
 * Parent passes `show` after checking `hasReflectionToday() === false`.
 */
export function ReminderBanner({ show }: { show: boolean }) {
  if (!show) return null
  const dow = new Date().getDay()
  if (dow === 0 || dow === 6) return null // skip Sat/Sun

  return (
    <Card className="border-amber-300/60 bg-gradient-to-r from-amber-50 via-white to-amber-50 dark:from-amber-950/40 dark:via-slate-950 dark:to-amber-950/40 p-4">
      <div className="flex items-start gap-3">
        <span className="grid place-items-center size-9 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 shrink-0">
          <Bell className="size-5" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">ยังไม่ได้บันทึก Reflection วันนี้</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            บันทึกสั้น ๆ 3-5 นาที — สะสมหลักฐานคุณภาพการสอน
          </p>
        </div>
        <Link
          href="/teacher/reflections/new"
          className={buttonVariants({ size: 'sm' })}
        >
          <Plus /> บันทึกตอนนี้
        </Link>
      </div>
    </Card>
  )
}
