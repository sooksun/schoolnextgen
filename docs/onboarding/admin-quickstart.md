# Admin Quickstart — First Pilot Deploy

**Audience:** the operator (you, the developer/admin) setting up SchoolNextgen for the first pilot school.
**Goal:** zero → 1 running server with 1-3 teacher accounts ready to log in.
**Time:** 30-45 minutes if you have a VPS/server ready.

> Walk this sequentially. Don't skip ahead — later steps assume earlier ones worked.

---

## 0. Prerequisites (one-time)

- A Linux VPS or your own server with: Docker 24+, Docker Compose v2, ~2 GB RAM, ~10 GB disk
- A domain name pointed at the server (e.g., `snx.your.school`)
- A reverse proxy with TLS (Caddy or nginx). **SchoolNextgen does NOT terminate HTTPS itself.**
- Accounts:
  - Anthropic API: <https://console.anthropic.com> → API Keys → create a new key starting with `sk-ant-`
  - **Optional but recommended:** Sentry free account at <https://sentry.io>
  - **Optional:** Resend account at <https://resend.com> if you want real email reminders. Without it, the daily reminder runs in **dry-run mode** — teachers only see the in-app banner on `/teacher`.

### Reverse proxy / TLS — minimal Caddy example

If you don't already have one, drop this into `/etc/caddy/Caddyfile`:

```
snx.your.school {
  reverse_proxy localhost:3000
  encode gzip zstd
  # Uploads can be large (up to 100 MB video) — give the proxy room.
  request_body {
    max_size 110MB
  }
}
```

Then `systemctl reload caddy`. Caddy provisions Let's Encrypt automatically on first request. Equivalent nginx config is in [Caddy → nginx translation docs](https://caddyserver.com/docs/getting-started).

### Data handling (PDPA)

The pilot will store **teacher PII** (email, display name) and **reflection text that may name students**. Before launch:

- Tell pilot teachers what's stored (their reflections + AI-generated summaries) and who can read it (themselves + รอง วช. + ผอ.).
- Keep a retention plan: default we recommend 1 academic year, then archive or delete. There is no automatic purge yet — set yourself a calendar reminder.
- Off-boarding a teacher: see "Common day-1 issues" for the SQL one-liner.

---

## 1. Clone + secrets (5 min)

```bash
git clone <your-fork-url> /srv/snx
cd /srv/snx

# Generate secrets — DO NOT REUSE between deploys
export AUTH_SECRET=$(openssl rand -hex 32)
export MYSQL_ROOT_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)
export CRON_SECRET=$(openssl rand -hex 24)

# Write .env (compose reads it automatically)
cat > .env <<EOF
# Database
MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD
MYSQL_DATABASE=school_agent_db

# Auth
AUTH_SECRET=$AUTH_SECRET

# Anthropic — PASTE YOUR REAL KEY HERE
ANTHROPIC_API_KEY=sk-ant-...REPLACE_ME...

# App
PUBLIC_APP_URL=https://snx.your.school
APP_PORT=3000

# Cron
CRON_ENABLED=true
CRON_SECRET=$CRON_SECRET

# Optional: Sentry (signup + DSN at sentry.io)
# SENTRY_DSN=https://...@...ingest.sentry.io/...
# NEXT_PUBLIC_SENTRY_DSN=\${SENTRY_DSN}
# SENTRY_ENVIRONMENT=pilot

# Optional: Resend (real email reminders — leave blank for dry-run)
# Without RESEND_API_KEY: cron logs `emailMode: 'dry_run'` and teachers only
# see the in-app banner on /teacher. With it set: cron emails each missing
# teacher at 15:30 Mon-Fri.
# RESEND_API_KEY=re_...
# EMAIL_FROM="SchoolNextgen <reminders@your.school>"
EOF
chmod 600 .env
```

**Critical:** edit `.env` and replace `sk-ant-...REPLACE_ME...` with your real key. **If you skip this, AI features 401 at runtime and the pilot teacher's first AI summarize click fails.**

---

## 2. Build + start (5 min)

```bash
docker compose build app
docker compose up -d

# Watch readiness
docker compose ps                      # both services should reach 'healthy'
docker compose logs -f app | grep "Ready in"   # Ctrl-C when you see it
```

If `app` keeps restarting:
```bash
docker compose logs app | tail -50
```
Most common causes: typo in `.env`, MySQL still booting (wait ~30s), `ANTHROPIC_API_KEY` doesn't start with `sk-ant-`.

---

## 3. Migrate + seed (3 min)

```bash
# Apply schema (Prisma CLI is pulled via npx — needs internet)
docker compose exec app sh -c "npx --yes prisma migrate deploy"

# Seed: 1 school (code=DEMO01), 4 departments, 11 classrooms, 12 agents,
# 3 demo users. Seed is TypeScript and the runner image is intentionally
# minimal, so we pull tsx on the fly:
docker compose exec app sh -c "npx --yes tsx prisma/seed.ts"
```

