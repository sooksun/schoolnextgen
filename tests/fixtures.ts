/**
 * Test fixtures + helpers shared across integration tests.
 * Each test file should call `resetDb()` and `seedBasic()` in beforeEach.
 */
import { PrismaClient } from '@prisma/client'
import { rm } from 'node:fs/promises'
import path from 'node:path'

export const testPrisma = new PrismaClient()

export type SeededIds = {
  schoolId: string
  academicYearId: string
  classroomId: string
  departmentId: string
  teacherRoleId: string
  directorRoleId: string
  teacherUserId: string
  teacherPersonId: string
  directorUserId: string
  agentId: string
}

/** Truncate all tables in dependency-safe order. */
export async function resetDb(): Promise<void> {
  const p = testPrisma
  // Children → parents
  await p.dailyReminderLog.deleteMany()
  await p.reflectionSarMapping.deleteMany()
  await p.reflectionAiSummary.deleteMany()
  await p.reflectionAttachment.deleteMany()
  await p.teacherDailyReflection.deleteMany()
  await p.aiMessage.deleteMany()
  await p.aiRunLog.deleteMany()
  await p.aiConversation.deleteMany()
  await p.evidenceFile.deleteMany()
  await p.agentScopeAssignment.deleteMany()
  await p.agent.deleteMany()
  await p.userAreaAssignment.deleteMany()
  await p.userSchoolMembership.deleteMany()
  await p.session.deleteMany()
  await p.user.deleteMany()
  await p.classroom.deleteMany()
  await p.department.deleteMany()
  await p.academicTerm.deleteMany()
  await p.academicYear.deleteMany()
  await p.school.deleteMany()
  await p.schoolNetwork.deleteMany()
  await p.educationAreaOffice.deleteMany()
  await p.person.deleteMany()
  await p.role.deleteMany()
}

/** Minimal seed: 1 school, 1 year, 1 classroom, 1 teacher, 1 director, 1 agent. */
export async function seedBasic(): Promise<SeededIds> {
  const p = testPrisma

  const teacherRole = await p.role.create({
    data: { code: 'teacher', name: 'ครู', scopeLevel: 'classroom' },
  })
  const directorRole = await p.role.create({
    data: { code: 'director', name: 'ผอ.', scopeLevel: 'school' },
  })

  const school = await p.school.create({
    data: { code: 'T01', name: 'โรงเรียนทดสอบ' },
  })

  const year = await p.academicYear.create({
    data: { schoolId: school.id, yearLabel: '2569', isCurrent: true },
  })

  const department = await p.department.create({
    data: { schoolId: school.id, code: 'academic', name: 'วิชาการ' },
  })

  const classroom = await p.classroom.create({
    data: {
      schoolId: school.id,
      academicYearId: year.id,
      level: 'G2',
      name: 'ป.2/1',
    },
  })

  // Teacher
  const teacherPerson = await p.person.create({
    data: { displayName: 'ครู A', email: 'teacher@test.local' },
  })
  const teacherUser = await p.user.create({
    data: {
      personId: teacherPerson.id,
      email: 'teacher@test.local',
      passwordHash: 'x',
    },
  })
  await p.userSchoolMembership.create({
    data: {
      personId: teacherPerson.id,
      userId: teacherUser.id,
      schoolId: school.id,
      academicYearId: year.id,
      departmentId: department.id,
      classroomId: classroom.id,
      roleId: teacherRole.id,
    },
  })

  // Director
  const directorPerson = await p.person.create({
    data: { displayName: 'ผอ. B', email: 'director@test.local' },
  })
  const directorUser = await p.user.create({
    data: {
      personId: directorPerson.id,
      email: 'director@test.local',
      passwordHash: 'x',
    },
  })
  await p.userSchoolMembership.create({
    data: {
      personId: directorPerson.id,
      userId: directorUser.id,
      schoolId: school.id,
      academicYearId: year.id,
      roleId: directorRole.id,
    },
  })

  // Agent
  const agent = await p.agent.create({
    data: {
      schoolId: school.id,
      agentType: 'classroom_assistant',
      gradeLevel: 'G2',
      departmentId: department.id,
      scopeLevel: 'classroom',
      name: 'AI ป.2',
      systemPrompt: 'test persona',
      modelProvider: 'anthropic',
      modelName: 'claude-haiku-4-5',
      temperature: 0.3,
    },
  })

  return {
    schoolId: school.id,
    academicYearId: year.id,
    classroomId: classroom.id,
    departmentId: department.id,
    teacherRoleId: teacherRole.id,
    directorRoleId: directorRole.id,
    teacherUserId: teacherUser.id,
    teacherPersonId: teacherPerson.id,
    directorUserId: directorUser.id,
    agentId: agent.id,
  }
}

