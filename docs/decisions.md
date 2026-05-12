# Architectural Decisions

บันทึกการตัดสินใจสถาปัตยกรรม + เหตุผล. เปลี่ยนได้แต่ต้องเข้าใจ trade-off เดิม

**Date locked:** 2026-05-11
**Decided by:** ครูใหญ่ (solo developer + Claude Code)

---

## D-001 — รองรับโรงเรียนทุกขนาด

**Decision:** Multi-tenant architecture ตั้งแต่ Phase 1, ไม่มี single-tenant fast track

**Why:**
- ครูใหญ่ระบุชัดว่า target ทุกขนาด (1 ห้องถึง 30+ ห้อง)
- V2 schema (persons / memberships / scope) รองรับอยู่แล้ว ไม่ต้องเขียนใหม่ภายหลัง
- การเริ่มแบบ single-tenant แล้ว migrate ภายหลัง = rewrite ครึ่งระบบ

**Implications:**
- ทุก operational table มี `school_id` ตั้งแต่แรก
- UI ต้อง context switcher (Area / School / Year / Term) แม้ pilot จะมี 1 โรงเรียน
- Permission check ต้องผ่าน membership resolver ทุกครั้ง — ห้าม shortcut

**Trade-off ที่รับ:** Phase 1 หนักขึ้น ~1 สัปดาห์ แต่ประหยัด rework 1 เดือนภายหลัง

---

## D-002 — Goal Phase 1 = ครูใช้รายวัน (ไม่ใช่ feature complete)

**Decision:** Reflection-First MVP. ครู 3 คนใช้รายวัน ≥ 4 สัปดาห์ติด คือ definition of done ของ Phase 1

**Why:**
- ครูใหญ่ระบุ goal 3 เดือนแรก = ครูใช้รายวัน
- ระบบโรงเรียนล้มเหลวเพราะ "ครูไม่ใช้" มากกว่า "feature ไม่ครบ"
- ถ้า Reflection ไม่ flow → Dashboard ว่าง → SAR pipeline ว่าง → ระบบทั้งหมดตาย

**Scope ที่ตัดออกจาก Phase 1 เดิม:**
- ❌ Lesson Plan Studio (ย้ายไป Phase 2)
- ❌ Task Board เต็มรูป (เริ่มเฉพาะ reflection lifecycle)
- ❌ Director Dashboard 4-Division (เริ่ม minimal)
- ❌ 11 Classroom Agents (เริ่ม 1 agent — ป.2 หรือชั้นที่มีครู pilot)

**Scope ที่อยู่ใน Phase 1 ใหม่:**
- Identity + Tenant + Membership
- 1 Classroom Agent + Reflection module เต็มรูป
- AI Summary + Tagging (streaming จาก Claude API)
- Habit loop UI (streak, daily reminder, insight feedback)
- Minimal Director view (รายชื่อครู + สถานะวันนี้)

**Trade-off ที่รับ:** Demo ตอน Phase 1 ไม่ "ตื่นเต้น" สำหรับ ผอ. มากเท่าเดิม — แต่ครูใช้จริง → ภาค 2 มี data จริงให้ ผอ. ดู

---

## D-003 — Single Next.js App (ไม่ใช่ monorepo)

**Decision:** Next.js 15 full-stack เดียว. ไม่ทำ monorepo, ไม่แยก NestJS API, ไม่แยก AI Gateway

**Why:**
- Solo developer + Claude Code คนเดียว
- monorepo + 3 apps = 3 ครั้งของ infra/deploy/CI/dependency mgmt
- Next.js 15 Server Actions + Route Handlers ครอบคลุม use case ใน Phase 1-5 ทั้งหมด
- โรงเรียนเล็กไม่ต้อง microservice — แค่ web app ที่ทำงานได้

**โครงสร้าง:**
```
schoolnextgen/                      ← root
├─ src/app/                         Next.js App Router
├─ src/components/                  shadcn/ui + custom
├─ src/lib/                         ai/, auth/, db/, scope/
├─ src/server/                      actions/, queries/
├─ prisma/                          schema.prisma + migrations + seed
└─ docs/                            existing design docs
```

**เมื่อไหร่ค่อย split:**
- เมื่อมี dev คนที่ 2 เข้าทีม → แยก `apps/web` กับ `packages/db`
- เมื่อ AI worker ต้องเป็น background job ที่ทำงานนานหลายนาที → แยก worker service
- เมื่อมี mobile app native → แยก `packages/shared` สำหรับ types

