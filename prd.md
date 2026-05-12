# PRD — School AI Agent Command Center

**Product Name:** SchoolNextgen / School AI Agent Command Center
**ชื่อภาษาไทย:** ศูนย์บัญชาการผู้ช่วยครู AI
**Version:** 1.0 (consolidated)
**Source:** `Thinking_make_prd.md` (สังเคราะห์จากเอกสารคิด 10 รอบ + Addendums V2/V3/V4)
**Status:** Pre-implementation. ใช้เอกสารนี้เป็น single source of truth สำหรับการตัดสินใจ scope.

---

## 1. Vision

AI ไม่ได้มาแทนครู แต่มาช่วยให้ครูมีเวลามองตาเด็กมากขึ้น ลดภาระเอกสาร เพิ่มคุณภาพการคิด ผู้บริหารเห็นภาพรวมจริงจากชั้นเรียน ไม่ใช่จากแฟ้มประเมินวันสุดท้ายปี

**สูตรของระบบ:**
```
Director Command
  → Academic AI Review
  → Classroom AI Agents
  → Teacher Human Approval
  → Evidence-Based Dashboard
= โรงเรียนที่ใช้ AI อย่างมีคุณภาพ
```

---

## 2. Users & Roles

| Role | ขอบเขต | ใช้ทำอะไร |
|---|---|---|
| Director (ผอ.) | ทั้งโรงเรียน | กำหนดเป้าหมาย สั่งงาน อนุมัติ ดู dashboard ภาพรวม |
| Deputy Director × 4 | ฝ่ายของตน | บริหารงานตามฝ่าย ตรวจ/อนุมัติงาน |
| Academic Lead | งานวิชาการทั้งโรงเรียน | ตรวจคุณภาพแผน/ใบงาน/PLC/SAR |
| Teacher | ห้องเรียนของตน | ใช้ Classroom Agent บันทึก Reflection ส่งงาน |
| Learning Observation Officer | หมุนเวียนทั้งโรงเรียน | บันทึกภาพ/คลิป/สังเกตการเรียนรู้ |
| Area Officer (ศึกษานิเทศก์ / เขต) | หลายโรงเรียนในเขต | ดู dashboard เปรียบเทียบ สั่งงานระดับเขต |
| Network Admin | กลุ่ม/เครือข่ายโรงเรียน | งานร่วมเครือข่าย |
| System Admin | ระบบทั้งหมด | จัดการ user / agent / model / log |

ระบบใช้ **identity separation**: คนคนเดียวเป็นได้หลายบทบาท หลายโรงเรียน หลายปีการศึกษา ผ่านตาราง `persons` + `user_school_memberships` + `user_area_assignments`

---

## 3. Agent Hierarchy

5 ชั้น 17+ ตัว Agent:

```
Tier 1  Director Assistant Agent           รับคำสั่ง ผอ. แตกภารกิจ สรุปรายงาน
Tier 2  Academic Lead Agent                ตรวจคุณภาพวิชาการกลาง
Tier 3  Deputy Academic Agent              งานหลักสูตร / แผนสอน / วัดผล / PLC / SAR
        Deputy Budget Agent                งบประมาณ / พัสดุ / โครงการ / จัดซื้อ
        Deputy HR Agent                    บุคคล / ภาระงาน / ลา / วPA / พัฒนาครู
        Deputy General Affairs Agent       ธุรการ / อาคาร / กิจการนักเรียน / อนามัย / โภชนาการ / PR
Tier 4  Classroom Agents × 11              อ.2, อ.3, ป.1–ป.6, ม.1–ม.3
Tier 5  Specialty Agents                   QA/SAR Agent, PLC Agent, Knowledge/RAG Agent
```

แต่ละ Classroom Agent มี **persona ตามช่วงวัย** (จิตศึกษา/เกม/นิทาน สำหรับปฐมวัย → อ่านวิเคราะห์/โครงงาน สำหรับ ม.ต้น). System prompt เก็บใน DB ไม่ hardcode.

### Agent Communication Protocol

งานระหว่าง Agent ใช้ payload แบบ:
```json
{
  "mission": "พัฒนาการอ่านออกเขียนได้",
  "target_group": ["ป.1", "ป.2", "ป.3"],
  "task_type": "lesson_activity_plan",
  "expected_output": ["แผน 4 สัปดาห์", "ใบงาน", "แบบประเมิน", "แผนซ่อมเสริม"],
  "review_required": true,
  "reviewer_agent": "academic_lead_ai",
  "human_approval": "required"
}
```

