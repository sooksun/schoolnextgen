'use client'

import { toast, type Id } from 'react-toastify'

/**
 * Client-side notification helpers. Pair with server action results:
 *
 *   const result = await someAction(input)
 *   if (result.ok) notify.saved('Reflection')
 *   else           notify.error(result.error)
 */
export const notify = {
  saved: (label = 'บันทึก'): Id => toast.success(`${label}สำเร็จ`),
  updated: (label = 'รายการ'): Id => toast.success(`อัปเดต${label}สำเร็จ`),
  deleted: (label = 'รายการ'): Id => toast.success(`ลบ${label}สำเร็จ`),
  info: (msg: string): Id => toast.info(msg),
  warning: (msg: string): Id => toast.warning(msg),
  error: (e: unknown, fallback = 'เกิดข้อผิดพลาด'): Id => {
    const msg =
      typeof e === 'string'
        ? e
        : e instanceof Error
        ? e.message
        : fallback
    return toast.error(msg)
  },
  promise: <T>(p: Promise<T>, msgs: { pending: string; success: string; error: string }) =>
    toast.promise(p, msgs),
  dismiss: (id?: Id) => toast.dismiss(id),
}
