# SchoolNextgen — School AI Agent Command Center

ระบบบริหารโรงเรียนด้วยทีม AI Agent หลายตัว ทำงานเป็นลำดับชั้นเหมือนโรงเรียนจริง:
ผอ. → ผู้ช่วย ผอ. (AI) → หัวหน้าวิชาการ (AI) → รอง ผอ. 4 ฝ่าย (AI) → AI ผู้ช่วยครูประจำชั้น อ.2 – ม.3 → ครู (มนุษย์)

รองรับ **หลายโรงเรียน หลายเขตพื้นที่ หลายปีการศึกษา**

---

## สถานะ

**Pre-implementation.** เก็บเอกสารออกแบบไว้ในซอร์ส ยังไม่ได้ scaffold โค้ดจริง

อ่านลำดับนี้:

1. [`prd.md`](./prd.md) — Product Requirements (สรุปจากเอกสารคิด 10 รอบ)
2. [`plan.md`](./plan.md) — แผนเฟสและ tech stack
3. [`task.md`](./task.md) — งานที่ต้องทำเรียงเป็นรายการ checklist
4. [`docs/architecture.md`](./docs/architecture.md) — ภาพรวมสถาปัตยกรรม
5. [`docs/database-schema.md`](./docs/database-schema.md) — ฐานข้อมูล V2/V3/V4
6. [`docs/modules.md`](./docs/modules.md) — Module specs (Reflection, Duty Log, Observation, SAR)
7. [`Thinking_make_prd.md`](./Thinking_make_prd.md) — เอกสารต้นฉบับ (4,996 บรรทัด)
8. [`CLAUDE.md`](./CLAUDE.md) — คู่มือสำหรับ Claude Code

---

## Tech Stack (planned)

- **Frontend:** Next.js 15 + TypeScript + Tailwind + shadcn/ui (theme ม่วง–ฟ้า–ขาว, dark mode)
- **Backend:** NestJS + Prisma
- **DB:** MariaDB 11.x
- **Queue/Cache:** Redis + BullMQ
- **AI:** Ollama (local) + Cloud API (Claude / Typhoon) + pgvector หรือ Qdrant สำหรับ RAG
- **Realtime:** WebSocket

---

## Quick Start (เมื่อ scaffold แล้ว)

```bash
# ยังใช้ไม่ได้ — รอ Phase 0/1 ใน plan.md
pnpm install
docker compose up -d        # mariadb + redis + ollama
pnpm db:migrate
pnpm db:seed
pnpm dev                    # start web + api + ai-gateway
```

---

## โครงสร้าง Repo (planned)

```
schoolnextgen/
├─ apps/web              Next.js frontend
├─ apps/api              NestJS backend
├─ apps/ai-gateway       AI routing
├─ packages/db           Prisma schema + migrations + seed
├─ packages/shared       TS types + Zod schemas
├─ packages/ui           shadcn/ui components
└─ docs/                 architecture / schema / modules
```
