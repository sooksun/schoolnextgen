# Operations Runbook — SchoolNextgen

The short, opinionated reference for deploying, backing up, restoring, and rolling back the Phase 1 stack. Update this when commands change.

---

## 0. Stack at a glance

| Layer | Tech | How it runs |
|---|---|---|
| Web | Next.js 16 + Node 22 (Alpine in Docker) | `node server.js` (standalone) |
| DB | MySQL 8.0 | Docker service `mysql` |
| Storage | Local disk at `/data/uploads` | Docker volume `snx-uploads` |
| AI | Anthropic Claude API (Haiku/Sonnet/Opus by task) | HTTPS to api.anthropic.com |

Single-host, no reverse proxy assumed. Add nginx/Caddy in front for TLS termination.

---

## 1. First-time deploy

```bash
git clone <repo>
cd schoolnextgen

# 1. Build .env from template
cp .env.example .env
# Then EDIT .env to set:
#   AUTH_SECRET           = openssl rand -hex 32
#   ANTHROPIC_API_KEY     = sk-ant-...
#   MYSQL_ROOT_PASSWORD   = strong password
#   PUBLIC_APP_URL        = https://your.domain
nano .env

# 2. Pull/build and start the stack
docker compose pull mysql
docker compose build app
docker compose up -d

# 3. Run migrations + seed (only on first deploy)
docker compose exec app sh -c 'npx prisma migrate deploy'
docker compose exec app sh -c 'node prisma/seed.js'  # if seed compiled in image

# 4. Verify
curl -fsS http://localhost:3000/api/health | jq
docker compose ps        # all services should be "healthy"
docker compose logs app | tail -20
```

If `/api/health` returns `200 {"status":"ok"}` and the DB check passes, the app is live.

---

## 2. Daily backups

### Local dev (Windows / Laragon / macOS / Linux with mysql-client)

```bash
pnpm backup   # auto-detects Laragon's mysqldump on C: or D: drive
```

The script:
- Parses `DATABASE_URL` from `.env.local` + `.env`
- Runs `mysqldump --single-transaction --routines --triggers --quick`
- Pipes through gzip → `./backups/snx-YYYY-MM-DD_HHMMSS.sql.gz`
- Rotates files older than `--keep` days (default 30)
- Auto-detects mysqldump in this order: `MYSQLDUMP_PATH` env → Laragon (`C:\\laragon\\bin\\mysql\\*\\bin\\mysqldump.exe` or `D:\\laragon\\bin\\...`) → PATH
- Cleans up the empty output file if mysqldump fails (no zero-byte ghost backups)

### Production (Docker compose)

The `app` container does NOT have `mysqldump` — only the `mysql` service does. Run the dump from inside the mysql container:

```bash
# Daily cron (host crontab, NOT inside any container)
0 3 * * *  cd /srv/snx && /srv/snx/scripts/backup-docker.sh >> /var/log/snx-backup.log 2>&1
```

Where `scripts/backup-docker.sh` is:
```bash
#!/usr/bin/env bash
set -euo pipefail
STAMP=$(date -u +%Y-%m-%d_%H%M%S)
docker compose exec -T mysql sh -c \
  "mysqldump --single-transaction --routines --triggers --quick \
   -u root -p$MYSQL_ROOT_PASSWORD school_agent_db" \
  | gzip > /srv/snx/backups/snx-${STAMP}.sql.gz
# Rotate
find /srv/snx/backups -name 'snx-*.sql.gz' -mtime +30 -delete
```

### Verify a backup is restorable (do this once before the pilot)

```bash
# 1. Take a fresh dump
pnpm backup    # or backup-docker.sh in prod

# 2. Restore into a scratch DB
docker compose exec mysql mysql -uroot -p$MYSQL_ROOT_PASSWORD \
  -e "CREATE DATABASE school_agent_db_restore_test"
gunzip < ./backups/snx-LATEST.sql.gz | \
  docker compose exec -T mysql mysql -uroot -p$MYSQL_ROOT_PASSWORD school_agent_db_restore_test

# 3. Verify table counts match the live DB
docker compose exec mysql mysql -uroot -p$MYSQL_ROOT_PASSWORD school_agent_db_restore_test \
  -e "SELECT COUNT(*) AS agents FROM agents; SELECT COUNT(*) AS users FROM users;"

# 4. Drop the scratch DB
docker compose exec mysql mysql -uroot -p$MYSQL_ROOT_PASSWORD \
  -e "DROP DATABASE school_agent_db_restore_test"
```

