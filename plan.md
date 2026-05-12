# Implementation Plan — SchoolNextgen

แผนสร้างระบบจาก document → working app. ปรับใหม่หลังตัดสินใจ D-001 ถึง D-005 (อ่าน `docs/decisions.md`)

**Goal:** ครู 3 คนใช้รายวัน 4 สัปดาห์ติดต่อกัน ภายใน 5-6 สัปดาห์จากวันนี้

---

## 0. Phase 0 — Setup (3-5 วัน) ⭐ ทำตอนนี้

Single Next.js app, ไม่มี monorepo, ไม่มี Ollama

| Day | งาน | DoD |
|---|---|---|
| **D0-1** | init Next.js 15 + Tailwind + shadcn/ui + next-themes + base theme tokens | `pnpm dev` แล้วเห็น landing page ที่ toggle dark/light ได้ |
| **D0-2** | Prisma init → connect MariaDB (`school_agent_db` ใน Laragon) + แปลง 7 ตารางแรกเป็น schema | `pnpm db:migrate dev` ผ่าน, Prisma Studio เห็นตาราง |
| **D0-3** | Anthropic SDK + `.env.local` + ทดสอบ streaming ตอบ Hello Thai ใน route handler | hit `/api/test-ai` ได้ stream Thai reply |
| **D0-4** | Auth (Lucia หรือ Auth.js) + login page + protected route + role guard | login เป็น role 'teacher' / 'director' แล้ว redirect ถูก |
| **D0-5** | seed: 1 โรงเรียน + 1 academic_year + 1 classroom (ป.2) + 3 ครู (ครู 1 ป.2, ผอ., รอง วช.) + 1 Classroom Agent ป.2 พร้อม system prompt | login ครู 1 → เห็นชื่อตัวเอง, ชื่อชั้น, ชื่อ AI Agent ของชั้น |

**Phase 0 Acceptance:** ครู 1 login → เห็น dashboard skeleton ของตัวเอง พร้อมชื่อ AI ป.2 + cookie session

---

## 1. Phase 1 — Reflection-First MVP (4-5 สัปดาห์) ⭐ Critical

**เป้าหมายเดียว:** ครู 3 คนใช้รายวัน ≥ 4 สัปดาห์ติด

### Week 1: Foundation
- Identity + Tenant + Membership schema (ตาราง 1-12 ใน `docs/database-schema.md` §2-§3)
- App Shell: Sidebar + Top Bar + ContextSwitcher (แม้มี 1 โรงเรียน) + Theme toggle + UserMenu
- Mobile responsive baseline (test ที่ 375px width ทุกหน้า)
- shadcn components ที่จะใช้บ่อย: Button, Card, Input, Textarea, Sheet, Dialog, Toast

### Week 2: Reflection Quick Form
- Migration: `teacher_daily_reflections`, `reflection_attachments`, `reflection_ai_summaries`
- `/teacher/reflections/new` — quick form 6 ข้อ (3 required + 3 optional) บนมือถือก่อน
- File upload (image/video/pdf) — local disk `uploads/` + size guard + preview
- `/teacher/reflections` — timeline ของฉัน + filter ตามชั้น/รายวิชา
- `/teacher/reflections/:id` — detail view
- Save as draft + submit
- Empty state ที่ inviting ให้บันทึกครั้งแรก

### Week 3: AI Summary + Tagging
- `src/lib/ai/anthropic.ts` — client + retry + cost tracking
- `src/lib/ai/prompt.ts` — assemble persona + reflection content → message
- Server action `summarizeReflection(reflectionId)` → call Claude haiku-4-5 streaming
- Stream tokens กลับ UI ผ่าน Server Action with streamable response (React 19 useActionState + ai/rsc) หรือ SSE route
- ครูยืนยัน/แก้ → save as `teacher_confirmed`
- Log run ใน `ai_run_logs` (model, prompt_tokens, completion_tokens, cost_usd, latency_ms)
- Anthropic prompt caching: cache system prompt + persona

### Week 4: Habit Loop + Minimal Director View
- Daily reminder: 15:30 ทุกวันเรียน — in-app notification + email (optional via Resend)
- Streak indicator: "บันทึก 5 วันติด ✨"
- Insight feedback: "เดือนนี้ tag 'อ่านออกเขียนได้' เกิด 12 ครั้ง"
- `/school/dashboard` — minimal Director view
  - Card 1: ครูที่บันทึกวันนี้ / ทั้งหมด
  - Card 2: จำนวน reflection ภาคนี้
  - Card 3: Tag cloud
  - Table: รายชื่อครู + สถานะวันนี้
