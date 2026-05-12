# Operations Runbook — SchoolNextgen

Short, opinionated reference for deploying, backing up, restoring, and rolling back the Phase 1 stack. Update this when commands change.

---

## 0. Stack at a glance

| Layer | Tech | How it runs |
|---|---|---|
| Web | Next.js 16 + Node 22 (Alpine in Docker) | `node server.js` (standalone) — compose service `app` |
| DB | **External MariaDB** (NOT in compose) | TCP/IP to host on the LAN, e.g. `192.168.1.4:3306` (Prisma uses `mysql://` for MariaDB) |
| Storage | Local disk at `/data/uploads` | Docker volume `snx-uploads` |
| AI | Anthropic Claude API (Haiku/Sonnet/Opus by task) | HTTPS to api.anthropic.com |

Ports are env-driven via `.env`:
- `APP_PORT` (default 3000) — host side, what users / reverse proxy hit
- `PORT` (default 3000) — container side, what Next.js binds to

A reverse proxy (nginx / Caddy / Cloudflare) terminates TLS in front of `app` and forwards to `APP_PORT`. The app itself does not speak HTTPS.

---

## 1. First-time deploy

```bash
git clone <repo> /DATA/AppData/www/schoolnextgen
cd /DATA/AppData/www/schoolnextgen

# 1. Build .env from template, then fill the secrets
cp .env.example .env
nano .env
#   DATABASE_URL="mysql://<user>:<password>@<host>:3306/school_agent_db"
#   AUTH_SECRET="$(openssl rand -hex 32)"
#   ANTHROPIC_API_KEY="sk-ant-..."
#   PUBLIC_APP_URL="http://schoolnextgen.cnppai.com"    # https:// once TLS is in place
#   APP_PORT="9921"     # host port (optional, default 3000)
#   PORT="9920"         # container port (optional, default 3000)
chmod 600 .env

# 2. Make sure the external DB exists and `<user>` can write to it
#    From any host that can reach the DB:
docker run --rm -e MYSQL_PWD='<password>' mariadb:11 \
  mariadb -h<host> -u<user> -e "CREATE DATABASE IF NOT EXISTS school_agent_db CHARACTER SET utf8mb4;"

# 3. Deploy. scripts/deploy.sh: preflight → backup → pull → build → migrate
#    (via the Dockerfile's `builder` stage) → restart → /api/health.
#    On first run, builder + runner images take ~5-10 min cold. Cached after.
./scripts/deploy.sh

# 4. Seed (only on first deploy). The seed image is the same `schoolnextgen-migrator`
#    that deploy.sh built. The seed is idempotent — re-running won't duplicate.
DBURL="$(grep '^DATABASE_URL=' .env | cut -d= -f2- | sed 's/^"//; s/"$//')"
docker run --rm -e DATABASE_URL="$DBURL" schoolnextgen-migrator:latest pnpm db:seed

# 5. Verify
curl -fsS "http://localhost:${APP_PORT:-3000}/api/health" | jq
docker compose ps        # app should be "running" + healthy
docker compose logs app --tail=20
```

After step 3 returns clean, the app is live. After step 4, demo logins (`teacher@demo.local` / `Pass1234!` etc.) work. Rotate `Pass1234!` before letting the first real teacher in.

---

## 2. Daily backups

### Production (docker host)

Use `scripts/backup-prod.sh`. It reads `DATABASE_URL` from `.env`, runs `mariadb-dump` in a one-shot `mariadb:11` container against the external DB, gzips to `./backups/`, and rotates anything older than 30 days.

```bash
# Install in crontab (root) — runs nightly at 03:00 local
sudo crontab -e
# Add:
0 3 * * * /DATA/AppData/www/schoolnextgen/scripts/backup-prod.sh >> /var/log/snx-backup.log 2>&1
```