**Untested backups are not backups.**

---

## 3. Pre-migration backup (mandatory)

Before any `prisma migrate deploy` in production:

```bash
docker compose exec -T mysql sh -c \
  "mysqldump --single-transaction --routines --triggers \
   -u root -p$MYSQL_ROOT_PASSWORD school_agent_db" \
  | gzip > pre-migrate-$(date -u +%Y%m%dT%H%M).sql.gz
```

Keep these for 90 days. Migrations are NOT reversible via Prisma — restore is the only rollback.

---

## 4. Rollback playbook

### App-only rollback (no schema change)
```bash
# 1. Note the failing image hash from `docker compose images`
# 2. Re-tag previous image as :current and redeploy
docker tag schoolnextgen-app:previous schoolnextgen-app:current
docker compose up -d --no-deps --force-recreate app
# 3. Verify
curl -fsS http://localhost:3000/api/health
```

### Rollback after a bad migration
```bash
# 1. Stop traffic (or enable maintenance mode)
docker compose stop app

# 2. Restore the pre-migration dump
gunzip < pre-migrate-YYYYMMDDTHHMM.sql.gz | \
  docker compose exec -T mysql mysql -u root -p$MYSQL_ROOT_PASSWORD school_agent_db

# 3. Mark migration as rolled back in Prisma's bookkeeping table
docker compose exec app npx prisma migrate resolve --rolled-back <migration_name>

# 4. Redeploy the previous app version (Step "App-only rollback" above)

# 5. Resume traffic, verify
curl -fsS http://localhost:3000/api/health
```

Prisma does **not** generate `down` migrations. Restore-from-dump is the only safe path.

---

## 5. Routine ops

### Tail logs
```bash
docker compose logs -f app
docker compose logs --since 1h mysql
```

### Connect to DB
```bash
docker compose exec mysql mysql -uroot -p$MYSQL_ROOT_PASSWORD school_agent_db
```

### Inspect a session
```bash
docker compose exec mysql mysql -uroot -p$MYSQL_ROOT_PASSWORD school_agent_db \
  -e "SELECT id, user_id, expires_at FROM sessions ORDER BY created_at DESC LIMIT 5;"
```

### Clean expired sessions (run weekly until cron lands)
```bash
docker compose exec mysql mysql -uroot -p$MYSQL_ROOT_PASSWORD school_agent_db \
  -e "DELETE FROM sessions WHERE expires_at < NOW() - INTERVAL 1 DAY;"
```

### Force-logout a user
```bash
docker compose exec mysql mysql -uroot -p$MYSQL_ROOT_PASSWORD school_agent_db \
  -e "DELETE FROM sessions WHERE user_id='<uuid>';"
```

---

## 6. Health monitoring

External uptime check should poll **`https://your.domain/api/health`** every 60s.

Response shape:
```json
{
  "status": "ok",                  // "ok" | "degraded"
  "uptimeSec": 84123,
  "version": "0.1.0",
  "timestamp": "2026-05-12T...",
  "checks": {
    "db": { "status": "ok", "latencyMs": 3 }
  }
}
```

| HTTP | Meaning | Action |
|---|---|---|
| 200 | All checks ok | green |
| 503 | One or more checks failed (DB unreachable) | page on-call; check `docker compose ps` + DB logs |
| no response / 5xx | App process down | restart app: `docker compose restart app` |

---

## 7. Common failure modes

### "Cannot connect to MySQL" on app start
- `docker compose ps` — is mysql healthy? Wait ~30s on cold start
- `docker compose logs mysql` — look for "ready for connections"
- Check `DATABASE_URL` host is `mysql` (the service name), not `localhost`, when inside the container

### `/api/health` returns 503 in production
- Most likely: DB is down or slow
- Run `docker compose exec mysql mysqladmin ping -uroot -p$MYSQL_ROOT_PASSWORD`
- Check disk space: `df -h` — MySQL refuses writes when disk > ~95% full

