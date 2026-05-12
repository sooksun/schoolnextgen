'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { readStreamableValue } from '@ai-sdk/rsc'
import { Check, Loader2, Plus, RotateCw, Sparkles, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { summarizeReflectionAction } from '@/server/reflection/summarize'
import { confirmAiSummaryAction } from '@/server/reflection/actions'
import { notify } from '@/lib/notify'

type Props = {
  reflectionId: string
  initialSummary: string | null
  initialTags: string[] | null
  status: string
}

const CONFIRMED_STATUSES = new Set([
  'teacher_confirmed',
  'academic_reviewed',
  'sar_candidate',
  'sar_selected',
  'sar_exported',
])

const MAX_TAG_LEN = 40
const MAX_TAGS = 12

export function AiSummaryPanel({ reflectionId, initialSummary, initialTags, status }: Props) {
  const router = useRouter()
  const [summary, setSummary] = useState(initialSummary ?? '')
  const [tags, setTags] = useState<string[]>(initialTags ?? [])
  const [newTag, setNewTag] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [confirming, startConfirm] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const confirmed = CONFIRMED_STATUSES.has(status)

  // Sync local state from server props whenever they change (e.g., after a
  // successful summarize action triggers router.refresh() and the parent
  // re-renders with new initialTags/initialSummary). We skip sync while
  // streaming to avoid clobbering the live token stream.
  const lastSyncedSummary = useRef(initialSummary)
  const lastSyncedTags = useRef(initialTags)
  useEffect(() => {
    if (streaming) return
    if (lastSyncedSummary.current !== initialSummary) {
      setSummary(initialSummary ?? '')
      lastSyncedSummary.current = initialSummary
    }
    if (lastSyncedTags.current !== initialTags) {
      setTags(initialTags ?? [])
      lastSyncedTags.current = initialTags
    }
  }, [initialSummary, initialTags, streaming])

  function addTag() {
    const t = newTag.trim()
    if (!t) return
    if (t.length > MAX_TAG_LEN) {
      notify.warning(`tag ยาวเกิน ${MAX_TAG_LEN} ตัวอักษร`)
      return
    }
    if (tags.includes(t)) {
      notify.info('มี tag นี้แล้ว')
      setNewTag('')
      return
    }
    if (tags.length >= MAX_TAGS) {
      notify.warning(`เพิ่ม tag ได้สูงสุด ${MAX_TAGS} รายการ`)
      return
    }
    setTags([...tags, t])
    setNewTag('')
  }

  function removeTag(t: string) {
    setTags(tags.filter((x) => x !== t))
  }

  function onTagInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  async function run() {
    setStreaming(true)
    setError(null)
    setSummary('')
    setTags([])
    try {
      const { output } = await summarizeReflectionAction(reflectionId)
      for await (const partial of readStreamableValue(output)) {
        if (typeof partial === 'string') setSummary(partial)
      }
      router.refresh()
      notify.saved('AI ร่างสรุป')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'AI ขัดข้อง'
      setError(msg)
      notify.error(msg)
    } finally {
      setStreaming(false)
    }
  }

  function confirm() {
    startConfirm(async () => {
      const r = await confirmAiSummaryAction({ id: reflectionId, summary, tags })
      if (r.ok) {
        notify.saved('ยืนยัน Reflection')
        router.refresh()
      } else {
        notify.error(r.error)
      }
    })
  }

  return (
    <Card className="border-violet-200 dark:border-violet-900/50 bg-violet-50/30 dark:bg-violet-950/20">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4 text-primary" /> AI ช่วยสรุป
          </CardTitle>
          <CardDescription>
            {confirmed
              ? 'ครูยืนยันสรุปนี้แล้ว'
              : 'ร่างโดย AI ผู้ช่วยครูประจำชั้น — ครูตรวจ แก้ tag ได้ ก่อนกดยืนยัน'}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {!summary && !streaming ? (
            <Button size="sm" onClick={run} disabled={streaming}>
              <Sparkles /> สรุปอัตโนมัติ
            </Button>
          ) : null}
          {summary && !streaming && !confirmed ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={run}
              aria-label="สรุปใหม่"
              title="สรุปใหม่"
            >
              <RotateCw />
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {streaming && !summary ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <Loader2 className="animate-spin size-4" /> AI กำลังสรุป...
          </div>
        ) : null}
        {summary ? (
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed">
            {summary}
          </div>
        ) : !streaming ? (
          <p className="text-sm text-muted-foreground py-2">
            ยังไม่มี AI สรุป กดปุ่ม &quot;สรุปอัตโนมัติ&quot; เพื่อเริ่ม
          </p>
        ) : null}

        {/* Tag editor — visible only when there's something to manage and not yet confirmed */}
        {(tags.length > 0 || (summary && !confirmed)) ? (
          <div className="space-y-2 pt-1">
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 pl-2 pr-1 py-0.5 gap-1"
                >
                  <span>{t}</span>
                  {!confirmed ? (
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      aria-label={`ลบ tag ${t}`}
                      className="rounded-full hover:bg-primary/20 p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <X className="size-3" />
                    </button>
                  ) : null}
                </Badge>
              ))}
              {tags.length === 0 ? (
                <span className="text-xs text-muted-foreground">ยังไม่มี tag</span>
              ) : null}
            </div>

            {!confirmed ? (
              <div className="flex items-center gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={onTagInputKey}
                  placeholder="เพิ่ม tag เอง (กด Enter)"
                  aria-label="เพิ่ม tag"
                  maxLength={MAX_TAG_LEN}
                  className="h-8 text-sm"
                  disabled={confirming}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addTag}
                  disabled={!newTag.trim() || confirming}
                  aria-label="เพิ่ม tag"
                >
                  <Plus />
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}

        {error ? <p className="text-xs text-destructive">{error}</p> : null}

        {summary && !streaming && !confirmed ? (
          <div className="flex justify-end pt-1">
            <Button size="sm" onClick={confirm} disabled={confirming}>
              {confirming ? <Loader2 className="animate-spin" /> : <Check />}
              ยืนยันบันทึก
            </Button>
          </div>
        ) : null}
        {confirmed ? (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Check className="size-3" /> ครูยืนยันสรุปนี้แล้ว
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
