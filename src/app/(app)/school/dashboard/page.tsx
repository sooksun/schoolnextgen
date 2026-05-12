import { redirect } from 'next/navigation'
import { BookOpenText, Hash, NotebookPen, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { requireScope } from '@/server/tenant/scope'
import { can } from '@/lib/scope/can'
import {
  countReflectionsByStatus,
  getTopTagsThisMonth,
  listTodayReflections,
} from '@/server/reflection/queries'
import { formatThaiShort, formatThaiWeekday } from '@/lib/date/thai'

export const metadata = { title: 'Dashboard โรงเรียน' }

export default async function SchoolDashboardPage() {
  const scope = await requireScope()
  if (!can.viewSchoolDashboard(scope)) redirect('/teacher')

  const [byStatus, todays, topTags] = await Promise.all([
    countReflectionsByStatus(scope),
    listTodayReflections(),
    getTopTagsThisMonth(12),
  ])

  const total = Object.values(byStatus).reduce((a, b) => a + b, 0)
  const confirmed =
    (byStatus['teacher_confirmed'] ?? 0) +
    (byStatus['academic_reviewed'] ?? 0) +
    (byStatus['sar_candidate'] ?? 0) +
    (byStatus['sar_selected'] ?? 0) +
    (byStatus['sar_exported'] ?? 0)

  return (
    <div className="container max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <header className="space-y-1">
        <p className="text-xs text-muted-foreground">{formatThaiWeekday(new Date())}</p>
        <h1 className="text-2xl font-semibold">
          ภาพรวม{' '}
          <span className="gradient-text">{scope.schoolName}</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          ปี {scope.academicYearLabel}
          {scope.academicTermName ? ` · ${scope.academicTermName}` : ''}
        </p>
      </header>

      <section className="grid sm:grid-cols-3 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>บันทึกวันนี้</CardDescription>
            <CardTitle className="text-3xl">
              {todays.length}
              <span className="text-base text-muted-foreground font-normal ml-1">รายการ</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-xs text-muted-foreground">
            <NotebookPen className="size-3.5" />
            จากครู {new Set(todays.map((t) => t.teacherUserId)).size} คน
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>บันทึกภาคนี้</CardDescription>
            <CardTitle className="text-3xl">
              {total}
              <span className="text-base text-muted-foreground font-normal ml-1">รายการ</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-x-1.5">
            <span>ครูยืนยันแล้ว {confirmed}</span>
            <span>·</span>
            <span>ร่าง {(byStatus['draft'] ?? 0) + (byStatus['ai_summarized'] ?? 0)}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tag เด่นเดือนนี้</CardDescription>
            <CardTitle className="text-3xl">
              {topTags.length}
              <span className="text-base text-muted-foreground font-normal ml-1">หมวด</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1">
            {topTags.length === 0 ? (
              <span className="text-xs text-muted-foreground">ยังไม่มีข้อมูล tag</span>
            ) : (
              topTags.slice(0, 6).map(({ tag, count }) => (
                <Badge key={tag} variant="secondary" className="text-[10px]">
                  {tag} <span className="ml-1 opacity-60">{count}</span>
                </Badge>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-2 px-1 flex items-center gap-2">
          <Users className="size-3.5" /> ครูที่บันทึกวันนี้
        </h2>
        {todays.length === 0 ? (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            <BookOpenText className="size-8 mx-auto mb-2 opacity-50" />
            ยังไม่มีครูบันทึก Reflection วันนี้
          </Card>
        ) : (
          <Card>
            <ul className="divide-y divide-border">
              {todays.map((r) => (
                <li key={r.id} className="flex items-start gap-3 p-3">
                  <span className="grid place-items-center size-9 rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0">
                    {(r.teacherPerson?.displayName ?? r.teacherUser.email).slice(0, 1)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {r.teacherPerson?.displayName ?? r.teacherUser.email}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {r.classroom?.name ?? '—'}
                      {r.subject ? ` · ${r.subject}` : ''}
                      {r.topic ? ` · ${r.topic}` : ''}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatThaiShort(r.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>

      {topTags.length > 0 ? (
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-2 px-1 flex items-center gap-2">
            <Hash className="size-3.5" /> Tag cloud เดือนนี้
          </h2>
          <Card className="p-4 flex flex-wrap gap-1.5">
            {topTags.map(({ tag, count }) => {
              const size = Math.min(count, 10)
              return (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-primary/5 text-foreground"
                  style={{ fontSize: `${0.75 + size * 0.04}rem` }}
                >
                  {tag} <span className="ml-1 text-primary">{count}</span>
                </Badge>
              )
            })}
          </Card>
        </section>
      ) : null}
    </div>
  )
}
