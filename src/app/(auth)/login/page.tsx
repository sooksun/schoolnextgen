import { redirect } from 'next/navigation'
import { validateRequest } from '@/server/auth/validate-request'
import { LoginForm } from './login-form'

export const metadata = {
  title: 'เข้าสู่ระบบ — SchoolNextgen',
}

export default async function LoginPage() {
  const { user } = await validateRequest()
  if (user) redirect('/teacher')
  return <LoginForm />
}
