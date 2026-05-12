# Task Breakdown — SchoolNextgen

ปรับใหม่หลัง D-001..D-005 — single Next.js app + Claude API + Reflection-First MVP

Legend: 🟢 done · 🟡 partial · ⚪ deferred to Phase 1.5+ · ❌ skipped (deliberate) · 🔵 blocked
Last audit: **2026-05-12** — 45/48 Phase 0+1 tasks ≈ 94% complete (T-130/T-131 shipped post-audit)

---

## Phase 0 — Setup ✅ Complete

### D0-1 Init Next.js
- [x] 🟢 T-001 `create-next-app@latest` ที่ root (TS, App Router, Tailwind, src/, ESLint, import alias `@/*`, pnpm)
- [x] 🟢 T-002 ติดตั้ง shadcn/ui (16 components: button, card, input, textarea, label, sheet, dialog, popover, calendar, select, alert-dialog, dropdown-menu, badge, separator, skeleton, sonner)
- [x] 🟢 T-003 ติดตั้ง next-themes + ThemeProvider + ThemeToggle component
- [x] 🟢 T-004 globals.css theme tokens (violet-600 primary, sky-500 secondary, fuchsia-500 accent) + OKLCH palette
- [ ] ❌ T-005 หน้า landing เล็ก ๆ — **skipped:** `/` redirects ไป `/login` หรือ `/teacher` แทน ตาม auth state. theme toggle ใช้งานได้ผ่าน TopBar
- [x] 🟢 T-006 `.gitignore` + `.env.example` + `.env`

### D0-2 Prisma + MySQL (D-007: MySQL ไม่ใช่ MariaDB)
- [x] 🟢 T-010 สร้าง DB `school_agent_db`
- [x] 🟢 T-011 ติดตั้ง prisma 6.19.3 + @prisma/client
- [x] 🟢 T-012 `.env.local` + `.env` DATABASE_URL
- [x] 🟢 T-013 ~~7 ตารางแรก~~ → **22 ตาราง** ทั้งหมดของ Phase 1 schema
- [x] 🟢 T-014 `pnpm db:migrate` + 2 migrations applied (init + harden_phase1_fk_actions)

### D0-3 Anthropic SDK
- [x] 🟢 T-020 ติดตั้ง `@anthropic-ai/sdk` + key
- [x] 🟢 T-021 `src/server/ai/anthropic.ts` client singleton + retry
- [ ] ❌ T-022 `/api/test-ai` route — **skipped:** ไปทำ `summarizeReflectionAction` ตัวจริงเลย
- [ ] ❌ T-023 `/dev/test-ai` demo page — **skipped:** ไม่จำเป็น เมื่อหน้า reflection detail มี streaming AI panel จริงอยู่แล้ว

### D0-4 Auth + Protected Route
- [x] 🟢 T-030 ~~Lucia~~ → **Copenhagen Book pattern** (D-006 — Lucia archived ม.ค. 2025)
- [x] 🟢 T-031 Session table + migrate ผ่าน schema
- [x] 🟢 T-032 `/login` page + email/password form (uses `useActionState` + `signInAction`)
- [x] 🟢 T-033 `proxy.ts` (CSRF check) + `(app)/layout.tsx` (scope-based redirect)
- [x] 🟢 T-034 Logout action

### D0-5 Seed + Skeleton
- [x] 🟢 T-040 Prisma seed: 1 area + 1 school + 1 year + 4 departments + 1 ป.2 classroom + 3 users + 3 memberships + 8 roles
- [x] 🟢 T-041 Agent + scope assignment seed (ป.2 Classroom Agent + Thai persona ≥1024 tokens for prompt-caching)
- [x] 🟢 T-042 `/teacher` page — ชื่อ, ห้อง, CTA ไป Reflection
- [x] 🟢 T-043 ContextSwitcher component (cookie-driven, multi-membership picker)

---

## Phase 1 — Reflection-First MVP

### Week 1 — Foundation
- [x] 🟢 T-101 App Shell: Sidebar + TopBar + UserMenu + ThemeToggle + (Notification placeholder)
- [x] 🟢 T-102 Mobile responsive (Sheet drawer ≤ 768px, container max-w-4xl/6xl)
- [x] 🟢 T-103 Migration: academic_terms, departments (4 ฝ่าย seed), education_area_offices, school_networks — รวมใน init migration
- [ ] 🟡 T-104 ContextSwitcher — **partial:** school-only switching (Area/Year/Term เป็น display-only). **Audit D-2:** deferred Phase 8 (มี user request หลายโรงเรียนเมื่อไร ค่อยขยาย)
- [x] 🟢 T-105 `src/lib/scope/can.ts` + `src/lib/scope/types.ts` (D-1 fix) — 6 helpers (viewReflection, createReflection, editReflection, summarizeReflection, deleteReflection, viewSchoolDashboard, viewEvidenceFile) + 30 tests