> **If the container has no internet** (corporate firewall, air-gapped VPS): run from a dev machine with Node 22 + pnpm + this repo, pointing at the server's MySQL on `127.0.0.1:3306` via SSH tunnel:
> `ssh -L 3306:127.0.0.1:3306 user@server` then locally:
> `DATABASE_URL="mysql://root:<password>@127.0.0.1:3306/school_agent_db" pnpm db:seed`

Verify:
```bash
docker compose exec mysql mysql -uroot -p$MYSQL_ROOT_PASSWORD school_agent_db -e \
  "SELECT (SELECT COUNT(*) FROM schools) schools,
          (SELECT COUNT(*) FROM classrooms) classrooms,
          (SELECT COUNT(*) FROM agents) agents,
          (SELECT COUNT(*) FROM users) users;"
```
Expected: `schools=1 classrooms=11 agents=12 users=3`.

---

## 4. Smoke test (5 min)

```bash
# Health endpoint
curl -fsS https://snx.your.school/api/health | jq
# → {"status":"ok","checks":{"db":{"status":"ok",...}}}

# Login page renders
curl -fsS https://snx.your.school/login | grep -o 'เข้าสู่ระบบ'
# → เข้าสู่ระบบ
```

Open `https://snx.your.school/login` in a browser. Try logging in as:
- `teacher@demo.local` / `Pass1234!` → should land on `/teacher`
- `director@demo.local` / `Pass1234!` → should land on `/school/dashboard`

**The demo accounts are for the operator's smoke test only — never hand them to a pilot teacher.** Real teachers get their own account via step 6. Rotate the three demo passwords in step 5 so the seeded `Pass1234!` cannot be used against this server again.

---

## 5. Rotate demo passwords (5 min) — MANDATORY

The default `Pass1234!` is in source control. Rotate the three demo accounts before anyone outside the operator can reach the login page. (Pilot teachers do **not** use these accounts — they get their own via step 6.)

```bash
# Generate a new password and hash it inside the container
docker compose exec app node -e "
const argon2 = require('@node-rs/argon2');
const pw = process.argv[1];
argon2.hash(pw, { memoryCost: 19456, timeCost: 2, outputLen: 32, parallelism: 1 })
  .then(h => console.log('UPDATE users SET password_hash=' + JSON.stringify(h) + ' WHERE email=' + JSON.stringify(process.argv[2]) + ';'));
" 'NewStrongPasswordHere!' 'teacher@demo.local'
```

Copy the printed SQL, paste into:
```bash
docker compose exec mysql mysql -uroot -p$MYSQL_ROOT_PASSWORD school_agent_db
```

Repeat for `director@demo.local` and `deputy.academic@demo.local`.

> **Phase 2 will add an admin password-reset UI.** For now, this is the path.

---

## 6. Add real pilot teachers (10 min) — for each new teacher

Demo `teacher@demo.local` exists only for the operator's smoke test. Each real pilot teacher gets their own account, never the seed credential. Codes referenced below (`DEMO01`, `academic`, `teacher`) come straight from `prisma/seed.ts` — they exist after step 3 succeeds.

```bash
docker compose exec app node -e "
const argon2 = require('@node-rs/argon2');
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

(async () => {
  // ─── EDIT THESE 5 LINES ────────────
  const email          = 'somsri@your.school'
  const displayName    = 'สมศรี ใจดี'
  const initialPassword = 'TempPassword!23'
  const classroomLevel  = 'G2'   // K2 K3 G1-G6 M1-M3
  const schoolCode      = 'DEMO01'
  // ──────────────────────────────────

  const school = await p.school.findUniqueOrThrow({ where: { code: schoolCode } })
  const year   = await p.academicYear.findFirstOrThrow({ where: { schoolId: school.id, isCurrent: true } })
  const cls    = await p.classroom.findFirstOrThrow({ where: { schoolId: school.id, academicYearId: year.id, level: classroomLevel } })
  const role   = await p.role.findUniqueOrThrow({ where: { code: 'teacher' } })
  const dept   = await p.department.findFirstOrThrow({ where: { schoolId: school.id, code: 'academic' } })

  const hash = await argon2.hash(initialPassword, { memoryCost: 19456, timeCost: 2, outputLen: 32, parallelism: 1 })
  const person = await p.person.create({ data: { displayName, email } })
  const user   = await p.user.create({ data: { personId: person.id, email, passwordHash: hash } })
  await p.userSchoolMembership.create({
    data: {
      personId: person.id, userId: user.id,
      schoolId: school.id, academicYearId: year.id,
      departmentId: dept.id, classroomId: cls.id, roleId: role.id,
      status: 'active', membershipType: 'staff',
    },
  })
  console.log('Created teacher', email, 'for', classroomLevel, '— initial password: ' + initialPassword)
  console.log('Tell them to log in at ' + (process.env.PUBLIC_APP_URL || 'https://snx.your.school') + '/login')
  console.log('Then YOU need to either (a) build the password-change UI in Phase 2, or (b) rotate again per step 5.')
  await p.\$disconnect()
})()
"
```

Save this snippet — you'll run it once per teacher with the 5 lines edited. Hand the initial password to the teacher **in person or by phone**, never over LINE/Email (those channels are often shared accounts).

### Off-boarding a teacher (Phase 2 will get a UI)