---

## 4. 4-Division Administration Model

ระบบยึดตามกรอบการบริหารงานสี่ฝ่ายของโรงเรียน:

| Department | สี (gradient) | งานหลัก |
|---|---|---|
| ฝ่ายวิชาการ (Academic) | violet → blue | หลักสูตร, แผนการสอน, วัดผล, PLC, SAR, นิเทศ |
| ฝ่ายงบประมาณ (Budget) | blue → cyan | งบประมาณ, การเงิน, พัสดุ, โครงการ, จัดซื้อจัดจ้าง |
| ฝ่ายบุคคล (HR) | violet → fuchsia | ภาระงานครู, ลา, ลงเวลา, วPA, อบรม, ประเมิน |
| ฝ่ายบริหารทั่วไป (General Affairs) | sky → indigo | ธุรการ, อาคารสถานที่, กิจการนักเรียน, อนามัย, โภชนาการ, PR |

แต่ละฝ่ายมี Deputy Agent ของตน + Dashboard เฉพาะฝ่าย + Workflow อนุมัติของตน

---

## 5. Core Modules

### 5.1 Command Center
หน้าสั่งงานกลางของ ผอ. — พิมพ์เป้าหมายเป็นภาษาธรรมชาติ → AI แตกเป็นงานย่อย → กระจายให้ Agent รายชั้น/ฝ่าย → ติดตามสถานะ → สรุปผล

### 5.2 Agent Room
ห้องคุยกับ Agent ทุกตัวโดยตรง (ผอ. ดูได้ทุกตัว / ครูเห็นเฉพาะ Classroom Agent ของตน + Academic Lead)

### 5.3 Task Board
Kanban: `draft → assigned → in_progress → submitted → ai_review → human_review → needs_revision → approved → completed` (+ `overdue`, `cancelled`)

### 5.4 Lesson Plan Studio
สร้างแผนรายคาบ/หน่วย/กิจกรรม Active Learning/จิตศึกษา + ใบงาน + Rubric. AI หัวหน้าวิชาการตรวจความสอดคล้องหลักสูตร. Export PDF/Word.

### 5.5 Daily Teacher Reflection (Module V3)
ครูบันทึกผลหลังสอนรายวัน 3–5 นาที. 6 คำถามหลัก: วันนี้สอนอะไร / นักเรียนเป็นยังไง / สำเร็จอะไร / ปัญหา / จะปรับยังไง / มีหลักฐานไหม. แนบรูป/คลิปสั้น/PDF **หรือไม่แนบก็ได้**. AI ช่วยสรุปและจัด tag ไปยังมาตรฐาน SAR

### 5.6 Daily Duty Log (Module V4-A)
บันทึกเวรประจำวัน 7 ประเภท: หน้าโรงเรียน / สถานที่ตอนเช้า / กิจการนักเรียน / โรงอาหาร / อาหารเสริมนม / ความปลอดภัย / อื่น ๆ. แนบไฟล์ optional. รวมเป็นหลักฐานฝ่ายบริหารทั่วไป + วPA + SAR

### 5.7 Learning Observation Officer (Module V4-B)
เจ้าหน้าที่ติดตามการจัดการเรียนรู้ (แต่งตั้งพิเศษ) หมุนเวียนเข้าห้องเรียนรายวัน บันทึกภาพ/คลิป/บันทึก. Focus Areas: จิตศึกษา / HOTS / Active Learning / Student Agency / Collaboration / Communication / Creativity / Local Context / Assessment for Learning

### 5.8 Student Insight (Phase 5)
วิเคราะห์นักเรียนรายบุคคล: อ่าน/เขียน/คำนวณ/พฤติกรรม. แบ่งกลุ่มแบบ developmental ไม่ตีตรา. แผนซ่อมเสริมรายบุคคล

### 5.9 PLC Studio
ครูบันทึกปัญหาการเรียนรู้ → AI ประจำชั้นสรุปประเด็น → Academic Lead รวมประเด็นทุกชั้น → เสนอวาระ PLC → บันทึกประชุม → AI สรุปรายงาน → ผูกกลับกับแผนซ่อมเสริม

### 5.10 Knowledge Base (RAG)
อัปโหลด: หลักสูตร, SAR, แผนพัฒนาคุณภาพ, NT/RT/O-NET, PLC, คู่มือจิตศึกษา, Active Learning, โครงการประจำปี. Embedding + Semantic Search