- Cron job (Vercel Cron หรือ node-cron): daily streak update + reminder

### Week 5: Polish + Pilot
- Bug fix รอบใหญ่จาก feedback ครู
- Mobile UX iteration (อะไรกรอกยาก → ลด)
- Deploy: VPS เดียวด้วย PM2 หรือ Vercel
- Onboard ครู 3 คน + คู่มือสั้น 3 หน้า
- ติดตามตัววัด: % ครูบันทึกรายวัน, เวลาเฉลี่ยกรอก, จำนวน reflection ต่อสัปดาห์, AI cost ต่อ reflection

**Phase 1 Acceptance:**
- ครู 3 คน login mobile → กรอก reflection ใน ≤ 5 นาที → AI สรุปได้ → ครูยืนยัน
- ผอ. เปิด dashboard เห็นจำนวน reflection วันนี้/สัปดาห์
- ระบบ run ติดต่อกัน 4 สัปดาห์โดยไม่ crash
- AI cost ≤ 50 บาท/ครู/เดือน (Estimated: ~30 reflections × ~$0.001 each with haiku + caching)

---

## 2. Phase 2 — ขยาย 11 ชั้น + Lesson Plan (4 สัปดาห์)

หลังครู 3 คนใช้ stable → ขยาย scope

- Classroom Agents เพิ่ม 10 ตัว (อ.2, อ.3, ป.1, ป.3-ป.6, ม.1-ม.3)
- Academic Lead Agent
- Lesson Plan Studio (TipTap editor + template 4 กลุ่มอายุ + Rubric builder)
- Task workflow (`draft → ai_review → human_review → approved`)
- Director Dashboard 6-card + 4-Division cards skeleton
- Membership UI: ผอ. เพิ่มครูใหม่ + กำหนด role

**Acceptance:** ครู 11 ชั้น login → ใช้ Classroom Agent ของตน. ผอ. สั่ง "ทำแผนการสอน" → ครูทุกชั้นได้ task

---

## 3. Phase 3 — Duty Log + Learning Observation (3-4 สัปดาห์)

- Migration V4-A: `daily_duty_schedules`, `daily_duty_logs`, `daily_duty_log_attachments`
- Migration V4-B: `learning_observation_*` (4 ตาราง)
- Duty schedule admin + teacher capture (7 duty types)
- Observation Officer mobile capture + rotation rule
- General Affairs + HR Dashboard
- Academic Dashboard widget

---

## 4. Phase 4 — Command Center + 4 Department Dashboards (3 สัปดาห์)

- Director Assistant Agent (sonnet-4-6)
- Command Center page: NL command → AI breakdown preview → multi-assign
- Approval routing engine
- Notifications (in-app bell)
- Evidence Center (upload → tag → link → search)
- Department Dashboards (4 ฝ่าย เต็มรูปแบบ)
- เริ่มต้องการ Redis + BullMQ ตอน AI breakdown ใช้เวลานาน — ใส่ตรงนี้

---

## 5. Phase 5 — PLC + SAR Pipeline (4 สัปดาห์)

ปลายภาคแรก — มี data 3 เดือนแล้ว pipeline จึงทำงานมีค่า

