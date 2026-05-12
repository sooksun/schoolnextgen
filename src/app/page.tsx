import { redirect } from 'next/navigation'
import { validateRequest } from '@/server/auth/validate-request'

export default async function Home() {
  const { user } = await validateRequest()
  if (!user) redirect('/login')
  redirect('/teacher')
}
