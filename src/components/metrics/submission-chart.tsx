import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatThaiShort } from '@/lib/date/thai'
import type { WeeklySubmissionRow } from '@/server/metrics/queries'

type Props = { data: WeeklySubmissionRow[] }

const formatPct = (n: number) => `${Math.round(n * 100)}%`

export function SubmissionChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>% ครูเขียน Reflection</CardDescription>
          <CardTitle className="text-3xl">—</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">ยังไม่มีครูในระบบ</CardContent>
      </Card>
    )
  }

  const current = data[data.length - 1]
  const totalTeachers = current.totalTeachers

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>% ครูเขียน Reflection สัปดาห์นี้</CardDescription>
        <CardTitle className="text-3xl">{formatPct(current.rate)}</CardTitle>
        <p className="text-xs text-muted-foreground">
          {current.activeTeachers} / {totalTeachers} คน
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 h-24" aria-label={`% ครู ${data.length} สัปดาห์ล่าสุด`}>
          {data.map((d, i) => {
            const heightPct = d.rate * 100
            const isCurrent = i === data.length - 1
            return (
              <div key={d.weekKey} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                <div className="w-full bg-muted rounded-t relative h-full flex flex-col-reverse">
                  <div
                    className={isCurrent ? 'rounded-t bg-primary' : 'rounded-t bg-primary/40'}
                    style={{ height: `${Math.max(heightPct, 2)}%` }}
                    title={`${formatThaiShort(d.weekStart)}: ${d.activeTeachers}/${d.totalTeachers} (${formatPct(d.rate)})`}
                  />
                </div>
                <span className="text-[9px] text-muted-foreground whitespace-nowrap truncate w-full text-center">
                  {formatThaiShort(d.weekStart).replace(/ พ\.ศ\. \d{4}$/, '').replace(/ \d{4}$/, '')}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