### Anthropic API errors in `ai_run_logs`
```sql
SELECT status, COUNT(*), MAX(created_at) FROM ai_run_logs
WHERE created_at > NOW() - INTERVAL 1 HOUR GROUP BY status;
```
- Sudden spike in `error` → check `ANTHROPIC_API_KEY` validity; check rate limit at api.anthropic.com
- Many `success` but `cost_usd` climbing fast → review prompt-cache hit rate via `prompt_cache_read_tokens`

### Login rate-limit lockout for legit user
The in-memory `loginByIp` bucket fires after 10 failed attempts in 15 min. To unblock:
```bash
docker compose restart app   # clears the in-memory rate-limit map
```
Or wait 15 minutes. Phase 4 — move to Redis-backed limiter so restart isn't needed.

### Per-school AI budget hit
Symptom: `ActionError('RATE_LIMITED', 'งบ Token AI เดือนนี้หมดแล้ว...')` in toast for a teacher.
Resolution:
```sql
-- Inspect usage
SELECT agent_id, SUM(total_tokens) FROM ai_run_logs
WHERE created_at >= DATE_FORMAT(NOW(), '%Y-%m-01') AND status='success'
GROUP BY agent_id;

-- Raise the budget for an agent
UPDATE agents SET monthly_token_budget=200000 WHERE id='<uuid>';
```

---

## 8. Pre-pilot checklist

Walk through before letting a real teacher in:

- [ ] `.env` has REAL `ANTHROPIC_API_KEY` and `AUTH_SECRET` (not placeholders)
- [ ] `docker compose ps` shows all services `healthy`
- [ ] `curl /api/health` returns 200
- [ ] Login + create reflection + AI summarize flow works end-to-end as the teacher demo user
- [ ] First backup taken: `pnpm backup` (or via docker exec)
- [ ] Backup restore tested into a scratch DB (do this once)
- [ ] Cron entry added for daily backup
- [ ] `docs/runbook.md` accessible to whoever's on-call (this file)
- [ ] Set `Agent.monthlyTokenBudget` for each classroom agent (suggested: 50,000 / agent / month for haiku at ~30 reflections/teacher/month)
- [ ] Document teacher demo password rotation: change `Pass1234!` to something the pilot teacher chose

---

## 9. Error tracking (Sentry — optional, recommended for pilot)

Sentry is wired but **disabled by default**. Without `SENTRY_DSN`, the app is silent — `docker compose logs app` is the only error source.

### Enable it

1. Sign up at https://sentry.io (free tier: 5k errors/mo, plenty for a 5-teacher pilot)
2. Create a project: platform = Next.js
3. Copy the DSN: `https://<key>@<project>.ingest.sentry.io/<id>`
4. Add to `.env` on the host:
   ```
   SENTRY_DSN="https://<key>@<project>.ingest.sentry.io/<id>"
   NEXT_PUBLIC_SENTRY_DSN="https://<key>@<project>.ingest.sentry.io/<id>"   # same value, browser-exposed
   SENTRY_ENVIRONMENT="pilot-<schoolname>"
   SENTRY_TRACES_SAMPLE_RATE="0.1"   # 10% of requests get performance traces
   ```
5. **Rebuild** the image (the client DSN is inlined at build time):
   ```bash
   docker compose build app
   docker compose up -d
   ```
6. Trigger a deliberate error to verify — should show up in Sentry within ~30s.

### What Sentry captures

- **Server-side**: uncaught errors in Server Components, route handlers, and `INTERNAL`-returning server actions
- **Client-side**: React errors, hydration mismatches, errors during navigation
- **Filtered out** (in `src/instrumentation.ts` + `src/lib/observability.ts`):
  - `VALIDATION` / `PERMISSION_DENIED` / `UNAUTHENTICATED` / `NOT_FOUND` / `RATE_LIMITED` — user-facing outcomes, not bugs
  - Cookies + Authorization headers (scrubbed in `beforeSend`)
  - Request body (potentially reflection content) — replaced with `[redacted]`
- **Disabled by default**: session replays (privacy concern with classroom content on screen)

### Manual capture from a server action

```ts
import { captureActionError } from '@/lib/observability'

try { /* ... */ } catch (e) {
  captureActionError('myAction', e, { someContext: '...' })
  return err('INTERNAL', '...')
}
```

This helper always `console.error`s, and **only** sends to Sentry when DSN is set AND the error isn't a user-facing `ActionError`.

---

## 10. Cron / scheduled jobs