`scripts/backup-prod.sh` handles cron's stripped PATH, parses the URL with the same regex `deploy.sh` uses, refuses to write a backup under 1KB (catches silent dump failures), and exits non-zero on any error — so cron's MAILTO (if set) actually sees breakage.

Manual run anytime: `./scripts/backup-prod.sh` (writes the same file, same rotation).

Overrides: `BACKUP_DIR=/mnt/backups KEEP_DAYS=60 ./scripts/backup-prod.sh`.

### Local dev (Laragon)

`pnpm backup` still works — `scripts/backup.mjs` auto-detects Laragon's `mysqldump.exe` and dumps the local DB. Not relevant in prod (no Laragon, no host mysqldump).

### Verify a backup is restorable (do this once before the pilot)

```bash
DBURL="$(grep '^DATABASE_URL=' .env | cut -d= -f2- | sed 's/^"//; s/"$//')"

# Take a fresh dump
./scripts/backup-prod.sh

# Restore it into a scratch DB
LATEST="$(ls -t ./backups/daily-*.sql.gz | head -1)"
docker run --rm -e MYSQL_PWD='<password>' mariadb:11 \
  mariadb -h<host> -u<user> -e "CREATE DATABASE school_agent_db_restore_test CHARACTER SET utf8mb4;"
gunzip < "$LATEST" | docker run --rm -i -e MYSQL_PWD='<password>' mariadb:11 \
  mariadb -h<host> -u<user> school_agent_db_restore_test

# Verify table counts match the live DB
docker run --rm -e MYSQL_PWD='<password>' mariadb:11 \
  mariadb -h<host> -u<user> -t -e "
    SELECT 'live' AS db, COUNT(*) AS agents FROM school_agent_db.agents
    UNION ALL
    SELECT 'restore', COUNT(*) FROM school_agent_db_restore_test.agents;"

# Drop the scratch DB
docker run --rm -e MYSQL_PWD='<password>' mariadb:11 \
  mariadb -h<host> -u<user> -e "DROP DATABASE school_agent_db_restore_test;"
```

**Untested backups are not backups.**

---

## 3. Pre-migration backup (automatic)

`scripts/deploy.sh` runs a pre-deploy backup automatically before `prisma migrate deploy`. The file lives under `./backups/pre-deploy-<timestamp>.sql.gz` and is referenced in the rollback hint if the post-deploy health check fails.

To skip (e.g. you already snapshotted manually): `SKIP_BACKUP=1 ./scripts/deploy.sh` — but expect to lose the rollback safety net.

Keep pre-deploy backups for 90 days. Migrations are NOT reversible via Prisma — restore is the only rollback.

---

## 4. Rollback playbook

### App-only rollback (no schema change)

```bash
# 1. Find the previous commit you want to roll back to
git log --oneline -5

# 2. Re-deploy that ref. deploy.sh handles the build + restart.
./scripts/deploy.sh <commit-sha-or-tag>

# 3. Verify
curl -fsS "http://localhost:${APP_PORT:-3000}/api/health"
```

### Rollback after a bad migration

```bash
DBURL="$(grep '^DATABASE_URL=' .env | cut -d= -f2- | sed 's/^"//; s/"$//')"
PW='<password from DATABASE_URL>'

# 1. Stop traffic
docker compose stop app

# 2. Restore the pre-migration dump (deploy.sh wrote it under ./backups/pre-deploy-*.sql.gz)
LATEST="$(ls -t ./backups/pre-deploy-*.sql.gz | head -1)"
gunzip < "$LATEST" | docker run --rm -i -e MYSQL_PWD="$PW" mariadb:11 \
  mariadb -h<host> -u<user> school_agent_db

# 3. Mark migration as rolled back in Prisma's bookkeeping table
docker run --rm -e DATABASE_URL="$DBURL" schoolnextgen-migrator:latest \
  pnpm prisma migrate resolve --rolled-back <migration_name>

# 4. Deploy the previous app version
./scripts/deploy.sh <previous-commit-sha>

# 5. Verify
curl -fsS "http://localhost:${APP_PORT:-3000}/api/health"
```

