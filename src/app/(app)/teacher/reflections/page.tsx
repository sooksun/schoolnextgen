import Link from 'next/link'
import { Plus, NotebookPen } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { ReflectionTimeline } from '@/components/reflection/reflection-timeline'
import { EmptyState } from '@/components/ui-state/empty-state'
import { listMyReflections } from '@/server/reflection/queries'

export const metadata = { title: 'บันทึก Reflection ของฉัน' }

export default async function ReflectionsPage() {
  const items = await listMyReflections({ limit: 50 })
  return (
    <div className="container max-w-4xl mx-auto p-4 sm:p-6 space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">บันทึก Reflection ของฉัน</h1>
          <p className="text-sm text-muted-foreground">{items.length} รายการล่าสุด</p>
        </div>
        <Link href="/teacher/reflections/new" className={buttonVariants()}>
          <Plus /> บันทึกใหม่
        </Link>
      </header>
      {items.length === 0 ? (
        <EmptyState
          icon={<NotebookPen />}
          title="ยังไม่มีบันทึก"
          description="เริ่มจากบันทึกสั้น ๆ หลังสอน — AI ช่วยสรุปต่อให้"
          action={
            <Link href="/teacher/reflections/new" className={buttonVariants()}>
              <Plus /> เริ่มบันทึก
            </Link>
          }
        />
      ) : (
        <ReflectionTimeline items={items} />
      )}
    </div>
  )
}
