import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { DailyErrorRow } from '@/server/metrics/queries'

type Props = { data: DailyErrorRow[] }

const formatPct = (n: number) => `${(n * 100).toFixed(1)}%`

export function ErrorChart({ data }: Props) {
  const totalRuns = data.reduce((a, b) => a + b.totalRuns, 0)
  const totalErrors = data.reduce((a, b) => a + b.errorCount, 0)
  const overallRate = totalRuns > 0 ? totalErrors / totalRuns : 0

  if (totalRuns === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>อัตรา error AI</CardDescription>
          <CardTitle className="text-3xl">—</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">ไม่มี AI run ในช่วง {data.length} วันล่าสุด</CardContent>
      </Card>
    )
  }

  // Sparkline as a 7-bar mini chart of daily error counts (or success runs if no errors)
  const showField = totalErrors > 0 ? 'errorCount' : 'totalRuns'
  const max = Math.max(...data.map((d) => d[showField]), 1)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>อัตรา error AI {data.length} วันล่าสุด</CardDescription>
        <CardTitle className={overallRate >= 0.05 ? 'text-3xl text-destructive' : 'text-3xl'}>
          {formatPct(overallRate)}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {totalErrors} error / {totalRuns} runs
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-1 h-16" aria-label={`${showField === 'errorCount' ? 'จำนวน error' : 'จำนวน runs'} ${data.length} วันล่าสุด`}>
          {data.map((d) => {
            const heightPct = (d[showField] / max) * 100
            return (
              <div
                key={d.day}
                className={
                  d.errorCount > 0
                    ? 'flex-1 rounded-t bg-destructive/70 min-w-0'
                    : 'flex-1 rounded-t bg-muted-foreground/30 min-w-0'
                }
                style={{ height: `${Math.max(heightPct, 4)}%` }}
                title={`${d.day}: ${d.errorCount} error / ${d.totalRuns} runs (${formatPct(d.errorRate)})`}
              />
            )
          })}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">
          {showField === 'errorCount' ? 'แถบสีแดง = จำนวน error ต่อวัน' : 'ไม่มี error ในช่วงนี้ (แถบ = จำนวน runs)'}
        </p>
      </CardContent>
    </Card>
  )
}