Prisma does **not** generate `down` migrations. Restore-from-dump is the only safe path.

---

## 5. Routine ops

### Tail logs

```bash
docker compose logs -f app
docker compose logs --since 1h app    # MariaDB lives outside compose — see your DB host's syslog instead
```

### Connect to the DB

```bash
DBURL="$(grep '^DATABASE_URL=' .env | cut -d= -f2- | sed 's/^"//; s/"$//')"
# Quick one-off SELECT (auth from DATABASE_URL via the mariadb client):
docker run --rm -it -e MYSQL_PWD='<password>' mariadb:11 \
  mariadb -h<host> -u<user> -Dschool_agent_db
```

For frequent use, install the `mariadb-client` package on the host (`apt-get install mariadb-client`) and run `mariadb` directly without the docker wrapper.

### Inspect recent sessions

```sql
SELECT id, user_id, expires_at, created_at
FROM sessions
ORDER BY created_at DESC LIMIT 5;
```

### Clean expired sessions

Runs automatically via in-process cron (see §10). Manual one-off:

```sql
DELETE FROM sessions WHERE expires_at < NOW() - INTERVAL 1 DAY;
```

### Force-logout a user

```sql
DELETE FROM sessions WHERE user_id = '<uuid>';
```

### Restart the app (without rebuilding)

```bash
docker compose restart app
```

### Rebuild and restart (after pulling new code)

```bash
git pull origin main && ./scripts/deploy.sh
```

---

## 6. Health monitoring

External uptime check polls `${PUBLIC_APP_URL}/api/health` every 60s.

Response shape (HTTP 200):
```json
{
  "status": "ok",
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
| 503 | DB unreachable / slow | page on-call; check DB host network + `docker compose logs app` |
| no response / 5xx | App process down | `docker compose restart app` |

---

## 7. Common failure modes

### "Cannot connect to MariaDB" on app start

- DB host reachable from the host? `nc -z <host> 3306` (or just `bash -c "</dev/tcp/<host>/3306"`)
- Container can reach the DB? `docker run --rm mariadb:11 mariadb -h<host> -u<user> -p -e "SELECT 1"` — if this hangs, the docker network can't route to the DB host (you may be using the host's LAN IP from a network that can't see it). Use the IP that's reachable from the docker bridge (often the host's external IP, not the LAN one).
- `.env` `DATABASE_URL` matches the URL you tested? Compose env block overrides `.env` only if you HARDCODE the value in `docker-compose.yml` — current compose uses `${DATABASE_URL}` so `.env` wins.

### `/api/health` returns 503

- DB is down, slow, or unreachable.
- Run the preflight commands from §7 above.
- Check disk space on the DB host: `df -h` — MariaDB refuses writes when disk > ~95% full.

### Anthropic API errors in `ai_run_logs`

```sql
SELECT status, COUNT(*), MAX(created_at) FROM ai_run_logs
WHERE created_at > NOW() - INTERVAL 1 HOUR GROUP BY status;
```

- Sudden spike in `error` → check `ANTHROPIC_API_KEY` validity; check rate limit at api.anthropic.com.
- Many `success` but `cost_usd` climbing fast → review prompt-cache hit rate via `prompt_cache_read_tokens`.

### Login redirects back to /login (cookie loop)

`Secure` flag on the session cookie now follows `PUBLIC_APP_URL` (see `src/server/auth/cookies.ts`). If you're on HTTP, `PUBLIC_APP_URL` MUST start with `http://`, not `https://`. Once a TLS proxy is in front, flip `PUBLIC_APP_URL` to `https://...` and rebuild — the flag turns back on automatically.

### Login rate-limit lockout for a legit user

In-memory `loginByIp` bucket fires after 10 failed attempts in 15 min. To unblock:
```bash
docker compose restart app   # clears the in-memory rate-limit map
```
Or wait 15 minutes. Phase 4 — move to Redis-backed limiter so restart isn't needed.

