import { z } from 'zod'

const dateLike = z.union([
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'รูปแบบวันที่ไม่ถูกต้อง (YYYY-MM-DD)'),
  z.date(),
])

// Shared field shape (no refinements — refinements live on the leaf schemas).
const ReflectionFields = z.object({
  reflectionDate: dateLike,
  classroomId: z.string().uuid().nullable().optional(),
  academicTermId: z.string().uuid().nullable().optional(),
  periodNo: z.number().int().min(1).max(12).nullable().optional(),
  subject: z.string().max(255).nullable().optional(),
  topic: z.string().max(500).nullable().optional(),
  whatHappened: z.string().max(5000).nullable().optional(),
  whatStudentsDid: z.string().max(5000).nullable().optional(),
  successes: z.string().max(5000).nullable().optional(),
  problems: z.string().max(5000).nullable().optional(),
  nextImprovement: z.string().max(5000).nullable().optional(),
  summaryShort: z.string().max(2000).nullable().optional(),
})

export const CreateReflectionInput = ReflectionFields.refine(
  (v) =>
    [v.whatHappened, v.whatStudentsDid, v.successes, v.problems, v.nextImprovement, v.summaryShort]
      .some((x) => x && x.trim().length > 0),
  { message: 'กรุณากรอกรายละเอียดบันทึกอย่างน้อย 1 ช่อง' },
)

export type CreateReflectionInput = z.infer<typeof CreateReflectionInput>

export const UpdateReflectionInput = ReflectionFields.partial().extend({
  id: z.string().uuid(),
})
export type UpdateReflectionInput = z.infer<typeof UpdateReflectionInput>

export const ReflectionIdInput = z.object({ id: z.string().uuid() })

export type ReflectionStatus =
  | 'draft'
  | 'ai_summarized'
  | 'teacher_confirmed'
  | 'academic_reviewed'
  | 'sar_candidate'
  | 'sar_selected'
  | 'sar_exported'

export const REFLECTION_STATUSES: ReadonlyArray<ReflectionStatus> = [
  'draft',
  'ai_summarized',
  'teacher_confirmed',
  'academic_reviewed',
  'sar_candidate',
  'sar_selected',
  'sar_exported',
]