When a teacher leaves the pilot, suspend rather than delete (their reflections stay readable to the school):

```bash
docker compose exec mysql mysql -uroot -p$MYSQL_ROOT_PASSWORD school_agent_db -e \
  "UPDATE users SET status='suspended' WHERE email='somsri@your.school';
   UPDATE user_school_memberships m
     JOIN users u ON u.id = m.user_id
     SET m.status='inactive', m.end_date=CURDATE()
     WHERE u.email='somsri@your.school';"
```

Status values verified against the codebase:
- `users.status='suspended'` — login is blocked at `src/server/auth/sessions.ts` (anything ≠ `'active'`)
- `user_school_memberships.status='inactive'` — scope resolver filters on `'active'`; matches the existing test convention
- `end_date` is a `DATE` column (not `ended_at` / not `DATETIME`)

The next login attempt returns 401. The daily-reminder cron skips them automatically (its status filter).

---

## 7. Verify backup works (5 min) — MANDATORY

```bash
# Take a backup
mkdir -p /srv/snx/backups
docker compose exec -T mysql sh -c \
  "mysqldump --single-transaction --routines --triggers --quick \
   -u root -p$MYSQL_ROOT_PASSWORD school_agent_db" \
  | gzip > /srv/snx/backups/snx-initial-$(date -u +%F).sql.gz

# Sanity check
ls -lh /srv/snx/backups/
# File should be > 10 KB
```

Add to host crontab (`crontab -e` as root):
```
0 3 * * *  cd /srv/snx && docker compose exec -T mysql sh -c "mysqldump --single-transaction --routines --triggers --quick -u root -p$MYSQL_ROOT_PASSWORD school_agent_db" | gzip > /srv/snx/backups/snx-$(date -u +\%F_\%H\%M\%S).sql.gz; find /srv/snx/backups -name 'snx-*.sql.gz' -mtime +30 -delete
```

> **Treat the root crontab as a secret.** The shell expands `$MYSQL_ROOT_PASSWORD` once at `crontab -e` time, so the password gets baked into `/var/spool/cron/crontabs/root` in plaintext. Don't commit a screenshot of the crontab anywhere, and `chmod 600` if your distro doesn't already.

Verify the cron entry actually fired the next day before you trust it. **Also do a restore drill** — pick the latest dump, restore into a throwaway schema, confirm row counts match. An untested backup isn't a backup.

---

## 8. Sentry hook-up (3 min — optional but recommended)

```bash
# 1. Sign up at sentry.io, create a Next.js project, copy the DSN
# 2. Add to .env
echo "SENTRY_DSN=https://...your_dsn..." >> .env
echo "NEXT_PUBLIC_SENTRY_DSN=$(grep ^SENTRY_DSN .env | cut -d= -f2-)" >> .env
echo "SENTRY_ENVIRONMENT=pilot" >> .env
# 3. Rebuild — NEXT_PUBLIC_* values are baked at build time
docker compose build app
docker compose up -d
```

Trigger a test error to verify it reaches Sentry:
```bash
# Temporarily break the DB connection (simulates outage)
docker compose stop mysql
curl https://snx.your.school/api/health
# → 503 (degraded). Sentry should NOT fire (this is a known degradation, not an error).
docker compose start mysql
```

---

## 9. Done — what to hand to the teacher

Send the pilot teacher:
1. The login URL: `https://snx.your.school/login`
2. Their email and initial password (from step 6) — delivered in person or by phone, not over chat
3. The teacher cheatsheet: [`teacher-cheatsheet.md`](./teacher-cheatsheet.md) (Thai)
4. A **30-40 minute** demo session scheduled on day 1 — run it with [`first-session-demo-script.md`](./first-session-demo-script.md)

---

## Common day-1 issues

| Symptom | Most likely cause | Fix |
|---|---|---|
| `/api/health` returns 503 | MySQL not ready yet, or DATABASE_URL typo | Wait 30s, then `docker compose logs mysql` |
| Teacher gets 401 on login attempt | Wrong password OR rate-limited | If rate-limited: `docker compose restart app` (clears in-memory bucket) |
| Teacher clicks "สรุปอัตโนมัติ" → red toast | `ANTHROPIC_API_KEY` placeholder or expired | Update `.env`, `docker compose up -d` |
| AI summary works but no email reminder at 15:30 | `RESEND_API_KEY` unset → dry-run mode | Either set the key (real emails) or accept dry-run (in-app banner still works) |
| Page renders without Thai font | `Noto Sans Thai` failed to load | Check browser console; usually a CDN issue, retry |

---

## Beyond this quickstart

For ops + rollback + cron schedules + manual cron triggers → [`docs/runbook.md`](../runbook.md).
For long-term roadmap → [`plan.md`](../../plan.md) + [`docs/phase-1.5-backlog.md`](../phase-1.5-backlog.md).

---

**Onboarding doc set:**
- [admin-quickstart.md](./admin-quickstart.md) — you're reading it (operator setup)
- [teacher-cheatsheet.md](./teacher-cheatsheet.md) — hand to the pilot teacher
- [first-session-demo-script.md](./first-session-demo-script.md) — your script for the live demo