### Per-school AI budget hit

Symptom: `ActionError('RATE_LIMITED', 'งบ Token AI เดือนนี้หมดแล้ว...')` in toast for a teacher.

```sql
-- Inspect usage
SELECT agent_id, SUM(total_tokens) FROM ai_run_logs
WHERE created_at >= DATE_FORMAT(NOW(), '%Y-%m-01') AND status='success'
GROUP BY agent_id;

-- Raise the budget for an agent
UPDATE agents SET monthly_token_budget = 200000 WHERE id = '<uuid>';
```

---

## 8. Pre-pilot checklist

Walk through before letting a real teacher in:

- [ ] `.env` has REAL `ANTHROPIC_API_KEY` and `AUTH_SECRET` (not placeholders)
- [ ] `DATABASE_URL` uses a scoped DB user (`snx_user`-style), not `root` — see §11 below
- [ ] `PUBLIC_APP_URL` matches what users actually type in their browser
- [ ] `curl /api/health` returns 200
- [ ] Login + create reflection + AI summarize flow works end-to-end as the teacher demo user
- [ ] Daily backup cron installed (§2) and `/var/log/snx-backup.log` shows a successful run
- [ ] Backup restore tested into a scratch DB (do this once — §2 "Verify a backup is restorable")
- [ ] Sentry DSN set (§9) so the on-call gets paged for real bugs (not validation errors)
- [ ] `Agent.monthlyTokenBudget` set per classroom agent (suggested: 50,000 tokens/agent/month for haiku at ~30 reflections/teacher/month)
- [ ] Teacher demo password rotated from `Pass1234!` to something the pilot teacher chose
- [ ] This runbook accessible to whoever's on-call

---

## 9. Error tracking (Sentry — optional, recommended for pilot)

Sentry is wired but **disabled by default**. Without `SENTRY_DSN`, the app is silent — `docker compose logs app` is the only error source.

### Enable

1. Sign up at https://sentry.io (free tier: 5k errors/mo, plenty for a 5-teacher pilot).
2. Create a project: platform = Next.js.
3. Copy the DSN: `https://<key>@<project>.ingest.sentry.io/<id>`.
4. Add to `.env`:
   ```
   SENTRY_DSN="https://<key>@<project>.ingest.sentry.io/<id>"
   NEXT_PUBLIC_SENTRY_DSN="https://<key>@<project>.ingest.sentry.io/<id>"   # same value, browser-exposed
   SENTRY_ENVIRONMENT="pilot-<schoolname>"
   SENTRY_TRACES_SAMPLE_RATE="0.1"
   ```
5. **Rebuild** — the client DSN is inlined at build time:
   ```bash
   docker compose build app
   docker compose up -d --force-recreate app
   ```
6. Trigger a deliberate error to verify — should show up in Sentry within ~30s.

### What Sentry captures

- **Server-side**: uncaught errors in Server Components, route handlers, and `INTERNAL`-returning server actions.
- **Client-side**: React errors, hydration mismatches, navigation errors.
- **Filtered out** (in `src/instrumentation.ts` + `src/lib/observability.ts`):
  - `VALIDATION` / `PERMISSION_DENIED` / `UNAUTHENTICATED` / `NOT_FOUND` / `RATE_LIMITED` — user-facing outcomes, not bugs.
  - Cookies + Authorization headers — scrubbed in `beforeSend`.
  - Request body (potentially reflection content) — replaced with `[redacted]`.
- **Disabled by default**: session replays (privacy concern with classroom content on screen).

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
# Set on host BEFORE first deploy:
CRON_SECRET="$(openssl rand -hex 24)"
echo "CRON_SECRET=\"$CRON_SECRET\"" >> .env
docker compose up -d --force-recreate app

# Fire daily-reminder manually
curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
  "${PUBLIC_APP_URL}/api/cron/daily-reminder" | jq

