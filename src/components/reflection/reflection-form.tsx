'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ThaiDatePicker } from '@/components/ui-thai/thai-date-picker'
import { createReflectionAction, updateReflectionAction } from '@/server/reflection/actions'
import { notify } from '@/lib/notify'
import { toIsoDate } from '@/lib/date/thai'

type Initial = {
  reflectionDate?: Date | null
  periodNo?: number | null
  subject?: string
  topic?: string
  whatHappened?: string
  whatStudentsDid?: string
  successes?: string
  problems?: string
  nextImprovement?: string
}

type Props = {
  /** Present = edit mode (calls updateReflectionAction). Absent = create mode. */
  reflectionId?: string
  initial?: Initial
  classroomName?: string | null
}

export function ReflectionForm({ reflectionId, initial, classroomName }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const isEdit = Boolean(reflectionId)

  const [reflectionDate, setReflectionDate] = useState<Date | null>(initial?.reflectionDate ?? new Date())
  const [periodNo, setPeriodNo] = useState<string>(initial?.periodNo ? String(initial.periodNo) : '')
  const [subject, setSubject] = useState(initial?.subject ?? '')
  const [topic, setTopic] = useState(initial?.topic ?? '')
  const [whatHappened, setWhatHappened] = useState(initial?.whatHappened ?? '')
  const [whatStudentsDid, setWhatStudentsDid] = useState(initial?.whatStudentsDid ?? '')
  const [successes, setSuccesses] = useState(initial?.successes ?? '')
  const [problems, setProblems] = useState(initial?.problems ?? '')
  const [nextImprovement, setNextImprovement] = useState(initial?.nextImprovement ?? '')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!reflectionDate) {
      notify.error('กรุณาเลือกวันที่')
      return
    }
    startTransition(async () => {
      const payload = {
        reflectionDate: toIsoDate(reflectionDate),
        periodNo: periodNo ? Number(periodNo) : null,
        subject: subject || null,
        topic: topic || null,
        whatHappened: whatHappened || null,
        whatStudentsDid: whatStudentsDid || null,
        successes: successes || null,
        problems: problems || null,
        nextImprovement: nextImprovement || null,
      }

      const result = isEdit
        ? await updateReflectionAction({ id: reflectionId!, ...payload })
        : await createReflectionAction(payload)

      if (result.ok) {
        if (isEdit) {
          notify.updated('Reflection')
        } else {
          notify.saved('Reflection')
        }
        router.push(`/teacher/reflections/${result.data.id}`)
        router.refresh()
      } else {
        notify.error(result.error)
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'แก้ไข Reflection' : 'บันทึก Reflection รายวัน'}</CardTitle>
          <CardDescription>
            {isEdit
              ? 'แก้รายละเอียดได้ตามต้องการ — กดบันทึกเมื่อเสร็จ'
              : 'กรอกสั้น ๆ ใช้เวลา 3-5 นาที ครอบคลุม 5 คำถามหลัก'}
            {classroomName ? <> · ห้อง <span className="text-primary font-medium">{classroomName}</span></> : null}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Label htmlFor="reflectionDate">วันที่สอน *</Label>
              <ThaiDatePicker
                id="reflectionDate"
                value={reflectionDate}
                onChange={setReflectionDate}
                maxDate={new Date()}
                disabled={pending}
              />
            </div>
            <div>
              <Label htmlFor="periodNo">คาบที่</Label>
              <Input
                id="periodNo"
                type="number"
                min={1}
                max={12}
                inputMode="numeric"
                placeholder="-"
                value={periodNo}
                onChange={(e) => setPeriodNo(e.target.value)}
                disabled={pending}
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="subject">รายวิชา / กิจกรรม</Label>
              <Input
                id="subject"
                placeholder="เช่น ภาษาไทย"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={pending}
              />
            </div>
            <div>
              <Label htmlFor="topic">หัวข้อ / หน่วยการเรียนรู้</Label>
              <Input
                id="topic"
                placeholder="เช่น คำควบกล้ำ"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={pending}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">รายละเอียดการเรียนรู้</CardTitle>
          <CardDescription>เลือกกรอกอย่างน้อย 1 ช่อง</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="whatHappened">วันนี้จัดการเรียนรู้อะไร</Label>
            <Textarea
              id="whatHappened"
              rows={3}
              value={whatHappened}
              onChange={(e) => setWhatHappened(e.target.value)}
              disabled={pending}
            />
          </div>
          <div>
            <Label htmlFor="whatStudentsDid">นักเรียนเรียนรู้ / แสดงพฤติกรรมอย่างไร</Label>
            <Textarea
              id="whatStudentsDid"
              rows={3}
              value={whatStudentsDid}
              onChange={(e) => setWhatStudentsDid(e.target.value)}
              disabled={pending}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="successes">สิ่งที่สำเร็จ</Label>
              <Textarea
                id="successes"
                rows={3}
                value={successes}
                onChange={(e) => setSuccesses(e.target.value)}
                disabled={pending}
              />
            </div>
            <div>
              <Label htmlFor="problems">ปัญหาที่พบ</Label>
              <Textarea
                id="problems"
                rows={3}
                value={problems}
                onChange={(e) => setProblems(e.target.value)}
                disabled={pending}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="nextImprovement">จะปรับปรุงครั้งต่อไป</Label>
            <Textarea
              id="nextImprovement"
              rows={3}
              value={nextImprovement}
              onChange={(e) => setNextImprovement(e.target.value)}
              disabled={pending}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 sticky bottom-0 py-3 bg-background/90 backdrop-blur">
        <Button type="button" variant="ghost" onClick={() => router.back()} disabled={pending}>
          ยกเลิก
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Save />}
          {isEdit ? 'บันทึกการแก้ไข' : 'บันทึก Reflection'}
        </Button>
      </div>
    </form>
  )
}
