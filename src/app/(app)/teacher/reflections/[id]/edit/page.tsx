import { notFound, redirect } from 'next/navigation'
import { ReflectionForm } from '@/components/reflection/reflection-form'
import { getReflectionById } from '@/server/reflection/queries'
import { requireScope } from '@/server/tenant/scope'
import { can } from '@/lib/scope/can'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const r = await getReflectionById(id)
  if (!r) return { title: 'ไม่พบบันทึก' }
  return { title: `แก้ไข — ${r.topic ?? 'Reflection'}` }
}

export default async function EditReflectionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [scope, reflection] = await Promise.all([requireScope(), getReflectionById(id)])

  // Scope-filtered query returns null when reflection is in another school,
  // soft-deleted, or the viewer doesn't have view permission.
  if (!reflection) notFound()

  // Defense-in-depth: server-side permission gate. The detail page hides the
  // edit button when this returns false, but a teacher could still navigate
  // directly. Redirect to the detail view rather than 403 — friendlier.
  if (!can.editReflection(scope, reflection)) {
    redirect(`/teacher/reflections/${id}`)
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 sm:p-6">
      <ReflectionForm
        reflectionId={reflection.id}
        classroomName={reflection.classroom?.name ?? scope.classroomName}
        initial={{
          reflectionDate: reflection.reflectionDate,
          periodNo: reflection.periodNo,
          subject: reflection.subject ?? '',
          topic: reflection.topic ?? '',
          whatHappened: reflection.whatHappened ?? '',
          whatStudentsDid: reflection.whatStudentsDid ?? '',
          successes: reflection.successes ?? '',
          problems: reflection.problems ?? '',
          nextImprovement: reflection.nextImprovement ?? '',
        }}
      />
    </div>
  )
}
