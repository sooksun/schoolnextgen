import 'server-only'
import { getResend, getEmailFrom } from './resend-client'

export type ReminderEmailInput = {
  to: string
  teacherName: string | null
  schoolName: string
  /** Absolute base URL — env.PUBLIC_APP_URL */
  appUrl: string
}

export type SendResult =
  | { sent: true; id: string }
  | { sent: false; dryRun: true; reason: 'no_api_key' }
  | { sent: false; dryRun: false; reason: string }

/**
 * Send a Thai-language reminder email to a teacher who hasn't logged
 * today's Reflection.
 *
 * - Opt-in: when RESEND_API_KEY is unset → dry-run (returns
 *   { sent: false, dryRun: true }) so the cron can count and log without
 *   raising errors.
 * - Never throws — callers don't need a try/catch. Failures return
 *   { sent: false, dryRun: false, reason }.
 * - No PII in the subject; teacher name in body is optional.
 * - No student data referenced.
 */
export async function sendReminderEmail(input: ReminderEmailInput): Promise<SendResult> {
  const resend = getResend()
  if (!resend) {
    return { sent: false, dryRun: true, reason: 'no_api_key' }
  }

  const greeting = input.teacherName ? `สวัสดีค่ะ คุณครู ${input.teacherName}` : 'สวัสดีค่ะ คุณครู'
  const subject = `[${input.schoolName}] บันทึก Reflection วันนี้แล้วหรือยัง?`
  const text =
    `${greeting}\n\n` +
    `ยังไม่พบ Reflection ของวันนี้ในระบบ SchoolNextgen\n` +
    `บันทึกสั้น ๆ 3-5 นาที — ช่วยสะสมหลักฐานคุณภาพการสอนตลอดปี\n\n` +
    `บันทึกตอนนี้: ${input.appUrl}/teacher/reflections/new\n\n` +
    `— ระบบ SchoolNextgen (${input.schoolName})\n` +
    `อีเมลนี้ส่งโดยอัตโนมัติเมื่อยังไม่พบบันทึกของวันนี้`

  try {
    const res = await resend.emails.send({
      from: getEmailFrom(),
      to: input.to,
      subject,
      text,
    })
    if (res.error) {
      return { sent: false, dryRun: false, reason: res.error.message || 'resend_error' }
    }
    return { sent: true, id: res.data?.id ?? 'unknown' }
  } catch (e) {
    return { sent: false, dryRun: false, reason: e instanceof Error ? e.message : String(e) }
  }
}