### 5.11 Report Center / SAR Evidence
รายงานรายชั้น/รายเดือน/รายฝ่าย/รายปี + SAR Evidence Package อัตโนมัติจาก Reflection + Duty Log + Observation ตลอดปี

---

## 6. Multi-Tenant Data Model (สรุประดับสูง)

```
education_area_offices  เขตพื้นที่
  └─ school_networks    กลุ่ม/เครือข่ายโรงเรียน
      └─ schools
          ├─ academic_years
          │   └─ academic_terms
          ├─ departments      (4 ฝ่าย)
          ├─ classrooms
          ├─ tasks            (scope-aware)
          ├─ agents           + agent_scope_assignments
          └─ evidence_files

persons                  คนจริง
  ├─ users               บัญชี login
  ├─ user_school_memberships  สิทธิ์ใน scope รายโรงเรียน/ปี/ฝ่าย/ห้อง
  └─ user_area_assignments    สิทธิ์ระดับเขต

teacher_daily_reflections   Module V3
daily_duty_schedules        Module V4-A
daily_duty_logs
learning_observation_*      Module V4-B
sar_evidence_packages       Annual export
```

Scope levels: `system | area | network | school | academic_year | term | department | classroom | task`

รายละเอียดเต็มอยู่ใน `docs/database-schema.md`

---

## 7. UX & Visual Direction

- **Theme:** ม่วง–ฟ้า–ขาว gradient, modern, trustworthy, academic, warm. ไม่ sci-fi
- **Dark Mode + Light Mode** ครบทุกหน้า (`darkMode: class`)
- **App Shell:** Top Bar (Area / School / Year / Term / Role switcher + search + 🔔 + 🌙 + user) + Sidebar + Main
- **Card style:** `rounded-2xl`, soft shadow, subtle glass
- **5 UI states ต่อ component:** Loading / Empty / Normal / Error / Permission Denied
- **Accessibility:** WCAG AA contrast, focus-visible, aria-label, สถานะมี text label ไม่พึ่งสีอย่างเดียว
- **Responsive:** Desktop 3–4 col / Tablet 2 col / Mobile 1 col + bottom nav
- **Thai-first** UI สำหรับครู/ผอ.

### Dashboard ตามบทบาท

| Dashboard | สำหรับ | จุดเด่น |
|---|---|---|
| Area Office | ศึกษานิเทศก์ / ผู้บริหารเขต | School Progress Table, Risk Map, Area Command Panel |
| Director (โรงเรียน) | ผอ. | 6 Metric Cards + 4-Division Cards + Charts + Approval Queue |
| Deputy Academic | รอง ผอ.วิชาการ | Classroom Academic Matrix, Lesson Review Queue, PLC Queue |
| Deputy Budget | รอง ผอ.งบ | Budget Request Table, Procurement Checklist, Evidence Missing |
| Deputy HR | รอง ผอ.บุคคล | Teacher Workload Balance, PA Portfolio Progress |
| Deputy General Affairs | รอง ผอ.ทั่วไป | Admin Kanban, Facility Issues, Duty Logs |
| Teacher Workbench | ครู | My Tasks, Classroom Agent Card, Today's Duty, Today's Reflection |

---

## 8. AI Layer Policy

- **AI Gateway** เป็นชั้นแยก: เลือกโมเดล, ใส่ system prompt, rate limit, log token, ตรวจ output, fallback ระหว่าง local/cloud
- **Local Ollama** สำหรับ draft / สรุปเบา
- **Cloud API** สำหรับงานยาก ตรวจคุณภาพสูง
- **Embedding model** สำหรับ knowledge base
- **OCR** สำหรับ PDF/รูป
- ทุก output ของ AI ต้องเข้าสถานะ `ai_review` → `human_review` ก่อนเป็น `approved`
- ทุก AI run ต้องถูก log (`ai_run_logs`) เพื่อ audit + ใช้คำนวณ token cost ต่อโรงเรียน

### AI ห้ามทำ
1. อนุมัติเอกสารราชการ / รายงาน SAR / วPA แทนมนุษย์
2. สร้างข้อมูลนักเรียน / เหตุการณ์ที่ไม่เกิดขึ้นจริง
3. ตีตราเด็กว่า "แย่" / "ไม่มีศักยภาพ"
4. เปิดเผยข้อมูลส่วนบุคคลเกินจำเป็น
5. เผยแพร่ภาพ/คลิปนักเรียนโดยไม่ผ่านการอนุมัติของมนุษย์

---

## 9. MVP — Phase 1 Scope (Reflection-First)

