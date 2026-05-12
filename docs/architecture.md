# Architecture

ภาพรวมสถาปัตยกรรมระบบ — รายละเอียดเทคนิคแต่ละเลเยอร์อยู่ใน `plan.md`

---

## 1. Conceptual Layers (3 ชั้น)

```
ชั้นที่ 1: AI ช่วยคิด
  คิดแผน / กิจกรรม / ใบงาน / แบบประเมิน / แนวทางแก้ปัญหา

ชั้นที่ 2: มนุษย์ตรวจและตัดสินใจ
  ครูเลือกใช้ / หัวหน้าวิชาการตรวจ / ผอ. กำหนดทิศทาง

ชั้นที่ 3: ระบบเรียนรู้จากหลักฐาน
  เก็บผลการใช้ / วิเคราะห์ความก้าวหน้า / สรุปผล / ปรับปรุงรอบใหม่
```

ระบบไม่ใช่แค่ "AI ตอบคำถาม" แต่เป็น **เครื่องมือพัฒนาโรงเรียนทั้งระบบ**

---

## 2. Agent Topology

```
                Director (มนุษย์)
                      │
                      ▼
        ┌────────────────────────┐
        │ Director Assistant AI   │
        └────────────────────────┘
                      │
                      ▼
        ┌────────────────────────┐
        │ Academic Lead AI        │ (Quality Controller)
        └────────────────────────┘
                      │
        ┌─────────────┼──────────────┬──────────────┐
        ▼             ▼              ▼              ▼
 Deputy Academic Deputy Budget  Deputy HR  Deputy General Affairs
        │             │              │              │
        └─────────────┴──────┬───────┴──────────────┘
                             │
                             ▼
            ┌────────────────────────────────┐
            │   Classroom Agents (11 ตัว)     │
            │   อ.2 อ.3 ป.1 ป.2 ป.3 ป.4 ป.5    │
            │   ป.6 ม.1 ม.2 ม.3              │
            └────────────────────────────────┘
                             │
                             ▼
                  ครูประจำชั้น (มนุษย์)
                             │
                             ▼
                  บันทึกผลการเรียนรู้
                             │
                             ▼
                  AI วิเคราะห์/สรุป
                             │
                             ▼
                  Dashboard ผู้บริหาร
                             │
                             ▼
                  ปรับแผนพัฒนารอบใหม่
```

แต่ละ Classroom Agent มี **persona ตามช่วงวัย**:
- ปฐมวัย (อ.2–อ.3): จิตศึกษา, นิทาน, เกม, การสังเกตพัฒนาการ
- ต้นประถม (ป.1–ป.3): อ่านออกเขียนได้, แบบฝึกสั้น, ซ่อมเสริมรายบุคคล
- ปลายประถม (ป.4–ป.6): อ่านจับใจความ, STEM, Active Learning, Rubric
- มัธยมต้น (ม.1–ม.3): คิดเชิงระบบ, โครงงาน, ทักษะดิจิทัล, แนะแนวอาชีพ

---

## 3. Multi-Tenant Hierarchy

```
ระดับระบบกลาง
        ↓
เขตพื้นที่การศึกษา        education_area_offices
        ↓
กลุ่มโรงเรียน / เครือข่าย   school_networks
        ↓
โรงเรียน                  schools
        ↓
ปีการศึกษา / ภาคเรียน      academic_years / academic_terms
        ↓
ฝ่าย 4 ฝ่าย               departments
        ↓
ห้องเรียน                 classrooms
        ↓
ครู / นักเรียน / งาน / หลักฐาน
```

**Identity Separation:**
```
persons                  ตัวบุคคลจริง
  ├─ users               บัญชี login (อาจมีหลาย role)
  ├─ user_school_memberships   สิทธิ์ในโรงเรียน X ปี Y ฝ่าย Z ห้อง W
  └─ user_area_assignments     สิทธิ์ระดับเขต
```

หนึ่งคนเป็นได้พร้อมกัน:
- ผอ. โรงเรียน A
- ผู้ดูแลระดับเครือข่าย
- ผู้ประเมินจากเขต
- กรรมการวิชาการหลายโรงเรียน

---

## 4. Service Architecture

