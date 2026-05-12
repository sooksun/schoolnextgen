'use client'

import { useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Image as ImageIcon, Loader2, Paperclip, Trash2, Video } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { uploadAttachmentsAction, removeAttachmentAction } from '@/server/evidence/upload'
import { notify } from '@/lib/notify'

type Attachment = {
  id: string
  evidenceFile: {
    id: string
    fileType: string
    fileUrl: string
    title: string | null
    mimeType: string | null
    fileSizeBytes: number | null
  }
}

type Props = {
  reflectionId: string
  attachments: Attachment[]
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

function iconFor(type: string) {
  if (type === 'image') return ImageIcon
  if (type === 'video') return Video
  return FileText
}

export function AttachmentUploader({ reflectionId, attachments }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [pending, startUpload] = useTransition()
  const [removing, startRemove] = useTransition()

  function onPick() {
    inputRef.current?.click()
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    const fd = new FormData()
    fd.append('reflectionId', reflectionId)
    for (const f of Array.from(files)) fd.append('files', f)
    startUpload(async () => {
      const r = await uploadAttachmentsAction(fd)
      if (r.ok) {
        notify.saved(`อัปโหลด ${r.data.count} ไฟล์`)
        router.refresh()
      } else {
        notify.error(r.error)
      }
      if (inputRef.current) inputRef.current.value = ''
    })
  }

  function onRemove(evidenceFileId: string) {
    startRemove(async () => {
      const r = await removeAttachmentAction({ reflectionId, evidenceFileId })
      if (r.ok) {
        notify.deleted('ไฟล์แนบ')
        router.refresh()
      } else {
        notify.error(r.error)
      }
    })
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Paperclip className="size-4" /> หลักฐานประกอบ
          </h3>
          <p className="text-xs text-muted-foreground">รูป / คลิปสั้น / PDF — ไม่แนบก็ได้</p>
        </div>
        <Button size="sm" variant="outline" onClick={onPick} disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Paperclip />}
          เพิ่มไฟล์
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={onChange}
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime,application/pdf,.docx,.xlsx,.pptx"
        />
      </div>
      <p className="text-[11px] text-muted-foreground -mt-1">
        💡 หลีกเลี่ยงการเผยแพร่ข้อมูลส่วนบุคคลของนักเรียนโดยไม่จำเป็น
      </p>
      {attachments.length > 0 ? (
        <ul className="space-y-1.5">
          {attachments.map((a) => {
            const Icon = iconFor(a.evidenceFile.fileType)
            const size = a.evidenceFile.fileSizeBytes ?? 0
            return (
              <li key={a.id} className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-2.5 py-2">
                <Icon className="size-4 text-primary shrink-0" />
                <a
                  href={`/api/uploads/${a.evidenceFile.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm hover:underline truncate flex-1"
                >
                  {a.evidenceFile.title ?? a.evidenceFile.id}
                </a>
                <span className="text-xs text-muted-foreground shrink-0">{formatBytes(size)}</span>{/* size already number */}
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground hover:text-destructive"
                        disabled={removing}
                        aria-label="ลบไฟล์แนบ"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>ลบไฟล์แนบนี้?</AlertDialogTitle>
                      <AlertDialogDescription>
                        ไฟล์จะถูกซ่อนจาก Reflection นี้ทันที (เก็บไว้ในระบบเป็นหลักฐานย้อนหลัง)
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onRemove(a.evidenceFile.id)}>
                        ลบ
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground py-2">ยังไม่มีไฟล์แนบ</p>
      )}
    </Card>
  )
}
