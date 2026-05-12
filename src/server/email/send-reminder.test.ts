import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// ──── Resend SDK mock ────────────────────────────────────────
// Built ahead of resend-client import via vi.mock + vi.hoisted.
const resendMock = vi.hoisted(() => ({
  send: vi.fn<
    (args: unknown) => Promise<{ data: { id: string } | null; error: { message: string } | null }>
  >(),
}))

vi.mock('resend', () => {
  // Mocked as a real class so `new Resend(...)` works.
  // vi.fn() arrow form is NOT a constructor — that path fails with
  // "() => ({...}) is not a constructor".
  class Resend {
    emails = resendMock
    constructor(_key: string) {}
  }
  return { Resend }
})

const { sendReminderEmail } = await import('./send-reminder')
const { _resetResendCache } = await import('./resend-client')

const ORIGINAL_KEY = process.env.RESEND_API_KEY

beforeEach(() => {
  _resetResendCache()
  resendMock.send.mockReset()
})

afterEach(() => {
  if (ORIGINAL_KEY === undefined) delete process.env.RESEND_API_KEY
  else process.env.RESEND_API_KEY = ORIGINAL_KEY
  _resetResendCache()
})

describe('sendReminderEmail — dry-run mode', () => {
  it('returns dryRun=true when RESEND_API_KEY is unset', async () => {
    delete process.env.RESEND_API_KEY
    _resetResendCache()

    const result = await sendReminderEmail({
      to: 'teacher@x.com',
      teacherName: 'ครู A',
      schoolName: 'โรงเรียนทดสอบ',
      appUrl: 'http://localhost:3000',
    })

    expect(result).toEqual({ sent: false, dryRun: true, reason: 'no_api_key' })
    expect(resendMock.send).not.toHaveBeenCalled()
  })

  it('returns dryRun=true when RESEND_API_KEY is too short', async () => {
    process.env.RESEND_API_KEY = 'short'
    _resetResendCache()

    const result = await sendReminderEmail({
      to: 'x@y',
      teacherName: null,
      schoolName: 'X',
      appUrl: 'http://x',
    })
    expect(result).toEqual({ sent: false, dryRun: true, reason: 'no_api_key' })
  })
})

describe('sendReminderEmail — happy path', () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = 're_test_key_at_least_eight_chars_long'
    _resetResendCache()
  })

  it('calls resend with correct from/to/subject/text when key is set', async () => {
    resendMock.send.mockResolvedValue({ data: { id: 'msg_12345' }, error: null })

    const result = await sendReminderEmail({
      to: 'teacher@demo.local',
      teacherName: 'สมศรี ใจดี',
      schoolName: 'โรงเรียนพญาไพร',
      appUrl: 'https://snx.example.com',
    })

    expect(result).toEqual({ sent: true, id: 'msg_12345' })
    expect(resendMock.send).toHaveBeenCalledOnce()
    const call = resendMock.send.mock.calls[0][0] as {
      from: string
      to: string
      subject: string
      text: string
    }
    expect(call.to).toBe('teacher@demo.local')
    expect(call.subject).toContain('โรงเรียนพญาไพร')
    expect(call.subject).toContain('Reflection')
    expect(call.text).toContain('สมศรี ใจดี')
    expect(call.text).toContain('https://snx.example.com/teacher/reflections/new')
    // No student PII
    expect(call.text).not.toMatch(/student|นักเรียน[A-Za-z0-9]/)
  })

  it('greets generically when teacherName is null', async () => {
    resendMock.send.mockResolvedValue({ data: { id: 'msg_x' }, error: null })

    await sendReminderEmail({
      to: 'x@y.com',
      teacherName: null,
      schoolName: 'School',
      appUrl: 'http://x',
    })
    const call = resendMock.send.mock.calls[0][0] as { text: string }
    expect(call.text).toContain('สวัสดีค่ะ คุณครู')
    expect(call.text).not.toContain('null')
    expect(call.text).not.toContain('undefined')
  })
})

describe('sendReminderEmail — error paths', () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = 're_test_key_at_least_eight_chars_long'
    _resetResendCache()
  })

  it('returns failure (not throws) when resend returns an error object', async () => {
    resendMock.send.mockResolvedValue({
      data: null,
      error: { message: 'invalid_from_address' },
    })

    const result = await sendReminderEmail({
      to: 't@x.com',
      teacherName: 'A',
      schoolName: 'S',
      appUrl: 'http://x',
    })

    expect(result.sent).toBe(false)
    if (result.sent) return
    expect(result.dryRun).toBe(false)
    expect(result.reason).toBe('invalid_from_address')
  })

  it('returns failure (not throws) when resend SDK throws', async () => {
    resendMock.send.mockRejectedValue(new Error('Network timeout'))

    const result = await sendReminderEmail({
      to: 't@x.com',
      teacherName: 'A',
      schoolName: 'S',
      appUrl: 'http://x',
    })

    expect(result.sent).toBe(false)
    if (result.sent) return
    expect(result.dryRun).toBe(false)
    expect(result.reason).toContain('Network timeout')
  })
})
