import Link from 'next/link'
import { BookOpenText, Calendar, Paperclip, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatThaiShort } from '@/lib/date/thai'

type Props = {
  reflection: {
    id: string
    reflectionDate: Date
    subject: string | null
    topic: string | null
    summaryShort: string | null
    whatHappened: string | null
    aiSummary: string | null
    status: string
    classroom: { id: string; name: string; level: string } | null
    _count: { attachments: number; aiSummaries: number }
  }
}

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  draft:               { label: 'ร่าง',         cls: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' },
  ai_summarized:       { label: 'AI ร่างแล้ว',  cls: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300' },
  teacher_confirmed:   { label: 'ครูยืนยันแล้ว', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
  academic_reviewed:   { label: 'วิชาการตรวจแล้ว', cls: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300' },
  sar_candidate:       { label: 'เข้า SAR',     cls: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300' },
  sar_selected:        { label: 'SAR เลือกแล้ว', cls: 'bg-fuchsia-200 text-fuchsia-800' },
}

export function ReflectionCard({ reflection: r }: Props) {
  const status = STATUS_LABEL[r.status] ?? { label: r.status, cls: '' }
  const summary = r.aiSummary ?? r.summaryShort ?? r.whatHappened ?? ''
  return (
    <Link href={`/teacher/reflections/${r.id}`} className="block group">
      <Card className="p-4 hover:border-primary/40 hover:shadow-sm transition-all">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              <span>{formatThaiShort(r.reflectionDate)}</span>
              {r.classroom ? (
                <>
                  <span>·</span>
                  <span>{r.classroom.name}</span>
                </>
              ) : null}
              {r.subject ? (
                <>
                  <span>·</span>
                  <span>{r.subject}</span>
                </>
              ) : null}
            </div>
            <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
              {r.topic || 'บันทึก Reflection'}
            </h3>
            {summary ? (
              <p className="text-sm text-muted-foreground line-clamp-2">{summary}</p>
            ) : null}
          </div>
          <Badge variant="secondary" className={status.cls}>{status.label}</Badge>
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          {r._count.attachments > 0 ? (
            <span className="inline-flex items-center gap-1">
              <Paperclip className="size-3" /> {r._count.attachments} ไฟล์
            </span>
          ) : null}
          {r._count.aiSummaries > 0 ? (
            <span className="inline-flex items-center gap-1">
              <Sparkles className="size-3" /> AI {r._count.aiSummaries} ครั้ง
            </span>
          ) : null}
          {!r._count.attachments && !r._count.aiSummaries ? (
            <span className="inline-flex items-center gap-1">
              <BookOpenText className="size-3" /> ยังไม่ได้แนบ / สรุป
            </span>
          ) : null}
        </div>
      </Card>
    </Link>
  )
}
