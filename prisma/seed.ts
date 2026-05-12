/**
 * Phase 1 + Phase 2 prep seed.
 * - 1 area office, 1 school, 1 academic year (current), 1 term (current)
 * - 4 departments (academic / budget / hr / general_affairs)
 * - 11 classrooms (K2, K3, G1-G6, M1-M3)
 * - 8 roles
 * - 3 persons + 3 users: ครู ป.2, ผอ., รอง วช.
 * - 3 memberships
 * - 11 Classroom Agents (claude-haiku-4-5) — one per grade level
 * - 1 Academic Lead Agent (claude-sonnet-4-6) — school-scope
 * - Agent scope assignments
 *
 * Run: pnpm db:seed
 * Idempotent — re-running upserts/skips existing rows.
 */

import { PrismaClient } from '@prisma/client'
import { hash } from '@node-rs/argon2'
import { CLASSROOM_PERSONA_EARLY } from '../src/server/ai/prompts/classroom-early'
import { CLASSROOM_PERSONA_LOWER_PRIMARY } from '../src/server/ai/prompts/classroom-lower-primary'
import { CLASSROOM_PERSONA_UPPER_PRIMARY } from '../src/server/ai/prompts/classroom-upper-primary'
import { CLASSROOM_PERSONA_SECONDARY } from '../src/server/ai/prompts/classroom-secondary'
import { ACADEMIC_LEAD_PERSONA } from '../src/server/ai/prompts/academic-lead'

const prisma = new PrismaClient()

const ARGON2 = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
}