export type TestScope = {
  user: { id: string; personId: string; email: string }
  membershipId: string
  schoolId: string
  schoolName: string
  academicYearId: string
  academicYearLabel: string
  academicTermId: string | null
  academicTermName: string | null
  role: string
  roleName: string
  departmentId: string | null
  classroomId: string | null
  classroomName: string | null
}

/** Build a Scope object for tests (no cookie/session needed). */
export function fakeScope(opts: {
  ids: SeededIds
  role: 'teacher' | 'director'
}): TestScope {
  const isTeacher = opts.role === 'teacher'
  return {
    user: {
      id: isTeacher ? opts.ids.teacherUserId : opts.ids.directorUserId,
      personId: isTeacher ? opts.ids.teacherPersonId : 'director-person',
      email: isTeacher ? 'teacher@test.local' : 'director@test.local',
    },
    membershipId: 'm1',
    schoolId: opts.ids.schoolId,
    schoolName: 'โรงเรียนทดสอบ',
    academicYearId: opts.ids.academicYearId,
    academicYearLabel: '2569',
    academicTermId: null,
    academicTermName: null,
    role: opts.role,
    roleName: opts.role,
    departmentId: isTeacher ? opts.ids.departmentId : null,
    classroomId: isTeacher ? opts.ids.classroomId : null,
    classroomName: isTeacher ? 'ป.2/1' : null,
  }
}

export type SecondSchoolIds = {
  schoolId: string
  academicYearId: string
  classroomId: string
  teacherUserId: string
  teacherPersonId: string
}

/**
 * Seed a second, fully-isolated school + teacher.
 * Reuses the `teacher` role from seedBasic — call seedBasic() first.
 */
export async function seedSecondSchool(): Promise<SecondSchoolIds> {
  const p = testPrisma
  const teacherRole = await p.role.findUniqueOrThrow({ where: { code: 'teacher' } })

  const school = await p.school.create({
    data: { code: 'T02', name: 'โรงเรียนทดสอบที่สอง' },
  })
  const year = await p.academicYear.create({
    data: { schoolId: school.id, yearLabel: '2569', isCurrent: true },
  })
  const classroom = await p.classroom.create({
    data: {
      schoolId: school.id,
      academicYearId: year.id,
      level: 'G2',
      name: 'ป.2/1 (รร.B)',
    },
  })
  const person = await p.person.create({
    data: { displayName: 'ครู B', email: 'teacher-b@test.local' },
  })
  const user = await p.user.create({
    data: { personId: person.id, email: 'teacher-b@test.local', passwordHash: 'x' },
  })
  await p.userSchoolMembership.create({
    data: {
      personId: person.id,
      userId: user.id,
      schoolId: school.id,
      academicYearId: year.id,
      classroomId: classroom.id,
      roleId: teacherRole.id,
    },
  })

  return {
    schoolId: school.id,
    academicYearId: year.id,
    classroomId: classroom.id,
    teacherUserId: user.id,
    teacherPersonId: person.id,
  }
}

/** Wipe the test UPLOAD_DIR between upload tests. */
export async function cleanUploadDir(): Promise<void> {
  const dir = path.resolve(process.cwd(), process.env.UPLOAD_DIR ?? './tests/.uploads')
  await rm(dir, { recursive: true, force: true }).catch(() => {})
}