### Week 2 — Reflection Quick Form
- [x] 🟢 T-110 Migration: teacher_daily_reflections + 3 child tables (attachments, ai_summaries, sar_mappings)
- [x] 🟢 T-111 `/teacher/reflections/new` mobile-first form
- [ ] 🟡 T-112 ~~react-hook-form~~ — **partial:** ใช้ `useState + useTransition` + Zod validation **ฝั่ง server**. ทำงานเท่ากัน ลด client bundle ~10KB. ถ้าฟอร์มซับซ้อนขึ้น (Phase 2 Lesson Plan) ค่อยใส่ rhf
- [x] 🟢 T-113 File upload — local disk `uploads/{schoolId}/{academicYearLabel}/{userId}/{uuid}.{ext}` + MIME allowlist + per-type size cap + path traversal guard
- [ ] 🟡 T-114 Preview component — **partial:** แสดง file icon + title + size + clickable link ไป `/api/uploads/[fileId]` (ไม่มี inline thumbnail/video player) — ดูได้แต่ผ่าน external open
- [x] 🟢 T-115 Server action `createReflectionAction` + `updateReflectionAction` + `deleteReflectionAction`
- [x] 🟢 T-116 `/teacher/reflections` timeline (grouped by date, with status badges, attachment counts)
- [x] 🟢 T-117 `/teacher/reflections/[id]` detail + `/edit` (D-6 — Phase 1.5 item shipped)
- [x] 🟢 T-118 EmptyState components — `src/components/ui-state/`

### Week 3 — AI Summary + Tagging
- [x] 🟢 T-120 `src/server/ai/prompts/summarize-reflection.ts` — instruction + buildReflectionUserMessage + parseSummaryResponse (JSON-tolerant)
- [x] 🟢 T-121 `summarizeReflectionAction` — Server Action + `createStreamableValue` from `@ai-sdk/rsc`
- [x] 🟢 T-122 Streaming UI in `<AiSummaryPanel>` — uses `readStreamableValue` consumer loop
- [x] 🟢 T-123 Saves `reflection_ai_summaries` + `ai_run_logs` (tokens, cost, latency) in transaction
- [x] 🟢 T-124 Confirm button → `confirmAiSummaryAction` → status `teacher_confirmed`
- [x] 🟢 T-125 **Tag chip UI with X-to-remove + "เพิ่ม tag เอง" input** (D-4 shipped)
- [x] 🟢 T-126 Anthropic prompt caching — `cache_control: ephemeral` on persona + instruction; usage tokens logged in `ai_run_logs.promptCacheReadTokens / promptCacheCreationTokens`

### Week 4 — Habit Loop + Minimal Director View
- [x] 🟢 T-130 Daily reminder cron 15:30 Asia/Bangkok Mon-Fri — `node-cron` + `JOBS` registry in `src/server/cron/index.ts`, manual trigger at `/api/cron/daily-reminder` (Bearer CRON_SECRET), idempotent via `daily_reminder_logs` UNIQUE(school_id, run_date, job_kind)
- [x] 🟢 T-131 Resend (email) — wired at `// T-131 hook` in `daily-reminder.ts`. Missing `RESEND_API_KEY` → dry-run mode (logs `emailMode: 'dry_run'`, no network calls). Per-recipient failures captured in `details.sendFailures`, never crash the cron
- [x] 🟢 T-132 Streak calc — `getTeacherStreak()` in `queries.ts` (skips weekends, ≤ 60 day window)
- [x] 🟢 T-133 `<StreakIndicator>` component (active + zero-state)
- [ ] 🟡 T-134 InsightFeedback — **partial:** Director Dashboard มี tag cloud + counts ครบ แต่ "ส่งให้ครู" widget (รายบุคคล) ยังไม่มี
- [x] 🟢 T-135 `/school/dashboard` minimal Director view
- [x] 🟢 T-136 Card 1: ครูบันทึกวันนี้ / ทั้งหมด + จำนวนครู
- [x] 🟢 T-137 Card 2: จำนวน reflection ภาคนี้ + breakdown by status (ครูยืนยัน / ร่าง)
- [x] 🟢 T-138 Card 3: Top tags chip; ส่วน Tag cloud เต็มรูป weighted-size รายเดือน
- [x] 🟢 T-139 Table: รายชื่อครู + สถานะวันนี้ (อวตาร์, ห้อง, รายวิชา, เวลา)

