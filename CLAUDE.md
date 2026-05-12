# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: School AI Agent Command Center (SchoolNextgen)

Multi-tenant school administration platform built around a hierarchy of AI agents. One product, many schools, many education areas, many academic years/terms.

**Status:** Pre-code. The repository currently contains only design documents — no `package.json`, no `prisma`, no source tree yet. Phase 1 implementation has not started.

## Where the design lives

Read these before doing anything substantive. They are the source of truth, not assumed conventions.

- `docs/decisions.md` — **read first**. Locked architectural decisions (D-001 to D-005) with rationale. If you're tempted to do something it forbids (monorepo, Ollama, NestJS, hardcoded SAR standards), re-read it.
- `Thinking_make_prd.md` — the original 4,996-line thinking document. Long, Thai-language, but contains every requirement, schema decision, SQL migration, and UI brief that downstream documents are derived from. Use Grep to navigate (section headings like `## N.` or `N.N`).
- `prd.md` — consolidated product requirements.
- `plan.md` — phased implementation plan and target architecture.
- `task.md` — concrete task breakdown for Phase 0/1.
- `docs/architecture.md` — system topology, agent hierarchy, multi-tenant model.
- `docs/database-schema.md` — V2 schema (multi-school / multi-area / multi-year) and migrations V3 (Daily Reflection) and V4 (Duty Log + Learning Observation).
- `docs/modules.md` — module-by-module specs (Reflection, Duty Log, Learning Observation, SAR Evidence).

When the user asks for changes, check the relevant doc first — many "requirements" are already decided there and a contradiction usually means the doc needs updating, not the code.

## Architecture in one screen

Five-layer hierarchy. Each row commands the row below; each row reports to the row above:

```
Director (human)
  └─ Director Assistant Agent
      └─ Academic Lead Agent
          ├─ Deputy Academic Agent ─┐
          ├─ Deputy Budget Agent     │  4 division agents
          ├─ Deputy HR Agent         │  (วิชาการ / งบประมาณ / บุคคล / บริหารทั่วไป)
          ├─ Deputy General Affairs ─┘
          └─ Classroom Agents × 11   (K2, K3, G1–G6, M1–M3)
              └─ Teachers (human, final approval)
```

Multi-tenant hierarchy in the data model:

```
education_area_offices → school_networks → schools
                                              ├─ academic_years → academic_terms
                                              ├─ departments (the 4 divisions)
                                              └─ classrooms
```

