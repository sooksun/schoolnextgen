import 'server-only'
import type { TeacherDailyReflection } from '@prisma/client'
import { formatThaiShort } from '@/lib/date/thai'

/**
 * Task instruction for summarizing a teacher's daily reflection.
 * Stable text — eligible for prompt caching when combined with persona.
 */
export const SUMMARIZE_INSTRUCTION = `งานของคุณในการตอบครั้งนี้: ครูจะส่ง "บันทึกสะท้อนผลการจัดการเรียนรู้รายวัน" มาให้ คุณต้องช่วยครู

ทำสองสิ่งนี้
1. สรุปบันทึกของครูเป็นย่อหน้าสะท้อนคิด (1-3 ย่อหน้า ~120-200 คำ) ที่
   - อ่านง่าย ใช้ภาษาเชิงวิชาการอย่างเป็นมิตร
   - ระบุสิ่งที่ครูทำ นักเรียนเรียนรู้อะไร และจุดที่ครูตั้งใจปรับครั้งต่อไป
   - ใช้ภาษาเชิงบวกแม้พูดถึงปัญหา (เช่น "ยังต้องการการเสริมแรง" แทน "อ่อน")
   - ไม่เพิ่มเหตุการณ์ที่ไม่มีในบันทึก
2. เสนอ tag 3-6 รายการที่เหมาะสมจากหมวดต่อไปนี้ (เลือกที่เกี่ยวจริง)
   - อ่านออกเขียนได้
   - คณิตศาสตร์พื้นฐาน
   - Active Learning
   - จิตศึกษา
   - การสังเกตพฤติกรรม
   - การประเมินเพื่อพัฒนา
   - การซ่อมเสริมรายบุคคล
   - ทักษะชีวิต
   - ภาษาที่สอง / เด็กหลายภาษาแม่
   - การมีส่วนร่วมของนักเรียน
   - ปัญหาวินัยในห้องเรียน
   - หรือเสนอ tag ของคุณเอง 1-2 รายการเพิ่มเติมหากเหมาะ

รูปแบบการตอบ (สำคัญ — ต้องตรง format)
ให้ตอบเป็น JSON ตามโครงสร้างนี้เท่านั้น ไม่ต้องใส่ markdown code fence:
{
  "summary": "...สรุป...",
  "tags": ["tag1", "tag2", ...]
}

อย่าตอบอย่างอื่นนอก JSON object`

/**
 * Build the user message body from a Reflection row.
 */
export function buildReflectionUserMessage(r: TeacherDailyReflection): string {
  const lines: string[] = []
  lines.push(`📅 วันที่บันทึก: ${formatThaiShort(r.reflectionDate)}`)
  if (r.periodNo) lines.push(`⏰ คาบที่: ${r.periodNo}`)
  if (r.subject) lines.push(`📚 รายวิชา/กิจกรรม: ${r.subject}`)
  if (r.topic) lines.push(`🎯 หัวข้อ/หน่วยการเรียนรู้: ${r.topic}`)
  lines.push('')
  lines.push('— บันทึกของครู —')

  if (r.whatHappened) {
    lines.push(`\nวันนี้จัดการเรียนรู้อะไร:\n${r.whatHappened}`)
  }
  if (r.whatStudentsDid) {
    lines.push(`\nนักเรียนเรียนรู้/แสดงพฤติกรรมอย่างไร:\n${r.whatStudentsDid}`)
  }
  if (r.successes) {
    lines.push(`\nสิ่งที่สำเร็จ:\n${r.successes}`)
  }
  if (r.problems) {
    lines.push(`\nปัญหา/อุปสรรค:\n${r.problems}`)
  }
  if (r.nextImprovement) {
    lines.push(`\nจะปรับปรุงครั้งต่อไป:\n${r.nextImprovement}`)
  }
  if (r.summaryShort && !r.whatHappened) {
    lines.push(`\nสรุปสั้น:\n${r.summaryShort}`)
  }

  return lines.join('\n')
}

export type ParsedReflectionSummary = {
  summary: string
  tags: string[]
}

/**
 * Parse the AI's JSON response. Tolerant to wrapping whitespace/code fences.
 */
export function parseSummaryResponse(text: string): ParsedReflectionSummary {
  let cleaned = text.trim()
  // Strip code fence if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-z]*\n?/i, '').replace(/```$/, '').trim()
  }
  // Find first { and last }
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start < 0 || end <= start) {
    return { summary: cleaned, tags: [] }
  }
  const json = cleaned.slice(start, end + 1)
  try {
    const parsed = JSON.parse(json) as { summary?: string; tags?: string[] }
    return {
      summary: typeof parsed.summary === 'string' ? parsed.summary : cleaned,
      tags: Array.isArray(parsed.tags) ? parsed.tags.filter((t) => typeof t === 'string') : [],
    }
  } catch {
    return { summary: cleaned, tags: [] }
  }
}