- [ ] Migration: `sar_standards` (school-configurable — ดู D-004), `sar_evidence_packages`, `sar_evidence_items`
- [ ] Migration: `plc_sessions`, `plc_topics`, `plc_action_plans`
- [ ] SAR standards admin UI (per school)
- [ ] PLC topic aggregator (จาก Reflection + Observation)
- [ ] PLC meeting recorder + AI summary (sonnet-4-6)
- [ ] SAR auto-mapping (Reflection → school's standards) ผ่าน RAG mini ของ school's standards
- [ ] AI Draft paragraphs สำหรับ SAR (opus-4-7, ใช้ครั้งเดียวต่อภาค)
- [ ] Annual Evidence Export (PDF + zip)

---

## 6. Phase 6 — Knowledge Base + RAG (3 สัปดาห์)

- [ ] อัปโหลดเอกสาร: หลักสูตร, SAR ปีก่อน, แผนพัฒนา, คู่มือจิตศึกษา, Active Learning guides
- [ ] Extract text: pdf-parse / officeparser
- [ ] OCR: ใช้ Claude vision (เลี่ยง Tesseract setup)
- [ ] Embedding via Voyage AI (รองรับใน Anthropic ecosystem) หรือ OpenAI embedding
- [ ] Vector store: pgvector ถ้าย้ายเป็น Postgres หรือใช้ Qdrant ใน docker (ตัดสินตอนทำ)
- [ ] RAG ใน prompt assembly: top-k chunks → inject เข้า system context

---

## 7. Phase 7 — Student Insight (4–5 สัปดาห์, ต้องระวัง PDPA)

- [ ] Consent table + workflow ผอ. อนุมัติ
- [ ] Migration: `students`, `student_observations`, `student_consents`
- [ ] บันทึกผลอ่าน/เขียน/คำนวณ
- [ ] Developmental grouping: ต้องช่วยเร่งด่วน / ต้องเสริม / ปกติ / ส่งเสริมพิเศษ (ห้ามคำว่า "อ่อน/แย่")
- [ ] แผนซ่อมเสริมรายบุคคล + เชื่อม PLC

---

## 8. Phase 8 — Area Office Layer (เมื่อมีโรงเรียนที่ 2)

- [ ] Area Dashboard, Risk Map
- [ ] Area Command Panel
- [ ] Network Dashboard
- [ ] Cross-school PLC + analytics

---

## 10. Architecture decisions (locked)

ดู `docs/decisions.md` สำหรับ rationale เต็ม. สรุป:

| Decision | Choice |
|---|---|
| D-001 Multi-tenant from day 1 | Yes (V2 schema) |
| D-002 Phase 1 goal | ครูใช้รายวัน — Reflection-First MVP |
| D-003 Architecture | Single Next.js full-stack (no monorepo, no NestJS, no separate AI Gateway) |
| D-004 SAR standards | School-configurable (no hardcoded framework) |
| D-005 AI Provider | Claude API only (haiku-4-5 default, sonnet-4-6 for review, opus-4-7 for synthesis) |

**Other supporting choices:**

| Area | Choice | Rationale |
|---|---|---|
| State mgmt | Zustand (เมื่อจำเป็น) | URL state + Server Components by default |
| Form | react-hook-form + Zod | type-safe |
| Charts | Recharts | เพียงพอ Phase 1-3 |
| Editor | TipTap (Phase 2+) | extensible, Thai-friendly |
| Auth | Lucia OR Auth.js (เลือกที่ D0-4) | depends on session model needs |
| File storage | local `uploads/` (dev) → R2/S3 (prod) | swap behind interface |
| Queue | BullMQ + Redis (Phase 4+) | ไม่ใช้ใน Phase 1-3 |
| Vector DB | TBD (Phase 6) | ตัดสินเมื่อมี doc upload จริง |
| i18n | Thai-only ก่อน | scope |

---

## 11. Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| ครูไม่ใช้เพราะกรอกยาก | ตาย | Reflection ต้อง 3–5 นาที, optional attachment, mobile-first |
| AI ตอบมั่ว / สร้างข้อมูลปลอม | ผลเสียต่อเด็ก | Human-in-the-loop บังคับ + system prompt ที่ห้ามชัดเจน + RAG เพื่อ ground ใน docs โรงเรียน |
| PDPA / ข้อมูลส่วนบุคคล | กฎหมาย | เก็บข้อมูลเฉพาะที่จำเป็น, consent table, ห้าม AI เปิดเผยเกินจำเป็น, anonymized analytics |
| โรงเรียนใหม่ join — schema ผูกเดียว | ต้อง rewrite | V2 schema แยก person/membership ตั้งแต่แรก |
| Local AI ช้า / ตอบไม่ดี | UX แย่ | Fallback ไป Cloud + cache คำตอบ + show "AI กำลังคิด..." |
| Storage ของคลิป/รูปบวม | infra | Limit ขนาด, transcode, lifecycle policy |
| ครูใหญ่อยากได้ทุกอย่างพร้อมกัน | scope creep | Phase strict, ทุก request ใหม่ผ่าน prd review |

---

## 12. Decision points — answered

| # | Question | Answer | Locked in |
|---|---|---|---|
| 1 | Cloud AI provider | Claude API (haiku/sonnet/opus by task) | D-005 |
| 2 | DB + Vector | MariaDB now, vector decision deferred to Phase 6 | D-003, D-005 |
| 3 | Authentication | Lucia or Auth.js (pick at D0-4) | D-003 |
| 4 | File storage | local `uploads/` in dev → R2/S3 in prod | D-003 |
| 5 | Deploy target | Single VPS with PM2/Docker, or Vercel | D-003 |
| 6 | Pilot school | "ทุกขนาด" — multi-tenant from start, pick 1 school + 3 teachers for Phase 1 pilot | D-001, D-002 |