Identity is **separated from role assignment**: `persons` (the human) ←→ `users` (login) ←→ `user_school_memberships` (this person's roles in this school, this year, this department). One person can hold multiple memberships across schools/years.

Agents have their own scope table (`agent_scope_assignments`) — an agent can be scoped to a classroom, department, school, network, area, or system-wide.

## Tech stack (locked — see `docs/decisions.md`)

Solo developer + Claude Code. Single Next.js full-stack app, not a monorepo.

| Layer        | Choice                                                |
|--------------|-------------------------------------------------------|
| Framework    | Next.js 15 (App Router, Server Actions, Route Handlers) |
| Language     | TypeScript                                            |
| UI           | Tailwind CSS + shadcn/ui + next-themes                |
| State        | Zustand (when client state grows; URL state by default) |
| Forms        | react-hook-form + Zod                                 |
| Charts       | Recharts                                              |
| ORM          | Prisma                                                |
| Database     | MariaDB 11.x (Laragon)                                |
| Auth         | Custom (Copenhagen Book pattern — D-006) — sessions in DB, SHA-256 token hash, argon2id passwords |
| AI           | `@anthropic-ai/sdk` direct (no separate gateway service) |
| File storage | Local disk in dev → R2/S3 in production               |
| Realtime     | SSE for AI streaming; polling for task status         |
| Theme        | Purple–blue–white gradient, full dark + light mode    |

**Explicitly NOT in stack (yet):** monorepo / NestJS / separate AI Gateway / Ollama / Redis / BullMQ / pgvector / Qdrant / WebSocket. These get added only when there's a concrete need — see `docs/decisions.md` for the trade-offs.

## Model selection rule

| Task | Model |
|---|---|
| Reflection summary + tagging (high volume) | `claude-haiku-4-5` |
| Lesson plan review, Command Center breakdown | `claude-sonnet-4-6` |
| PLC aggregation, SAR draft synthesis | `claude-opus-4-7` |

Use Anthropic prompt caching aggressively: system prompt + persona + RAG chunks should all be cacheable.

## Repository layout

Single app at the root:

```
schoolnextgen/                  ← repo root
├─ src/
│  ├─ app/                      Next.js App Router
│  │  ├─ (auth)/                login, select-context
│  │  ├─ (app)/                 protected routes
│  │  │   ├─ teacher/
│  │  │   ├─ school/
│  │  │   └─ agents/
│  │  └─ api/                   route handlers
│  ├─ components/               shadcn/ui + custom
│  ├─ lib/
│  │  ├─ ai/                    Anthropic client + prompt assembly
│  │  ├─ auth/
│  │  ├─ db/                    prisma client + helpers
│  │  └─ scope/                 membership resolver
│  └─ server/
│      ├─ actions/              server actions per module
│      └─ queries/              read queries
├─ prisma/                      schema.prisma + migrations + seed.ts
├─ public/
├─ uploads/                     local file storage (dev only — gitignored)
├─ docs/                        design docs
└─ docker-compose.yml           MariaDB only (Laragon also provides it)
```

## Commands

```bash
pnpm dev              # start Next.js dev server (http://localhost:3000)
pnpm build            # production build
pnpm start            # run production build
pnpm lint             # eslint
pnpm typecheck        # tsc --noEmit

# Prisma 6 (NOT 7 — see D-007 in docs/decisions.md)
pnpm db:generate      # prisma generate
pnpm db:migrate       # prisma migrate dev
pnpm db:reset         # prisma migrate reset --force (DESTRUCTIVE)
pnpm db:seed          # tsx prisma/seed.ts
pnpm db:studio        # prisma studio
```

`.env.local` is gitignored. `.env` exists only because Prisma CLI reads it directly — keep `DATABASE_URL` synced between the two.

## Demo logins (after `pnpm db:seed`)

Password is `Pass1234!` for all three:

- `teacher@demo.local` → role `teacher`, classroom ป.2/1
- `director@demo.local` → role `director`
- `deputy.academic@demo.local` → role `deputy_academic`

## Key Next.js 16 quirks already handled

- `middleware.ts` deprecated → `src/proxy.ts` exporting `proxy()` (D-009).
- `experimental.serverActions.bodySizeLimit` is the only place this option lives (not top-level).
- Server Actions are stable in Next 16 but the body-size config is still under `experimental`.

## Anthropic + streaming gotchas

- `createStreamableValue` imports from `@ai-sdk/rsc` in `ai` v6 — the old `ai/rsc` subpath was removed.
- Prompt caching (`cache_control: { type: 'ephemeral' }`) only saves money when the cached block ≥ 1024 tokens (haiku/sonnet). Persona prompts in `src/server/ai/prompts/` are sized to exceed this.
- Cache write costs 1.25× input; cache read costs 0.10× input. Steady-state usage saves big; sporadic usage costs more than no caching.

## Key design rules — do not violate

These come from `Thinking_make_prd.md` and are non-negotiable:

1. **Human-in-the-loop for anything that leaves the system.** AI may draft, suggest, summarize. AI must not approve official documents, send reports outside, or finalize SAR content without a human signoff. Every approval table (`approval_routes`) exists for this reason.
2. **AI never labels children.** No "this child is weak / has no potential" language. Always developmental/strength-based framing.
3. **Identity is separate from role.** Do not add `school_id` directly to user-facing tables when a membership table would do. The whole reason `persons`/`user_school_memberships` exist is to let one teacher work across schools/years.
4. **Scope every record.** Tasks, agents, dashboards all carry `area_office_id` / `school_id` / `academic_year_id` / `academic_term_id` / `department_id` / `classroom_id` as appropriate. Permission checks read from memberships, not from a global role.
5. **Attachments are always optional.** Reflection, Duty Log, and Observation must accept text-only submissions — the system must not become a burden that requires media every time.
6. **Thai-first UX.** All teacher- and director-facing UI text is Thai by default. Technical/admin pages may be English.

## Working conventions when the project is live

- Database changes go through Prisma migrations. The hand-written SQL in `docs/database-schema.md` is the reference design — translate it to Prisma, do not run the raw SQL directly against a Prisma-managed DB.
- Agent system prompts live in the `agents` table (`system_prompt` column), not hardcoded in TypeScript. Treat them as data.
- Status enums (task status, evidence status, SAR status) are defined in the PRD and DB — keep them consistent across frontend, backend, and DB. When adding a state, update all three plus `docs/modules.md`.
- New modules should follow the existing pattern: dedicated tables, scope columns, link to `evidence_files` and `tasks`, optional `ai_summary` / `ai_tags`, optional `sar_mapping`.

## Operating environment notes

- Working on Windows 11 via Laragon (MariaDB ships with it). Use Unix path syntax in scripts; PowerShell is the default shell but bash via Git Bash / WSL is fine.
- The user works with Claude Code (terminal) + Cursor AI side-by-side. Only one tool should edit a file at a time — finish your edits before declaring done.
- The user writes in Thai. Respond in Thai when they do.
