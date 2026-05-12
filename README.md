# SchoolNextgen — School AI Agent Command Center

[![CI](https://github.com/sooksun/schoolnextgen/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/sooksun/schoolnextgen/actions/workflows/ci.yml)

ระบบบริหารโรงเรียนด้วยทีม AI Agent หลายตัว ทำงานเป็นลำดับชั้นเหมือนโรงเรียนจริง:

```
Director (มนุษย์)
  └─ Director Assistant Agent
      └─ Academic Lead Agent
          ├─ Deputy Academic / Budget / HR / General Affairs (4 ฝ่าย — Phase 2)
          └─ Classroom Agents × 11   (K2, K3, G1–G6, M1–M3)
              └─ Teachers (มนุษย์ — ตัดสินใจสุดท้าย)
```

รองรับ **หลายโรงเรียน หลายเขตพื้นที่ หลายปีการศึกษา** ตั้งแต่วันแรก (multi-tenant)

---

## สถานะ

**Phase 1 — Reflection-First MVP ส่งมอบ ~94%.** อยู่ก่อนเริ่ม pilot กับครูคนแรก

- 11 Classroom Agents + 1 Academic Lead seeded แล้ว
- Reflection CRUD + AI streaming summarize + tag editor ใช้งานได้เต็มที่
- Daily reminder cron (15:30 จ-ศ Asia/Bangkok) + Resend email opt-in
- Director Dashboard 3 cards + tag cloud + teacher status table
- 164 tests, Docker image ~434 MB
- เอกสาร onboarding ครบชุดสำหรับ admin + ครู Pilot + demo session

ยังไม่ได้ทำใน Phase 1 (deferred → Phase 1.5/2): per-teacher insight widget (T-134), streaming latency debug widget (D-5), full Area/Year/Term ContextSwitcher (D-2)

---

## เอกสาร — อ่านตามลำดับนี้

**ก่อน deploy:**
1. [`docs/onboarding/admin-quickstart.md`](./docs/onboarding/admin-quickstart.md) — first-deploy guide สำหรับผู้ดูแลระบบ (30-45 นาที, zero → ครู Pilot login ได้)
2. [`docs/runbook.md`](./docs/runbook.md) — ops manual (backup / restore / rollback / pre-pilot checklist)

**เมื่อรับครู Pilot:**
3. [`docs/onboarding/first-session-demo-script.md`](./docs/onboarding/first-session-demo-script.md) — สคริปต์ 30-40 นาทีสำหรับ session แรกกับครู
4. [`docs/onboarding/teacher-cheatsheet.md`](./docs/onboarding/teacher-cheatsheet.md) — คู่มือ 5 นาทีสำหรับครู

**ทำความเข้าใจระบบ:**
5. [`prd.md`](./prd.md) — Product Requirements
6. [`plan.md`](./plan.md) — แผนเฟส (Phase 1-8) + acceptance criteria
7. [`task.md`](./task.md) — รายการ task (~94% Phase 1 ✓)
8. [`docs/architecture.md`](./docs/architecture.md) — system topology
9. [`docs/database-schema.md`](./docs/database-schema.md) — 22-table schema + indexes
10. [`docs/modules.md`](./docs/modules.md) — per-module specs (Reflection, Duty Log, Observation, SAR)
11. [`docs/decisions.md`](./docs/decisions.md) — locked architectural decisions (D-001..D-009)
12. [`docs/phase-1.5-backlog.md`](./docs/phase-1.5-backlog.md) — deferred items + trigger conditions
13. [`Thinking_make_prd.md`](./Thinking_make_prd.md) — เอกสารต้นฉบับ 4,996 บรรทัด (Thai)
14. [`CLAUDE.md`](./CLAUDE.md) — คู่มือสำหรับ Claude Code

---

## Tech Stack (locked — `docs/decisions.md`)

Solo developer + Claude Code. **Single Next.js full-stack app, ไม่ใช่ monorepo.**

| Layer        | Choice                                                |
|--------------|-------------------------------------------------------|
| Framework    | Next.js 16 (App Router, Server Actions, `proxy.ts`)   |
| Language     | TypeScript 5 + React 19                               |
| UI           | Tailwind v4 + shadcn/ui + next-themes                 |
| Forms        | useState + useTransition + Zod (rhf เก็บไว้ Phase 2) |
| ORM          | Prisma 6 (Prisma 7 rejected per D-007)                |
| DB           | MySQL 8 (Laragon dev, Docker prod)                    |
| Auth         | Copenhagen Book pattern (D-006) — argon2id, SHA-256 token, 30d TTL |
| AI           | `@anthropic-ai/sdk` direct — haiku-4-5 / sonnet-4-6 / opus-4-7 + prompt caching |
| Streaming    | `createStreamableValue` จาก `@ai-sdk/rsc` (D-008)     |
| File storage | Local disk (dev) → R2/S3 (production)                 |
| Email        | Resend (opt-in via `RESEND_API_KEY`, dry-run ถ้าไม่ตั้ง) |
| Errors       | Sentry (opt-in via `SENTRY_DSN`)                      |
| Cron         | `node-cron` in-process + `/api/cron/[job]` HTTP trigger |
| Tests        | Vitest 4 (164 tests, shared MySQL test DB)            |

**ไม่อยู่ใน stack (ยังไม่ทำ):** monorepo / NestJS / AI Gateway แยก / Ollama / Redis / BullMQ / pgvector / Qdrant / WebSocket. เพิ่มเมื่อมี concrete need

---

## Routes โดยสังเขป

```
/                          → redirect ไป /login หรือ /teacher ตาม auth state (ไม่มี landing page — T-005 skipped)
/login                     → email + password
/select-context            → เลือก membership ถ้ามีหลายโรงเรียน

/teacher                   → หน้าครู (streak + recent reflections + reminder banner)
/teacher/reflections       → timeline
/teacher/reflections/new   → ฟอร์มบันทึก
/teacher/reflections/[id]  → รายละเอียด + AI summary panel + attachments
/teacher/reflections/[id]/edit  → แก้ไข (D-6)

/school/dashboard          → ผอ. / รอง วช. dashboard

/api/health                → 200/503 + DB ping latency
/api/cron/[job]            → manual cron trigger (Bearer CRON_SECRET)
/api/uploads/[fileId]      → file serving with scope check
```

---

## Quick Start (dev)

```bash
pnpm install
cp .env.example .env.local        # then edit DATABASE_URL + ANTHROPIC_API_KEY
pnpm db:migrate                   # prisma migrate dev
pnpm db:seed                      # 1 school + 11 classrooms + 12 agents + 3 demo users
pnpm dev                          # http://localhost:3000
```

**Demo logins** (password `Pass1234!`):
- `teacher@demo.local` — ครู ป.2
- `director@demo.local` — ผอ.
- `deputy.academic@demo.local` — รอง วช.

**Production deploy:** ดู `docs/onboarding/admin-quickstart.md` — Docker + MySQL service + reverse proxy

---

## Commands

```bash
pnpm dev              # next dev
pnpm build            # next build (standalone output)
pnpm start            # next start
pnpm lint             # eslint
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest run (164 tests, ~30s)

pnpm db:generate      # prisma generate
pnpm db:migrate       # prisma migrate dev
pnpm db:reset         # destructive: migrate reset --force
pnpm db:seed          # tsx prisma/seed.ts (idempotent)
pnpm db:studio        # prisma studio
pnpm backup           # mysqldump → backups/snx-YYYY-MM-DD_HHMMSS.sql.gz
```

---

## Repo Layout

```
schoolnextgen/
├─ src/
│  ├─ app/                      Next.js App Router
│  │  ├─ (auth)/                login, select-context
│  │  ├─ (app)/                 protected routes
│  │  │   ├─ teacher/           teacher dashboard + reflection CRUD
│  │  │   └─ school/            director dashboard
│  │  └─ api/                   health, cron, uploads
│  ├─ components/               shadcn/ui + reflection/* + app-shell/*
│  ├─ lib/                      env, db, scope/can, date/thai, notify
│  ├─ server/
│  │  ├─ ai/                    Anthropic client + prompts + budget
│  │  ├─ auth/                  sessions (Copenhagen Book), rate-limit, password
│  │  ├─ cron/                  daily-reminder, cleanup-sessions
│  │  ├─ email/                 Resend (T-131)
│  │  ├─ evidence/              upload pipeline + MIME schema
│  │  ├─ reflection/            actions, queries, summarize
│  │  └─ tenant/                scope resolver, queries, actions
│  ├─ instrumentation.ts        Sentry (opt-in via SENTRY_DSN)
│  └─ proxy.ts                  Next 16 — CSRF Origin == Host check
├─ prisma/
│  ├─ schema.prisma             22 models + DailyReminderLog
│  ├─ migrations/               3 migrations (init + FK harden + reminder log)
│  └─ seed.ts                   idempotent
├─ tests/                       fixtures, setup, stubs
├─ docs/
│  ├─ onboarding/               admin-quickstart + teacher-cheatsheet + demo-script
│  ├─ architecture.md / database-schema.md / decisions.md / modules.md
│  ├─ runbook.md / phase-1.5-backlog.md
├─ scripts/backup.mjs           cross-platform mysqldump + rotation
├─ Dockerfile                   3-stage Alpine + Node 22
└─ docker-compose.yml           mysql + app (single replica)
```
