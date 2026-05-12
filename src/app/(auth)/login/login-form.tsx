'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, LogIn } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInAction } from '@/server/auth/actions'
import { notify } from '@/lib/notify'

export function LoginForm() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(signInAction, null)

  useEffect(() => {
    if (!state) return
    if (state.ok) {
      notify.saved('เข้าสู่ระบบ')
      router.push(state.data.redirectTo)
      router.refresh()
    } else {
      notify.error(state.error)
    }
  }, [state, router])

  return (
    <Card className="w-full max-w-md border-border/60 shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">
          <span className="gradient-text">SchoolNextgen</span>
        </CardTitle>
        <CardDescription>เข้าสู่ระบบเพื่อใช้งานศูนย์บัญชาการผู้ช่วยครู AI</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">อีเมล</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="teacher@demo.local"
              disabled={pending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">รหัสผ่าน</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={pending}
            />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="animate-spin" /> กำลังเข้าสู่ระบบ…
              </>
            ) : (
              <>
                <LogIn /> เข้าสู่ระบบ
              </>
            )}
          </Button>
        </form>
        {state && !state.ok ? (
          <p className="mt-4 text-sm text-destructive text-center">{state.error}</p>
        ) : null}
        <p className="mt-6 text-xs text-center text-muted-foreground">
          ทดลอง: <code className="font-mono">teacher@demo.local</code> /{' '}
          <code className="font-mono">Pass1234!</code>
        </p>
      </CardContent>
    </Card>
  )
}
