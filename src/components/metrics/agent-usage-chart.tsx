import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { AgentUsageRow } from '@/server/metrics/queries'

type Props = { data: AgentUsageRow[] }

const formatTokens = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toLocaleString()
}

const formatUsd = (n: number) => `$${n.toFixed(2)}`

export function AgentUsageChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>การใช้ token ต่อ agent (เดือนนี้)</CardDescription>
          <CardTitle className="text-3xl">—</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">ยังไม่มี agent ที่ถูกเรียกใช้เดือนนี้</CardContent>
      </Card>
    )
  }

  const max = Math.max(...data.map((d) => Math.max(d.tokens, d.budget ?? 0)), 1)
  const totalTokens = data.reduce((a, b) => a + b.tokens, 0)
  const totalCost = data.reduce((a, b) => a + b.cost, 0)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>การใช้ token ต่อ agent (เดือนนี้)</CardDescription>
        <CardTitle className="text-3xl">
          {formatTokens(totalTokens)}
          <span className="text-base text-muted-foreground font-normal ml-1">tokens</span>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          รวม {data.length} agent · {formatUsd(totalCost)}
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {data.map((a) => {
            const tokenPct = (a.tokens / max) * 100
            const budgetPct = a.budget ? (a.budget / max) * 100 : null
            const overBudget = a.budgetUsedPct !== null && a.budgetUsedPct >= 1
            const nearBudget = a.budgetUsedPct !== null && a.budgetUsedPct >= 0.8 && !overBudget
            return (
              <li key={a.agentId} className="space-y-1">
                <div className="flex items-baseline justify-between gap-2 text-xs">
                  <span className="font-medium truncate min-w-0 flex-1" title={a.name}>
                    {a.name}
                  </span>
                  <span className="text-muted-foreground shrink-0 tabular-nums">
                    {formatTokens(a.tokens)}
                    {a.budget ? <span className="opacity-60"> / {formatTokens(a.budget)}</span> : null}
                  </span>
                </div>
                <div className="relative h-2 rounded bg-muted overflow-hidden">
                  {/* Budget marker (if set): a faint outline at the budget threshold */}
                  {budgetPct !== null ? (
                    <div
                      className="absolute inset-y-0 left-0 border-r border-foreground/20"
                      style={{ width: `${budgetPct}%` }}
                      aria-hidden
                    />
                  ) : null}
                  {/* Actual usage bar */}
                  <div
                    className={
                      overBudget
                        ? 'absolute inset-y-0 left-0 bg-destructive'
                        : nearBudget
                          ? 'absolute inset-y-0 left-0 bg-amber-500'
                          : 'absolute inset-y-0 left-0 bg-primary'
                    }
                    style={{ width: `${tokenPct}%` }}
                  />
                </div>
                {a.budgetUsedPct !== null ? (
                  <div className="text-[10px] text-muted-foreground flex gap-1.5">
                    <span>{Math.round(a.budgetUsedPct * 100)}% ของ budget</span>
                    {overBudget ? (
                      <Badge variant="destructive" className="text-[9px] py-0 px-1.5">เกิน budget</Badge>
                    ) : nearBudget ? (
                      <Badge variant="secondary" className="text-[9px] py-0 px-1.5 bg-amber-100 text-amber-900">ใกล้ครบ</Badge>
                    ) : null}
                  </div>
                ) : (
                  <div className="text-[10px] text-muted-foreground">budget ไม่ตั้ง · {a.runs} runs</div>
                )}
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
