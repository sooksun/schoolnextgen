import { Flame } from 'lucide-react'
import { Card } from '@/components/ui/card'

export function StreakIndicator({ streak }: { streak: number }) {
  if (streak <= 0) {
    return (
      <Card className="p-4 flex items-center gap-3 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <span className="grid place-items-center size-10 rounded-xl bg-muted text-muted-foreground">
          <Flame className="size-5" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">เริ่มบันทึก Reflection วันแรก</p>
          <p className="text-xs text-muted-foreground">บันทึกทุกวันเรียนต่อเนื่องช่วยให้ AI สรุปได้แม่นขึ้น</p>
        </div>
      </Card>
    )
  }
  const trumpet = streak >= 5
  return (
    <Card className="p-4 flex items-center gap-3 border-violet-200/60 bg-gradient-to-br from-violet-50 via-white to-sky-50 dark:from-violet-950/40 dark:via-slate-950 dark:to-sky-950/40">
      <span className="grid place-items-center size-10 rounded-xl bg-primary/15 text-primary">
        <Flame className="size-5" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">
          บันทึกต่อเนื่อง {streak} วันทำการ {trumpet ? '✨' : ''}
        </p>
        <p className="text-xs text-muted-foreground">เก่งมาก ทำต่อไป — หลักฐาน SAR ค่อย ๆ ก่อตัวเอง</p>
      </div>
    </Card>
  )
}