**Locked goal:** ครู 3 คนใช้รายวัน ≥ 4 สัปดาห์ติด (ดู `docs/decisions.md` D-002)

### In scope (Phase 1)
- [ ] Login + Role + Membership resolver
- [ ] Multi-tenant context switcher (Area / School / Year / Term) — แม้เริ่ม 1 โรงเรียน
- [ ] **1 Classroom Agent** (เลือกชั้นเดียวก่อน เช่น ป.2 ที่มีครู pilot)
- [ ] หน้า Chat กับ Classroom Agent
- [ ] **Daily Teacher Reflection module เต็มรูป** (mobile-first, 6 ข้อ, ≤ 5 นาที, attachment optional)
- [ ] AI Summary + Tagging (Claude haiku-4-5 streaming)
- [ ] Teacher Timeline view (ของฉัน, filter, search)
- [ ] Habit loop UI: daily reminder, streak indicator, insight feedback
- [ ] Minimal Director view: รายชื่อครู + สถานะวันนี้ + นับ reflection ภาคนี้ + tag cloud

### Out of scope (เลื่อนไป Phase 2+)
- ❌ 13 agents — เริ่ม 1 ตัวก่อน (Phase 2 ขยาย 11 ชั้น)
- ❌ Lesson Plan Studio (Phase 2)
- ❌ Task Board เต็มรูป (Phase 2 — Phase 1 มีเฉพาะ reflection lifecycle)
- ❌ 4-Division Department Dashboards (Phase 4)
- ❌ Command Center (Phase 4)
- ❌ Duty Log + Learning Observation (Phase 3)
- ❌ Knowledge Base / RAG (Phase 6)
- ❌ Student Insight รายบุคคล (Phase 7)
- ❌ SAR Auto-Export (Phase 5 — ต้องมี data 1 ภาคก่อน)
- ❌ Area Office layer (Phase 8 — เมื่อมีโรงเรียนที่ 2)

### Phase 1 success metrics
1. ครู 3 คน login mobile → กรอก reflection ใน ≤ 5 นาที
2. AI summary ออกได้ภายใน 10 วินาที + ครูยืนยันได้
3. ระบบ run 4 สัปดาห์โดยไม่ crash
4. AI cost ≤ 50 บาท/ครู/เดือน
5. % ครูบันทึกรายวัน (ของวันที่เปิดเรียน) ≥ 80%

---

## 10. Acceptance Criteria (รวมจากทุก module)

ระบบถือว่าผ่านเมื่อ:

1. ผอ. สั่งงานครั้งเดียวผ่าน Command Center → ระบบกระจายถึง Agent รายชั้นได้
2. ครูคุยกับ Classroom Agent ของชั้นตนเองได้ + Academic Lead Agent ตรวจคุณภาพได้
3. ทุกงานสำคัญผ่าน `human_review` ก่อน `approved` (ไม่มี AI auto-approve)
4. ครูบันทึก Daily Reflection ได้ใน 3–5 นาที แนบไฟล์ได้หรือไม่ก็ได้
5. Dashboard แยกตาม 4 ฝ่ายชัดเจน เห็นทันทีว่างานไหนอยู่ฝ่ายไหน ใครรับผิดชอบ สถานะอะไร
6. รองรับ Context Switcher: Area → School → Year → Term
7. Dark mode + Light mode ครบทุกหน้า
8. Responsive ตั้งแต่ Desktop ถึง Mobile
9. คนคนเดียวมีหลายบทบาทใน scope ต่างกันได้
10. ปลายปีระบบรวม Reflection + Duty Log + Observation เป็น SAR Evidence Package ได้

---

## 11. Out of Scope (รอบ MVP)

- ระบบจ่ายเงินเดือนครู (ใช้ระบบราชการเดิม)
- ระบบรับสมัครนักเรียนออนไลน์
- LMS / e-Learning content delivery (เชื่อมระบบอื่นแทน)
- ระบบประเมิน O-NET / NT / RT (อ่านผลเข้ามาเท่านั้น ไม่จัดสอบเอง)
- Mobile native app (เริ่มจาก mobile web ก่อน)

---

## 12. รายละเอียดเพิ่มเติม

- Module เต็ม: `docs/modules.md`
- Schema เต็ม: `docs/database-schema.md`
- Architecture: `docs/architecture.md`
- Phase / Timeline: `plan.md`
- Task breakdown: `task.md`
- ที่มาทั้งหมด: `Thinking_make_prd.md`
