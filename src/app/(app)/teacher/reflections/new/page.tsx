import { ReflectionForm } from '@/components/reflection/reflection-form'
import { requireScope } from '@/server/tenant/scope'

export const metadata = { title: 'บันทึก Reflection ใหม่' }

export default async function NewReflectionPage() {
  const scope = await requireScope()
  return (
    <div className="container max-w-4xl mx-auto p-4 sm:p-6">
      <ReflectionForm classroomName={scope.classroomName} />
    </div>
  )
}