# Fire session cleanup
curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
  "${PUBLIC_APP_URL}/api/cron/cleanup-sessions" | jq
```

Without `CRON_SECRET`, the endpoint refuses ALL requests (401). Empty string = no secret.

### Multi-replica deploys (Phase 8+)

In-process cron fires on every replica → duplicate runs. `daily-reminder` is idempotent via UNIQUE `(school_id, run_date, job_kind)` — duplicates INSERT-fail and skip. But it's noisy/wasteful.

**Recommended for >1 replica:**
1. Set `CRON_ENABLED=false` on app containers.
2. Add external scheduler (host crontab, Vercel Cron, GitHub Actions) hitting `/api/cron/<job>` with `CRON_SECRET`.
3. Pick ONE host to be the cron-runner.

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
# 2. Add to .env:
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="SchoolNextgen <reminders@your.domain>"   # must be a verified domain
# 3. Restart the app:
docker compose up -d --force-recreate app
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

- `notifications_sent` = actual deliveries (dry-runs + failures excluded).
- `details.emailMode` = `'live'` when Resend ran, `'dry_run'` when no API key.
- `details.sendFailures` = array of `{userId, reason}` — per-recipient failures don't crash the cron.

### Email failure modes

| Symptom | Cause | Resolution |
|---|---|---|
| `emailMode='dry_run'` but `RESEND_API_KEY` is set | Key shorter than 8 chars → treated as unset | Use a real Resend key (starts with `re_`) |
| All teachers in `sendFailures` with `reason='invalid_from_address'` | `EMAIL_FROM` domain not verified in Resend | Verify the domain at https://resend.com/domains, OR use sandbox `onboarding@resend.dev` |
| One teacher in `sendFailures` per run | Their email bounces / address invalid | Check their `User.email` in DB; ask them to update |
| `notifications_sent` always 0 with key set | Cron didn't actually run | Check `/api/cron/daily-reminder` logs |

---

## 11. DB user / credential hygiene

The app should NOT connect as `root`. Create a scoped user once:

```sql
CREATE USER 'snx_user'@'%' IDENTIFIED BY '<strong-random-password>';
GRANT ALL PRIVILEGES ON school_agent_db.* TO 'snx_user'@'%';
FLUSH PRIVILEGES;
```

One-liner from the docker host:
```bash
SNX_PASS="$(openssl rand -hex 24)"; echo "snx_user password: $SNX_PASS"
docker run --rm -i -e MYSQL_PWD='<root-password>' mariadb:11 \
  mariadb -h<host> -uroot <<SQL
CREATE USER IF NOT EXISTS 'snx_user'@'%' IDENTIFIED BY '$SNX_PASS';
ALTER  USER             'snx_user'@'%' IDENTIFIED BY '$SNX_PASS';
GRANT ALL PRIVILEGES ON school_agent_db.* TO 'snx_user'@'%';
FLUSH PRIVILEGES;
SQL
```

Then update `.env`:
```
DATABASE_URL="mysql://snx_user:<SNX_PASS>@<host>:3306/school_agent_db"
```

`docker compose up -d --force-recreate app` to pick it up.

After verifying the app still works under the new user, **rotate the root password** so an old copy of `.env` can't be used to escalate.

`SHOW DATABASES;` as `snx_user` should return only `information_schema` + `school_agent_db`.

---

## 12. What's deliberately not in this runbook

- TLS termination → handled by the reverse proxy in front of `app`; out of scope here. Set `PUBLIC_APP_URL` to `https://...` once it's live and the cookie `Secure` flag flips on.
- CI/CD → Phase 4. Today: `git pull && ./scripts/deploy.sh` on the host.
- Multi-host failover → Phase 8+.
- Log aggregation (Axiom/Loki) → Phase 4. Today: `docker compose logs app` + Sentry for errors.
- Schema-per-school multi-tenancy → not in design; we're row-level (`school_id` filter).
