'use client'

import { AlertCircle, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <AlertCircle className="size-12 text-destructive" />
      <h2 className="text-xl font-semibold">เกิดข้อผิดพลาด</h2>
      <p className="max-w-md text-sm text-muted-foreground">{error.message || 'ไม่ทราบสาเหตุ'}</p>
      <Button variant="outline" onClick={reset}>
        <RotateCw /> ลองอีกครั้ง
      </Button>
    </div>
  )
}