The container runs in-process schedulers (`node-cron`) when `CRON_ENABLED=true`. docker-compose.yml defaults to enabled.

| Job | Schedule (Asia/Bangkok) | Purpose |
|---|---|---|
| `daily-reminder` | `30 15 * * 1-5` (Mon-Fri, 15:30) | Per school: count teachers without today's reflection; writes `daily_reminder_logs` row; idempotent per (school, date) |
| `cleanup-sessions` | `0 3 * * *` (daily, 03:00) | Delete sessions with `expires_at < now() - 1 day` |

### Manual trigger (ops + external schedulers)

```bash
# Set on host BEFORE first deploy
export CRON_SECRET=$(openssl rand -hex 24)
docker compose up -d

# Fire daily-reminder manually
curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
  https://your.domain/api/cron/daily-reminder | jq

# Fire session cleanup
curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
  https://your.domain/api/cron/cleanup-sessions | jq
```

Without `CRON_SECRET`, the endpoint refuses ALL requests (401). Empty string = no secret.

### Multi-replica deploys (Phase 8+)

In-process cron fires on every replica → duplicate runs. `daily-reminder` is idempotent via UNIQUE `(school_id, run_date, job_kind)` — duplicates INSERT-fail and skip. But it's noisy/wasteful.

**Recommended for >1 replica:**
1. Set `CRON_ENABLED=false` on app containers
2. Add external scheduler (host crontab, Vercel Cron, GitHub Actions) hitting `/api/cron/<job>` with `CRON_SECRET`
3. Pick ONE host to be the cron-runner

### Inspecting cron history

```sql
SELECT school_id, run_date, teachers_total, teachers_missing,
       notifications_sent, status, error_message
FROM daily_reminder_logs
WHERE job_kind='reminder' AND run_date >= CURDATE() - INTERVAL 14 DAY
ORDER BY run_date DESC, school_id;
```

### Email reminders (T-131 — Resend)

The daily-reminder cron sends reminder emails to teachers who haven't logged today. **Opt-in via `RESEND_API_KEY`** — leave blank for dry-run mode (cron records counts but doesn't actually send).

```bash
# 1. Sign up at https://resend.com (free: 100/day, 3k/month)
# 2. Add to .env on host:
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="SchoolNextgen <reminders@your.domain>"   # must be a verified domain
# 3. Restart the app
docker compose up -d
```

**Without a verified domain:** Resend allows `onboarding@resend.dev` as a sandbox sender (default in env). Emails will arrive but with a Resend-branded From. Fine for early pilot.

### Inspecting email delivery

```sql
SELECT run_date, teachers_total, teachers_missing, notifications_sent,
       JSON_EXTRACT(details, '$.emailMode') AS mode,
       JSON_EXTRACT(details, '$.sendFailures') AS failures
FROM daily_reminder_logs
WHERE job_kind='reminder' AND run_date >= CURDATE() - INTERVAL 7 DAY
ORDER BY run_date DESC;
```
- `notifications_sent` = actual deliveries (dry-runs + failures excluded)
- `details.emailMode` = `'live'` when Resend ran, `'dry_run'` when no API key
- `details.sendFailures` = array of `{userId, reason}` — per-recipient failures don't crash the cron

### Failure modes

| Symptom | Cause | Resolution |
|---|---|---|
| `emailMode='dry_run'` but `RESEND_API_KEY` is set | Key shorter than 8 chars → treated as unset | Use a real Resend key (starts with `re_`) |
| All teachers in `sendFailures` with `reason='invalid_from_address'` | `EMAIL_FROM` domain not verified in Resend | Verify the domain at https://resend.com/domains, OR use sandbox `onboarding@resend.dev` |
| One teacher in `sendFailures` per run | Their email bounces / address invalid | Check their `User.email` in DB; ask them to update |
| `notifications_sent` always 0 with key set | Cron didn't actually run — check `/api/cron/daily-reminder` logs |

---

## 11. What's deliberately not in this runbook

- TLS/HTTPS setup → use Caddy/nginx in front; not Next.js's job
- CI/CD → Phase 4
- Multi-host failover → Phase 8+
- Email delivery for reminders → T-131 (Phase 1.5)
- Log aggregation (Axiom/Loki) → Phase 4. Today: `docker compose logs app` + Sentry for errors only
- Schema-per-school multi-tenancy → not in design; we're row-level (`school_id` filter)
