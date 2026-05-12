# Phase 1.5 Backlog

Items deferred from Phase 1 audit (`/frontend-implementer` audit pass, 2026-05-12).
Each has an explicit trigger condition — pull from this list only when the trigger fires.

Ordering is **trigger likelihood**, highest first.

---

## ~~1. D-6 — Edit-reflection page~~ ✅ DONE (2026-05-12)

Shipped. `<ReflectionForm>` extended with `reflectionId` prop (switches to `updateReflectionAction`); new edit route at `/teacher/reflections/[id]/edit`; conditional "แก้ไข" button on detail page gated by `can.editReflection`.

**Watch item:** editing a `teacher_confirmed` reflection currently leaves status unchanged — the AI summary can go stale. Add status-revert logic if pilot teachers find this confusing.

## ~~T-131 — Resend email reminder~~ ✅ DONE (2026-05-12)

Wired at the `// T-131 hook` in `src/server/cron/daily-reminder.ts`. Opt-in via `RESEND_API_KEY`:
- Missing key → dry-run mode (logs `emailMode: 'dry_run'`, no network calls)
- Key set → sends Thai-language reminder per missing teacher; counts increment `notifications_sent`
- Per-recipient failures captured in `details.sendFailures` JSON, never crash the cron

Files: `src/server/email/resend-client.ts`, `src/server/email/send-reminder.ts`, +10 tests (180 total).

**Pilot day-1 setup:** sign up at resend.com → add `RESEND_API_KEY` to `.env` → restart docker → daily-reminder cron emails missing teachers at 15:30 Mon-Fri automatically.

---

## 2. D-5 — Streaming latency debug widget

**Status:** Not started. Per-token re-render in `<AiSummaryPanel>` is unthrottled today.
**Effort:** 30-45 min for the widget; ~15 min for the throttle if data warrants.
**Trigger:** Pilot teacher reports "AI สรุปกระตุก" OR widget shows > 100ms inter-token gap on low-end devices.

**Approach (do widget FIRST, throttle ONLY IF):**
1. Add a tiny dev-only widget (gated by `process.env.NODE_ENV === 'development'`) inside `<AiSummaryPanel>` that shows:
   - Tokens received
   - Time to first token (TTFT)
   - Tokens/second (rolling)
   - Total streaming duration
2. Ship to pilot; collect real numbers from teacher Chromebooks
3. Only add `requestAnimationFrame` throttle if jank is observed; otherwise the data tells us nothing needs fixing

**Why this order:** premature throttling adds complexity without evidence. The widget is cheap insurance.

---

## 3. D-3 — `prisma` in `app/(app)/layout.tsx`

**Status:** ✅ **DONE** (2026-05-12). Extracted to `getPersonDisplayName(personId)` in `src/server/tenant/queries.ts`. Layout now goes through the tenant module's public surface.

---

## 4. D-2 — Full Area/Year/Term ContextSwitcher

**Status:** Not started, **don't pre-build**.
**Effort:** 3-5 hours (UI) + design pass (API depends on multi-school requirements).
**Trigger:** Phase 8 — when a second school onboards OR when a teacher needs to browse last year's archives.

**Why deferred:** The Switcher's API shape (whether year selection is independent of school, whether term defaults from current, etc.) depends on real multi-school workflows we haven't seen. Pre-building will likely guess wrong.

**Current state covers Phase 1:** ContextSwitcher displays year + term as read-only (`current.academicYearLabel`, `current.academicTermName`) and only switches schools.

---

## 5. Paperclip integration evaluation (Phase 2 trigger)

**Status:** Deferred. Clarified 2026-05-12 — `Paperclip` in `Thinking_make_prd.md` refers to https://github.com/paperclipai/paperclip, a multi-agent orchestration control plane (companies/agents/budgets/heartbeats, Node + PG + React, MIT).

**Original design intent:** Source doc lines 1406, 1432, 1980 envisioned SchoolNextgen integrating with a running Paperclip instance via a `PaperclipMapping` table (`internal_agent_id ↔ paperclip_agent_id`) + a `/settings/paperclip` admin page.

**Effort:** 3-5 days for "sync mode" (loose coupling), 1-2 weeks for "replace runtime" (Paperclip becomes the agent executor).

**Trigger:** Phase 2 boundary — when we ship 13 agents (11 Classroom + Academic Lead + Director Assistant). Phase 1 has 1 agent → nothing to coordinate.

**Re-evaluation checklist (act when 2+ check):**
- [ ] Paperclip has >6 months of production stories?
- [ ] We have ≥ 3 agents needing cross-coordination (Director Assistant → Academic Lead → Classroom Agent handoffs)?
- [ ] Pilot data shows our in-house `Agent` + `ai_run_logs` operational burden is too high?
- [ ] A multi-school SchoolNextgen deployment exists where "single pane of glass" matters?

**What we already overlap with Paperclip:**
- `Agent` + `monthlyTokenBudget` ≈ Paperclip's agent + budget
- `AgentScopeAssignment` ≈ Paperclip's role/company assignment
- `ai_run_logs` ≈ Paperclip's heartbeat audit
- `assertWithinAiBudget` ≈ Paperclip's cost guardrail
- `node-cron` + `JOBS` registry ≈ Paperclip's scheduler

So if/when we adopt Paperclip, migration = "expose what already exists" rather than "build new concepts."

**Don't pre-build PaperclipMapping table now** — schema can be added per migration in the day it's actually needed.

---

## Out of scope for Phase 1.5 (Phase 2+)

These came up in code review but are larger than Phase 1.5:

- **H-1** Magic-number MIME sniff (file-type lib + tests) — Phase 2 security pass
- **H-2** Orphan file cleanup on upload failure — Phase 2
- **H-5** Original filename PII leak in evidence display — Phase 2
- **M-7** Centralize status constants — bundles with task workflow expansion
- **M-3** `reflection_tags` junction table — kicks in at ~10k reflections

---

## Process note

Don't add items to this doc without a trigger condition. "Maybe nice to have" → drop it. The discipline of writing a trigger forces honest prioritization.