**Trade-off ที่รับ:** ภายหลัง refactor monorepo จะใช้เวลา 1-2 สัปดาห์ แต่ปัจจุบันประหยัด 4-6 สัปดาห์ของ overhead

---

## D-004 — SAR Standards = School-Configurable (ไม่ hardcode)

**Decision:** ตาราง `sar_standards` ให้แต่ละโรงเรียนกำหนดเอง. ไม่ seed กรอบ สพฐ./สมศ. ตายตัว

**Why:**
- ครูใหญ่ระบุ SAR = ของโรงเรียน ไม่ใช่กรอบกลาง
- โรงเรียนพื้นที่สูง / โรงเรียนทางเลือก / โรงเรียนปกติ ใช้กรอบต่างกัน
- ถ้า hardcode → โรงเรียนที่ไม่ใช้กรอบนั้น tag SAR ผิดทันที

**Schema:**
```sql
CREATE TABLE sar_standards (
  id CHAR(36) PRIMARY KEY,
  school_id CHAR(36) NOT NULL,
  academic_year_id CHAR(36) NULL,
  code VARCHAR(100) NOT NULL,        -- 'STD1' / 'มาตรฐานที่ 1' / 'P1'
  name VARCHAR(500) NOT NULL,
  parent_id CHAR(36) NULL,           -- hierarchy: มาตรฐาน → ประเด็นพิจารณา
  display_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  UNIQUE KEY uq_sar_school_code (school_id, code)
);
```

**Onboarding flow:**
- โรงเรียนใหม่ → admin import SAR standards จาก template (CSV/JSON) หรือกรอกเอง
- AI Tagging ใช้ `sar_standards` ของโรงเรียนนั้น ๆ ใน context (RAG mini)

**Trade-off ที่รับ:** ตอน onboard โรงเรียนใหม่ใช้เวลา 30-60 นาทีตั้ง standards. AI tagging ต้อง re-prompt เมื่อโรงเรียนแก้ standards

---

## D-005 — Cloud AI (Claude API) เป็นหลัก, ไม่ทำ Local Ollama ใน Phase 1

**Decision:** ใช้ Anthropic Claude API ตรง (claude-haiku-4-5 สำหรับ summary งานเบา, claude-sonnet-4-6 สำหรับ review/PLC, claude-opus-4-7 สำหรับ planning ที่หนัก)

**Why:**
- ครูใหญ่ระบุชัด: Cloud AI
- ภาษาไทยศัพท์การศึกษา ("จิตศึกษา", "สมรรถนะ", "Active Learning") — Claude ทำได้ดีกว่า Ollama 7B/8B ระดับชัดเจน
- ตัด Ollama setup = ตัด docker-compose service + GPU/RAM requirement + provider fallback logic
- Anthropic prompt caching = ประหยัด token ของ system prompt + RAG chunks ที่ซ้ำ

**Cost control:**
- Per-school `monthly_token_budget` ใน `agents` table
- Log ทุก call ใน `ai_run_logs` (model, prompt_tokens, completion_tokens, cost_usd)
- ใช้ prompt caching เป็น default — re-use system prompt + persona + RAG context
- haiku-4-5 default; เลือก sonnet/opus เฉพาะ task ที่ต้อง

**Model selection rule:**
| Task | Model | เหตุผล |
|---|---|---|
| Reflection summary + tag | claude-haiku-4-5 | งานเบา, จำนวนเรียกเยอะ, ต้องเร็ว/ถูก |
| Lesson plan review (Academic Lead) | claude-sonnet-4-6 | ต้องการคุณภาพการตรวจ |
| Command Center breakdown | claude-sonnet-4-6 | reasoning |
| PLC aggregation + SAR draft | claude-opus-4-7 | งานสังเคราะห์ใหญ่ ทำไม่บ่อย |

**เมื่อไหร่กลับมาใช้ Ollama:**
- ถ้าโรงเรียนพื้นที่ห่างไกล internet ไม่เสถียร → local fallback
- ถ้าค่า cloud เกินงบ → cache + downgrade model + offer self-host option