async function main() {
  console.log('🌱 Seeding…')

  // ───── Roles ─────────────────────────────────────────────
  const roles = [
    { code: 'director', name: 'ผู้อำนวยการโรงเรียน', scopeLevel: 'school' },
    { code: 'deputy_academic', name: 'รองผู้อำนวยการฝ่ายวิชาการ', scopeLevel: 'department' },
    { code: 'deputy_budget', name: 'รองผู้อำนวยการฝ่ายงบประมาณ', scopeLevel: 'department' },
    { code: 'deputy_hr', name: 'รองผู้อำนวยการฝ่ายบุคคล', scopeLevel: 'department' },
    { code: 'deputy_general_affairs', name: 'รองผู้อำนวยการฝ่ายบริหารทั่วไป', scopeLevel: 'department' },
    { code: 'academic_lead', name: 'หัวหน้าฝ่ายวิชาการ', scopeLevel: 'department' },
    { code: 'teacher', name: 'ครูประจำชั้น', scopeLevel: 'classroom' },
    { code: 'admin', name: 'ผู้ดูแลระบบ', scopeLevel: 'system' },
  ]
  for (const r of roles) {
    await prisma.role.upsert({
      where: { code: r.code },
      create: r,
      update: { name: r.name, scopeLevel: r.scopeLevel },
    })
  }
  console.log(`  ✓ ${roles.length} roles`)

  // ───── Area Office ───────────────────────────────────────
  const area = await prisma.educationAreaOffice.upsert({
    where: { code: 'DEMO-AREA' },
    create: {
      code: 'DEMO-AREA',
      name: 'สำนักงานเขตพื้นที่การศึกษาประถมศึกษา (ทดสอบ)',
      officeType: 'primary',
      province: 'พิษณุโลก',
      region: 'ภาคเหนือตอนล่าง',
    },
    update: {},
  })

  // ───── School ────────────────────────────────────────────
  const school = await prisma.school.upsert({
    where: { code: 'DEMO01' },
    create: {
      code: 'DEMO01',
      name: 'โรงเรียนทดสอบ SchoolNextgen',
      areaOfficeId: area.id,
      province: 'พิษณุโลก',
      district: 'เมือง',
      schoolSize: 'small',
      schoolType: 'regular',
    },
    update: {},
  })

  // ───── Academic Year + Term ──────────────────────────────
  // ปีการศึกษา 2569 = 2026/2027 in Gregorian (Thailand school year May → April)
  const yearLabel = '2569'
  let year = await prisma.academicYear.findFirst({
    where: { schoolId: school.id, yearLabel },
  })
  if (!year) {
    year = await prisma.academicYear.create({
      data: {
        schoolId: school.id,
        yearLabel,
        startDate: new Date('2026-05-16'),
        endDate: new Date('2027-04-30'),
        isCurrent: true,
      },
    })
  }

  let term = await prisma.academicTerm.findFirst({
    where: { academicYearId: year.id, termNo: 1 },
  })
  if (!term) {
    term = await prisma.academicTerm.create({
      data: {
        academicYearId: year.id,
        termNo: 1,
        name: 'ภาคเรียนที่ 1',
        startDate: new Date('2026-05-16'),
        endDate: new Date('2026-10-10'),
        isCurrent: true,
      },
    })
  }

  // ───── Departments (4 ฝ่าย) ──────────────────────────────
  const deptDefs = [
    { code: 'academic', name: 'ฝ่ายวิชาการ', displayOrder: 1 },
    { code: 'budget', name: 'ฝ่ายงบประมาณ', displayOrder: 2 },
    { code: 'hr', name: 'ฝ่ายบุคคล', displayOrder: 3 },
    { code: 'general_affairs', name: 'ฝ่ายบริหารทั่วไป', displayOrder: 4 },
  ]
  const departments: Record<string, { id: string }> = {}
  for (const d of deptDefs) {
    const dept = await prisma.department.upsert({
      where: { schoolId_code: { schoolId: school.id, code: d.code } },
      create: { ...d, schoolId: school.id },
      update: { name: d.name, displayOrder: d.displayOrder },
    })
    departments[d.code] = { id: dept.id }
  }

  // ───── 11 Classrooms (K2, K3, G1-G6, M1-M3) ──────────────
  // The seed teacher's classroom (G2) is the first one — used for memberships below.
  type Band = 'EARLY' | 'LOWER_PRIMARY' | 'UPPER_PRIMARY' | 'SECONDARY'
  const CLASSROOMS: ReadonlyArray<{
    level: string
    name: string
    band: Band
    displayOrder: number
  }> = [
    { level: 'K2', name: 'อ.2/1', band: 'EARLY', displayOrder: 1 },
    { level: 'K3', name: 'อ.3/1', band: 'EARLY', displayOrder: 2 },
    { level: 'G1', name: 'ป.1/1', band: 'LOWER_PRIMARY', displayOrder: 3 },
    { level: 'G2', name: 'ป.2/1', band: 'LOWER_PRIMARY', displayOrder: 4 },
    { level: 'G3', name: 'ป.3/1', band: 'LOWER_PRIMARY', displayOrder: 5 },
    { level: 'G4', name: 'ป.4/1', band: 'UPPER_PRIMARY', displayOrder: 6 },
    { level: 'G5', name: 'ป.5/1', band: 'UPPER_PRIMARY', displayOrder: 7 },
    { level: 'G6', name: 'ป.6/1', band: 'UPPER_PRIMARY', displayOrder: 8 },
    { level: 'M1', name: 'ม.1/1', band: 'SECONDARY', displayOrder: 9 },
    { level: 'M2', name: 'ม.2/1', band: 'SECONDARY', displayOrder: 10 },
    { level: 'M3', name: 'ม.3/1', band: 'SECONDARY', displayOrder: 11 },
  ]
  const classroomByLevel = new Map<string, { id: string }>()
  for (const c of CLASSROOMS) {
    let row = await prisma.classroom.findFirst({
      where: { schoolId: school.id, academicYearId: year.id, level: c.level },
    })
    if (!row) {
      row = await prisma.classroom.create({
        data: {
          schoolId: school.id,
          academicYearId: year.id,
          level: c.level,
          roomNo: '1',
          name: c.name,
          displayOrder: c.displayOrder,
        },
      })
    }
    classroomByLevel.set(c.level, { id: row.id })
  }
  const classroom = await prisma.classroom.findFirstOrThrow({
    where: { schoolId: school.id, academicYearId: year.id, level: 'G2' },
  })
  console.log(`  ✓ ${CLASSROOMS.length} classrooms`)

  // ───── Persons + Users ───────────────────────────────────
  const password = await hash('Pass1234!', ARGON2)
  const seedUsers = [
    {
      email: 'teacher@demo.local',
      displayName: 'ครูสมศรี ใจดี',
      firstName: 'สมศรี',
      lastName: 'ใจดี',
      roleCode: 'teacher',
      classroomId: classroom.id,
      departmentId: departments.academic.id,
    },
    {
      email: 'director@demo.local',
      displayName: 'ผอ.สมชาย สอนเด็ก',
      firstName: 'สมชาย',
      lastName: 'สอนเด็ก',
      roleCode: 'director',
      classroomId: null,
      departmentId: null,
    },
    {
      email: 'deputy.academic@demo.local',
      displayName: 'รอง วช. มาลี อ่านเก่ง',
      firstName: 'มาลี',
      lastName: 'อ่านเก่ง',
      roleCode: 'deputy_academic',
      classroomId: null,
      departmentId: departments.academic.id,
    },
  ]

  for (const u of seedUsers) {
    let person = await prisma.person.findFirst({ where: { email: u.email } })
    if (!person) {
      person = await prisma.person.create({
        data: {
          displayName: u.displayName,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
        },
      })
    }
    const user = await prisma.user.upsert({
      where: { email: u.email },
      create: {
        personId: person.id,
        email: u.email,
        passwordHash: password,
      },
      update: {},
    })
    const role = await prisma.role.findUniqueOrThrow({ where: { code: u.roleCode } })

    // Find-or-create membership (unique on full scope tuple)
    const existing = await prisma.userSchoolMembership.findFirst({
      where: {
        personId: person.id,
        schoolId: school.id,
        academicYearId: year.id,
        departmentId: u.departmentId,
        classroomId: u.classroomId,
        roleId: role.id,
      },
    })
    if (!existing) {
      await prisma.userSchoolMembership.create({
        data: {
          personId: person.id,
          userId: user.id,
          schoolId: school.id,
          academicYearId: year.id,
          departmentId: u.departmentId,
          classroomId: u.classroomId,
          roleId: role.id,
          status: 'active',
          membershipType: 'staff',
        },
      })
    }
  }
  console.log(`  ✓ ${seedUsers.length} users (password: Pass1234!)`)

  // ───── Set homeroom on classroom ─────────────────────────
  const teacherUser = await prisma.user.findUniqueOrThrow({
    where: { email: 'teacher@demo.local' },
  })
  await prisma.classroom.update({
    where: { id: classroom.id },
    data: { homeroomTeacherUserId: teacherUser.id },
  })

  // ───── 11 Classroom Agents + 1 Academic Lead Agent ───────
  const PERSONA_BY_BAND: Record<Band, string> = {
    EARLY: CLASSROOM_PERSONA_EARLY,
    LOWER_PRIMARY: CLASSROOM_PERSONA_LOWER_PRIMARY,
    UPPER_PRIMARY: CLASSROOM_PERSONA_UPPER_PRIMARY,
    SECONDARY: CLASSROOM_PERSONA_SECONDARY,
  }
  const DISPLAY_NAME_BY_LEVEL: Record<string, string> = {
    K2: 'อนุบาล 2', K3: 'อนุบาล 3',
    G1: 'ป.1', G2: 'ป.2', G3: 'ป.3',
    G4: 'ป.4', G5: 'ป.5', G6: 'ป.6',
    M1: 'ม.1', M2: 'ม.2', M3: 'ม.3',
  }
  // Create-if-missing, sync persona + model + budget every run (idempotent sync).
  let createdCount = 0
  let updatedCount = 0
  for (const c of CLASSROOMS) {
    const existing = await prisma.agent.findFirst({
      where: {
        schoolId: school.id,
        agentType: 'classroom_assistant',
        gradeLevel: c.level,
      },
    })
    const desired = {
      schoolId: school.id,
      agentType: 'classroom_assistant',
      gradeLevel: c.level,
      departmentId: departments.academic.id,
      scopeLevel: 'classroom',
      name: `AI ผู้ช่วยครูประจำชั้น ${DISPLAY_NAME_BY_LEVEL[c.level]}`,
      systemPrompt: PERSONA_BY_BAND[c.band],
      modelProvider: 'anthropic',
      modelName: 'claude-haiku-4-5',
      temperature: 0.3,
      maxTokens: 1024,
      monthlyTokenBudget: BigInt(50_000),
      status: 'active',
    }
    let agentId: string
    if (existing) {
      const driftedFields = {
        systemPrompt: desired.systemPrompt,
        modelName: desired.modelName,
        monthlyTokenBudget: desired.monthlyTokenBudget,
        name: desired.name,
      }
      await prisma.agent.update({ where: { id: existing.id }, data: driftedFields })
      agentId = existing.id
      updatedCount++
    } else {
      const created = await prisma.agent.create({ data: desired })
      agentId = created.id
      createdCount++
    }

    // Scope assignment — find-or-create only; never overwrite
    const existingScope = await prisma.agentScopeAssignment.findFirst({
      where: { agentId, scopeLevel: 'classroom', classroomId: classroomByLevel.get(c.level)!.id },
    })
    if (!existingScope) {
      await prisma.agentScopeAssignment.create({
        data: {
          agentId,
          scopeLevel: 'classroom',
          schoolId: school.id,
          academicYearId: year.id,
          classroomId: classroomByLevel.get(c.level)!.id,
          roleDescription: `Primary agent for ${c.level} classroom`,
          isPrimary: true,
        },
      })
    }
  }
  console.log(`  ✓ Classroom Agents: ${createdCount} created, ${updatedCount} synced (${CLASSROOMS.length} total)`)

  // ───── Academic Lead Agent (school-scope, sonnet) ────────
  const existingAcademicLead = await prisma.agent.findFirst({
    where: {
      schoolId: school.id,
      agentType: 'academic_lead',
    },
  })
  if (!existingAcademicLead) {
    const academicLead = await prisma.agent.create({
      data: {
        schoolId: school.id,
        agentType: 'academic_lead',
        departmentId: departments.academic.id,
        scopeLevel: 'school',
        name: 'AI หัวหน้าฝ่ายวิชาการ',
        systemPrompt: ACADEMIC_LEAD_PERSONA,
        modelProvider: 'anthropic',
        modelName: 'claude-sonnet-4-6',
        temperature: 0.3,
        maxTokens: 2048,
        monthlyTokenBudget: BigInt(200_000), // sonnet is ~3× pricier; covers cross-school review work
        status: 'active',
      },
    })
    await prisma.agentScopeAssignment.create({
      data: {
        agentId: academicLead.id,
        scopeLevel: 'school',
        schoolId: school.id,
        academicYearId: year.id,
        departmentId: departments.academic.id,
        roleDescription: 'School-wide academic quality reviewer',
        isPrimary: true,
      },
    })
    console.log(`  ✓ Academic Lead Agent: ${academicLead.name}`)
  } else {
    console.log(`  ✓ Academic Lead Agent already present (skipped)`)
  }

  console.log('🌱 Done.')
  console.log('')
  console.log('Demo logins (password = Pass1234!):')
  for (const u of seedUsers) {
    console.log(`  • ${u.email}  →  ${u.roleCode}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