```
┌──────────────────────────────────────────────────────┐
│  Web (Next.js)                                       │
│  - App Shell, Dashboards, Editors                    │
│  - shadcn/ui, Zustand, React Flow, Recharts          │
└──────────┬───────────────────────────────────────────┘
           │ REST + WebSocket + SSE
┌──────────▼───────────────────────────────────────────┐
│  API (NestJS)                                        │
│  - Auth, Memberships, Tasks, Schools, Agents         │
│  - Approval workflows                                │
│  - WebSocket gateway                                 │
└────┬─────────────────────────────────────┬───────────┘
     │                                     │
     │ Prisma                              │ HTTP
     │                                     │
┌────▼────────────┐                ┌───────▼────────────┐
│  MariaDB 11.x   │                │ AI Gateway         │
│  - 30+ tables   │                │ - Provider abstrct │
│  - utf8mb4      │                │ - Prompt assembly  │
└─────────────────┘                │ - Token logging    │
                                    │ - RAG retrieval    │
┌─────────────────┐                │ - Rate limit       │
│ Redis + BullMQ  │◄───────────────┤                    │
│ - Queue AI jobs │                └───┬──────┬─────────┘
│ - Cache         │                    │      │
│ - Realtime hub  │                    │      │
└─────────────────┘             ┌──────▼──┐ ┌─▼──────────┐
                                │ Ollama   │ │ Cloud AI    │
┌─────────────────┐             │ (local)  │ │ (Claude/    │
│ pgvector/Qdrant │             │ -draft   │ │  Typhoon)   │
│ - embeddings    │             │ -summary │ │ -heavy work │
└─────────────────┘             └──────────┘ └─────────────┘

┌─────────────────┐
│ Storage (S3/    │
│ MinIO/local)    │ ◄── attachments: รูป, คลิป, PDF, doc
└─────────────────┘
```

---

## 5. AI Run Lifecycle

```
1. User → Web → API: POST /agents/:id/run
2. API → AI Gateway: ส่ง { agentId, conversationId, message, scope }
3. AI Gateway:
   a. โหลด agent.system_prompt
   b. RAG retrieval: top-k chunks จาก knowledge_base ของ scope
   c. โหลด conversation history (เฉพาะ N รายการล่าสุด)
   d. ประกอบ prompt
   e. เลือก provider: Ollama (default) หรือ Cloud (fallback / explicit)
   f. Stream tokens กลับผ่าน SSE → Web
   g. เก็บ ai_run_logs (latency, tokens, cost, model, status)
4. AI output → ai_review state ใน task (ไม่ใช่ approved)
5. ครู/หัวหน้าวิชาการ → human_review → approved/needs_revision
6. ถ้า approved → trigger downstream (notification, sar tagging)
```

---

## 6. Permission Resolution

```typescript
function canAccessTask(user, task) {
  const memberships = getUserMemberships(user.personId)
  return memberships.some(m => {
    if (m.role === 'area_admin' && m.areaOfficeId === task.areaOfficeId) return true
    if (m.role === 'school_director' && m.schoolId === task.schoolId) return true
    if (m.role.startsWith('deputy_') && m.schoolId === task.schoolId
        && m.departmentId === task.departmentId) return true
    if (m.role === 'teacher' && task.assignees.includes(user.id)) return true
    return false
  })
}
```

ทุก query หลักต้อง filter ด้วย scope ที่ resolve มาจาก membership ไม่ใช่ user.school_id ตรง ๆ

---

## 7. Module Boundaries

```
Core
  ├─ Tenant (areas, networks, schools, years, terms, departments)
  ├─ Identity (persons, users, memberships, roles)
  ├─ Tasks (workflows, approvals, evidence)
  └─ Agents (config, scope, conversations, run logs)

Modules (เพิ่มทีละ phase)
  ├─ Lesson Plan Studio
  ├─ Daily Reflection      → SAR pipeline
  ├─ Daily Duty Log        → SAR pipeline
  ├─ Learning Observation  → SAR pipeline
  ├─ PLC Studio            → SAR pipeline
  ├─ Knowledge Base (RAG)
  ├─ Student Insight       (PDPA-strict)
  ├─ SAR Evidence Package
  └─ Report Center
```

Module ใหม่ทุกตัวต้อง:
1. มีตารางของตน + scope columns (area/school/year/term/dept/classroom)
2. ลิงก์กลับ `tasks` และ `evidence_files`
3. มี `ai_summary` / `ai_tags` optional
4. มี `sar_mapping` optional
5. ทำงานได้แม้ไม่แนบไฟล์