### Week 5 — Polish + Pilot
- [ ] ⚪ T-140 Bug bash จาก pilot teacher feedback — **blocks on**: ต้องมีครู pilot ใช้งานจริง
- [ ] ⚪ T-141 Mobile UX iteration — **blocks on**: pilot feedback
- [x] 🟢 T-142 Deploy strategy — **Docker + docker-compose** (Dockerfile multi-stage, mysql + app services, healthchecks, named volumes)
- [ ] ⚪ T-143 Setup production DB — **manual deploy step** (runbook §1); migration scripts ready
- [ ] ⚪ T-144 คู่มือสั้น PDF + Loom video — **manual deliverable**
- [ ] ⚪ T-145 Onboard ครู 3 คนแรก — **manual deliverable**
- [ ] 🟡 T-146 Setup metrics — **partial:** Sentry wired (opt-in), `ai_run_logs` table has token+cost+latency; no dashboard for metrics (Phase 4 work)

---

## งานที่ทำ "เกิน" task list เดิม (จาก review/audit passes)

ทำเข้าไปแล้วแต่ไม่ได้ track ในรายการเดิม:

### Code review fixes (B-1 ถึง B-4 จาก `/code-reviewer`)
- 🟢 Login rate limit (in-memory IP+email buckets)
- 🟢 Argon2 dummy hash (timing-attack defense)
- 🟢 FK hardening (AiConversation/Agent → Restrict, fileSizeBytes BigInt→Int)
- 🟢 AI token budget enforcement per agent (`assertWithinAiBudget`)

### Test suite (`/test-engineer`)
- 🟢 **162 automated tests** in 14 files: permission boundary, date math, evidence MIME/size, AI parser, sessions crypto, reflection CRUD integration, scope resolution, upload happy/error paths, sessions expiry/refresh, cross-school isolation, AI streaming (Anthropic mock), rate limit, password, budget

### Deploy artifacts (`/release-readiness`)
- 🟢 Dockerfile (multi-stage, Alpine + Node 22, non-root user, HEALTHCHECK)
- 🟢 `.dockerignore` + `docker-compose.yml` (mysql + app, healthchecks, named volumes)
- 🟢 `/api/health` endpoint (200/503, db ping, version, uptime)
- 🟢 `scripts/backup.mjs` (mysqldump + gzip + rotation)
- 🟢 Sentry instrumentation (opt-in, scrubs PII, filters user-facing ActionError codes)
- 🟢 `docs/runbook.md` (deploy / backup / restore / rollback / pre-pilot checklist / Sentry)

### Git / CI (2026-05-12)
- 🟢 GitHub repo: <https://github.com/sooksun/schoolnextgen> (public, HTTPS via gh token)
- 🟢 `.github/workflows/ci.yml` — typecheck + lint + 164 tests on push/PR to main; MySQL 8 service container; ~1m20s per run
- 🟢 CI badge in README, green as of `696f320`
- 🟢 ESLint config: `^_` prefix honors intentionally-unused params; `coverage/**` globally ignored — suite at 0 errors, 0 warnings
- ⏳ Watch item: GitHub deprecating Node 20 actions (Q2 2026) — `actions/checkout`, `setup-node`, `pnpm/action-setup` will need version bump or `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` before 2026-06-02

### D-6 Edit reflection page (`/frontend-implementer` audit)
- 🟢 `/teacher/reflections/[id]/edit` page + permission gates + ReflectionForm reflectionId-mode

### Architecture clean-ups
- 🟢 D-1: `Scope` type moved to `lib/scope/types.ts` (fixed lib→server import direction)
- 🟢 D-3: Extracted `getPersonDisplayName()` helper (layout no longer reaches into prisma directly)

### Documentation
- 🟢 `docs/decisions.md` — D-001 to D-009 with rationale
- 🟢 `docs/architecture.md` (high-level topology)
- 🟢 `docs/database-schema.md` (full SQL reference)
- 🟢 `docs/modules.md` (per-module specs)
- 🟢 `docs/phase-1.5-backlog.md` (deferred items with trigger conditions)
- 🟢 `docs/runbook.md` (ops manual)

