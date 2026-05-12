import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatThaiShort } from '@/lib/date/thai'
import type { WeeklyCostRow } from '@/server/metrics/queries'

type Props = { data: WeeklyCostRow[] }

const formatUsd = (n: number) => `$${n.toFixed(2)}`

export function CostChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>ค่าใช้จ่าย AI ต่อสัปดาห์</CardDescription>
          <CardTitle className="text-3xl">$0.00</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">ยังไม่มีข้อมูลการใช้งาน AI</CardContent>
      </Card>
    )
  }

  const current = data[data.length - 1]
  const previous = data.length > 1 ? data[data.length - 2] : undefined
  const max = Math.max(...data.map((d) => d.totalUsd), 0.0001)
  const delta = previous ? current.totalUsd - previous.totalUsd : 0
  const deltaPct = previous && previous.totalUsd > 0 ? (delta / previous.totalUsd) * 100 : null

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>ค่าใช้จ่าย AI สัปดาห์นี้</CardDescription>
        <CardTitle className="text-3xl">{formatUsd(current.totalUsd)}</CardTitle>
        <p className="text-xs text-muted-foreground">
          {previous ? (
            <>
              {delta >= 0 ? '↑' : '↓'} {formatUsd(Math.abs(delta))}
              {deltaPct !== null ? ` (${deltaPct >= 0 ? '+' : ''}${deltaPct.toFixed(0)}%)` : ''} vs สัปดาห์ก่อน
            </>
          ) : (
            <>ยังไม่มีสัปดาห์ก่อนหน้าให้เทียบ</>
          )}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-1.5 h-24" aria-label={`ค่าใช้จ่าย AI ${data.length} สัปดาห์ล่าสุด`}>
          {data.map((d, i) => {
            const heightPct = (d.totalUsd / max) * 100
            const isCurrent = i === data.length - 1
            return (
              <div key={d.weekKey} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                <div
                  className={
                    isCurrent
                      ? 'w-full rounded-t bg-primary'
                      : 'w-full rounded-t bg-primary/40'
                  }
                  style={{ height: `${Math.max(heightPct, 2)}%` }}
                  title={`${formatThaiShort(d.weekStart)}: ${formatUsd(d.totalUsd)} (${d.runCount} runs)`}
                />
                <span className="text-[9px] text-muted-foreground whitespace-nowrap truncate w-full text-center">
                  {formatThaiShort(d.weekStart).replace(/ พ\.ศ\. \d{4}$/, '').replace(/ \d{4}$/, '')}
                </span>
              </div>
            )
          })}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">
          รวม {data.length} สัปดาห์ · ${data.reduce((a, b) => a + b.totalUsd, 0).toFixed(2)}
        </p>
      </CardContent>
    </Card>
  )
}
