import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Pencil } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AiSummaryPanel } from '@/components/reflection/ai-summary-panel'
import { AttachmentUploader } from '@/components/reflection/attachment-uploader'
import { getReflectionById } from '@/server/reflection/queries'
import { requireScope } from '@/server/tenant/scope'
import { can } from '@/lib/scope/can'
import { formatThaiWeekday } from '@/lib/date/thai'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const r = await getReflectionById(id)
  if (!r) return { title: 'ไม่พบบันทึก' }
  return { title: `${r.topic ?? 'Reflection'} — ${formatThaiWeekday(r.reflectionDate)}` }
}

const FIELDS: Array<{ key: string; label: string }> = [
  { key: 'whatHappened',    label: 'วันนี้จัดการเรียนรู้อะไร' },
  { key: 'whatStudentsDid', label: 'นักเรียนเรียนรู้ / แสดงพฤติกรรมอย่างไร' },
  { key: 'successes',       label: 'สิ่งที่สำเร็จ' },
  { key: 'problems',        label: 'ปัญหาที่พบ' },
  { key: 'nextImprovement', label: 'จะปรับปรุงครั้งต่อไป' },
]

export default async function ReflectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [scope, r] = await Promise.all([requireScope(), getReflectionById(id)])
  if (!r) notFound()

  const tags = (Array.isArray(r.aiTags) ? r.aiTags : []) as unknown as string[]
  const canEdit = can.editReflection(scope, r)

  return (
    <div className="container max-w-4xl mx-auto p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <Link href="/teacher/reflections" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
          <ArrowLeft /> กลับ
        </Link>
        {canEdit ? (
          <Link
            href={`/teacher/reflections/${r.id}/edit`}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            <Pencil /> แก้ไข
          </Link>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              {formatThaiWeekday(r.reflectionDate)}
              {r.periodNo ? <span>· คาบ {r.periodNo}</span> : null}
              {r.classroom ? <span>· {r.classroom.name}</span> : null}
              {r.subject ? <span>· {r.subject}</span> : null}
            </div>
            <CardTitle className="text-xl">{r.topic ?? 'บันทึก Reflection'}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {FIELDS.map((f) => {
            const v = (r as unknown as Record<string, string | null>)[f.key]
            if (!v) return null
            return (
              <div key={f.key}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {f.label}
                </h3>
                <p className="mt-1 text-sm whitespace-pre-wrap leading-relaxed">{v}</p>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <AiSummaryPanel
        reflectionId={r.id}
        initialSummary={r.aiSummary}
        initialTags={tags}
        status={r.status}
      />

      <AttachmentUploader reflectionId={r.id} attachments={r.attachments} />

      {tags.length > 0 ? (
        <Card className="p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Tags
          </h3>
          <Separator className="my-2" />
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  )
}
