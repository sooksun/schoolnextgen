import { ReflectionCard } from './reflection-card'
import type { ReflectionListItem } from '@/server/reflection/queries'
import { formatThaiWeekday } from '@/lib/date/thai'

function groupByDate(items: ReflectionListItem[]) {
  const groups = new Map<string, { label: string; items: ReflectionListItem[] }>()
  for (const r of items) {
    const key = `${r.reflectionDate.getFullYear()}-${r.reflectionDate.getMonth()}-${r.reflectionDate.getDate()}`
    if (!groups.has(key)) {
      groups.set(key, { label: formatThaiWeekday(r.reflectionDate), items: [] })
    }
    groups.get(key)!.items.push(r)
  }
  return Array.from(groups.values())
}

export function ReflectionTimeline({ items }: { items: ReflectionListItem[] }) {
  const groups = groupByDate(items)
  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <div key={g.label} className="space-y-2">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
            {g.label}
          </h2>
          <div className="space-y-2">
            {g.items.map((r) => (
              <ReflectionCard key={r.id} reflection={r} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