---

## ที่เหลือใน Phase 1 — สรุปสั้น

**6 tasks pending** out of 48:
- 2 ❌ `T-022`, `T-023` — `/dev/test-ai` dev playground; **deliberately skipped** ใช้ Reflection ตัวจริงแทน
- 2 ⚪ `T-134` (partial), `T-146` (partial) — Phase 1.5 features (per-teacher insight widget + metrics dashboard)
- 5 ⚪ `T-140`, `T-141`, `T-143`, `T-144`, `T-145` — **manual pilot execution work** ไม่ใช่ coding

**Coding work เหลือ ~0** สำหรับ Phase 1 acceptance. ที่เหลือคือ **pilot execution + Phase 1.5 backlog items**.

---

## Phase 1.5 — ดูใน docs/phase-1.5-backlog.md

ลำดับความสำคัญตาม trigger likelihood:
1. ~~D-6 Edit-reflection page~~ ✅ ส่งมอบแล้ว 2026-05-12
2. ~~T-130 Daily reminder cron~~ ✅ ส่งมอบแล้ว 2026-05-12
3. ~~T-131 Resend email~~ ✅ ส่งมอบแล้ว 2026-05-12
4. ~~D-3 prisma in layout~~ ✅ ส่งมอบแล้ว 2026-05-12
5. D-5 Streaming latency widget (รอ pilot feedback)
6. D-2 Full Area/Year/Term ContextSwitcher (รอ Phase 8 demand)
7. T-134 InsightFeedback widget สำหรับครู (paused — resume only if pilot teacher asks for "what's working" signal)
8. T-146 Metrics dashboard (AI cost, % บันทึก, error rate)

---

## Phase 2-8 — ดูใน plan.md

Outline:
- **Phase 2** (4 wk): ขยายเป็น 11 Classroom Agents + Academic Lead + Lesson Plan Studio + Task workflow + Director Dashboard 4-Division
- **Phase 3** (3-4 wk): Duty Log + Learning Observation
- **Phase 4** (3 wk): Command Center + 4 Department Dashboards เต็มรูป + Redis/BullMQ + Metrics dashboard
- **Phase 5** (4 wk): PLC + SAR Pipeline (เริ่มมี data 1 ภาคแล้ว)
- **Phase 6** (3 wk): Knowledge Base + RAG (เมื่อโรงเรียน upload docs จริง)
- **Phase 7** (4-5 wk): Student Insight (PDPA-strict)
- **Phase 8**: Area Office layer + full ContextSwitcher (เมื่อมีโรงเรียนที่ 2)

---

## Backlog (ยังไม่จัดเฟส)

- Mobile native app (React Native หรือ Capacitor) — เริ่มจาก mobile web ก่อน
- Parent portal — privacy strict
- Offline draft mode (PWA + IndexedDB)
- i18n (อังกฤษ)
- Plugin / webhook เชื่อม DMC / SGS / e-Office เขต
- Voice input สำหรับครู (Whisper)
- **Paperclip** concept — ต้องการ definition จาก ผอ. ก่อน (3 สมมติฐานใน chat 2026-05-12: tool-binding / suggestion-pinning / cross-agent handoff)

---

## ขั้นต่อไป

โค้ดสำหรับ Phase 1 ปิดแล้ว. ขั้นต่อไปไม่ใช่งาน coding — เป็น **organizational/pilot**:

1. **เลือก pilot school + 1-3 ครู** ที่ยินดีลองใช้
2. **Sign up Sentry** (free tier 5k errors/mo) → set `SENTRY_DSN` ใน `.env`
3. **เตรียม VPS หรือ Vercel target** → ทำตาม `docs/runbook.md` §1
4. **Replace `ANTHROPIC_API_KEY` placeholder** ด้วย key จริง
5. **Set `Agent.monthlyTokenBudget`** สำหรับ Classroom Agent (~50,000 tokens/agent/month for haiku — เผื่อ ~30 reflections/teacher/month)
6. **Rotate demo passwords** จาก `Pass1234!` → ของจริง
7. **Walk pre-pilot checklist** ใน `docs/runbook.md` §8

ถ้า coding ต่อ — เริ่ม Phase 1.5 ตาม `docs/phase-1.5-backlog.md` priority order
