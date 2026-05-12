import { describe, it, expect } from 'vitest'
import { parseSummaryResponse, buildReflectionUserMessage } from './summarize-reflection'
import type { TeacherDailyReflection } from '@prisma/client'

describe('parseSummaryResponse', () => {
  it('parses clean JSON', () => {
    const raw = '{"summary":"นักเรียนสนุก","tags":["Active Learning","อ่านออกเขียนได้"]}'
    expect(parseSummaryResponse(raw)).toEqual({
      summary: 'นักเรียนสนุก',
      tags: ['Active Learning', 'อ่านออกเขียนได้'],
    })
  })

  it('strips ```json fence', () => {
    const raw = '```json\n{"summary":"ok","tags":["t1"]}\n```'
    expect(parseSummaryResponse(raw)).toEqual({ summary: 'ok', tags: ['t1'] })
  })

  it('strips generic ``` fence', () => {
    const raw = '```\n{"summary":"ok","tags":[]}\n```'
    expect(parseSummaryResponse(raw)).toEqual({ summary: 'ok', tags: [] })
  })

  it('tolerates leading + trailing prose around JSON', () => {
    const raw =
      'Here is the result:\n{"summary":"OK","tags":["x"]}\n\nThanks!'
    expect(parseSummaryResponse(raw)).toEqual({ summary: 'OK', tags: ['x'] })
  })

  it('falls back to raw text when JSON malformed', () => {
    const raw = 'not json at all'
    const result = parseSummaryResponse(raw)
    expect(result.summary).toBe('not json at all')
    expect(result.tags).toEqual([])
  })

  it('filters non-string tag entries', () => {
    const raw = '{"summary":"x","tags":["good",42,null,"also-good"]}'
    expect(parseSummaryResponse(raw)).toEqual({
      summary: 'x',
      tags: ['good', 'also-good'],
    })
  })

  it('handles missing summary field', () => {
    const raw = '{"tags":["x"]}'
    const result = parseSummaryResponse(raw)
    expect(result.tags).toEqual(['x'])
    // summary falls back to raw
    expect(typeof result.summary).toBe('string')
  })

  it('handles missing tags field', () => {
    const raw = '{"summary":"ok"}'
    expect(parseSummaryResponse(raw)).toEqual({ summary: 'ok', tags: [] })
  })
})

describe('buildReflectionUserMessage', () => {
  function fixture(overrides: Partial<TeacherDailyReflection> = {}): TeacherDailyReflection {
    return {
      id: 'r1',
      schoolId: 's1',
      areaOfficeId: null,
      schoolNetworkId: null,
      academicYearId: 'y1',
      academicTermId: null,
      departmentId: null,
      classroomId: null,
      lessonPlanId: null,
      taskId: null,
      teacherUserId: 'u1',
      teacherPersonId: null,
      reflectionDate: new Date(2026, 4, 11),
      periodNo: 3,
      subject: 'ภาษาไทย',
      topic: 'คำควบกล้ำ',
      whatHappened: 'สอนคำควบกล้ำ',
      whatStudentsDid: 'อ่านดี',
      successes: 'ทุกคนเข้าร่วม',
      problems: 'บางคนเสียงเบา',
      nextImprovement: 'เพิ่มเกม',
      summaryShort: null,
      aiSummary: null,
      aiTags: null,
      status: 'draft',
      isSarCandidate: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    }
  }

  it('includes all populated fields with labels', () => {
    const msg = buildReflectionUserMessage(fixture())
    expect(msg).toContain('ภาษาไทย')
    expect(msg).toContain('คำควบกล้ำ')
    expect(msg).toContain('สอนคำควบกล้ำ')
    expect(msg).toContain('อ่านดี')
    expect(msg).toContain('ทุกคนเข้าร่วม')
    expect(msg).toContain('บางคนเสียงเบา')
    expect(msg).toContain('เพิ่มเกม')
    expect(msg).toContain('คาบที่: 3')
  })

  it('omits fields that are null', () => {
    const msg = buildReflectionUserMessage(
      fixture({ subject: null, topic: null, periodNo: null, problems: null }),
    )
    expect(msg).not.toContain('รายวิชา')
    expect(msg).not.toContain('คาบที่')
    expect(msg).not.toContain('ปัญหา/อุปสรรค')
  })

  it('falls back to summaryShort when whatHappened is empty', () => {
    const msg = buildReflectionUserMessage(
      fixture({ whatHappened: null, summaryShort: 'สั้น ๆ' }),
    )
    expect(msg).toContain('สั้น ๆ')
    expect(msg).toContain('สรุปสั้น')
  })

  it('contains the Thai BE date', () => {
    const msg = buildReflectionUserMessage(fixture())
    expect(msg).toContain('2569')
  })
})