**Trade-off ที่รับ:** dependency ต่อ Anthropic uptime + ค่า API ต่อเดือน. แลกกับเวลา dev ที่เร็วขึ้น 4-6 สัปดาห์

---

## รวมสรุปการตัด (สำคัญที่สุดของหน้านี้)

จากเอกสารเดิมใน `plan.md` v1 ที่เขียนไว้:

| ตัดออก | ที่ไป |
|---|---|
| Monorepo (pnpm workspaces + Turbo) | Single Next.js app, root |
| NestJS API แยก | Next.js Route Handlers + Server Actions |
| AI Gateway service แยก | Anthropic SDK + thin wrapper ใน `src/lib/ai/` |
| Ollama local | Claude API only |
| Provider fallback logic | (ไม่ต้อง — มี provider เดียว) |
| WebSocket server | SSE + polling |
| Redis + BullMQ | ใส่ตอนมี long-running job จริง (Phase 4+) |
| pgvector / Qdrant | ใส่ตอน Phase 6 RAG จริง |
| ทำ Phase 1 13 agents | เริ่ม 1 agent (ป.2) → ขยาย Phase 2 |
| Director Dashboard 4-Division | เริ่ม minimal director view (รายชื่อ + สถานะวันนี้) |
| Lesson Plan Studio | ย้าย Phase 2 |
| docker-compose 4 services | docker-compose 1 service (MariaDB เท่านั้น) |

**Net result:** Phase 0 จาก 2 สัปดาห์ → 3-5 วัน. Phase 1 จาก 6 สัปดาห์ → 4-5 สัปดาห์

---

## D-006 — Custom session auth (Copenhagen Book pattern) instead of Lucia v3

**Decision:** Implement sessions ourselves using `@oslojs/crypto` + `@oslojs/encoding` + `@node-rs/argon2`. **NOT** using Lucia v3 the library.

**Why this changed from earlier approval (Q1 answered "Lucia v3"):**
- Lucia v3 was officially archived by its author in early 2025; the recommendation is now to use the Copenhagen Book patterns directly.
- The pattern is what Lucia v3 did internally — generate token, hash for storage, store SHA-256(token) as session id, raw token only in cookie, sliding 30d expiry with 15d refresh.
- Result: ~200 LOC across `src/server/auth/`, zero dependency on an archived library.
- All behavior is equivalent — session cookies, server-side validation, secure invalidation.

**Files:**
- `src/server/auth/sessions.ts` — token gen, create/validate/invalidate
- `src/server/auth/password.ts` — argon2id via `@node-rs/argon2`
- `src/server/auth/cookies.ts` — set/clear/read session cookie
- `src/server/auth/validate-request.ts` — `cache()d` per-request resolver
- `src/server/auth/actions.ts` — signInAction, signOutAction

**Trade-off:** we own session security going forward. Mitigated by following the Copenhagen Book pattern exactly (well-documented, peer-reviewed).

---

## D-007 — Prisma 6 (not 7)

**Decision:** Use `prisma@^6` + `@prisma/client@^6` (installed v6.19.3).

**Why:** Prisma 7 (released 2025) made breaking changes:
1. `datasource.url` no longer supported in schema.prisma — must move to `prisma.config.ts` + driver adapter.
2. Requires installing a separate adapter package (`@prisma/adapter-mysql` etc.).
3. Documentation, Stack Overflow, AI assistant knowledge all heavily target Prisma 5/6.

For a solo dev + Claude Code workflow, Prisma 6 is the path with least friction. We can upgrade to 7 in Phase 2-3 once the ecosystem catches up.

**Trade-off:** Will need a migration step in 6-12 months. Manageable.

---

## D-008 — `@ai-sdk/rsc` (not `ai/rsc`)

**Decision:** `createStreamableValue` is imported from `@ai-sdk/rsc` (separate package).

**Why:** In `ai` v6, the `./rsc` subpath was removed. The streaming-from-Server-Action helpers moved to the standalone `@ai-sdk/rsc` package.

**Trade-off:** One extra dependency, but the API is identical.

---

## D-009 — Next.js 16: `middleware.ts` → `proxy.ts`

**Decision:** Place edge runtime code at `src/proxy.ts` and export `proxy(request)` instead of `middleware(request)`.

**Why:** Next.js 16 renamed the convention. Old name still works but emits deprecation warning.

**Affected:** `src/proxy.ts` only.

