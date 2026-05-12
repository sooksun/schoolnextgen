#!/usr/bin/env bash
# SchoolNextgen production deploy script.
#
# Production topology:
#   - App runs in Docker Compose (single `app` service).
#   - Database is an EXTERNAL MariaDB on the LAN (e.g. 192.168.1.4:3306) —
#     NOT a compose service. DATABASE_URL in .env carries the connection.
#
# Sequence: preflight (TCP + auth) → backup → pull → build → migrate → restart
#          → /api/health. Aborts on first failure.
#
# Usage:
#   ./scripts/deploy.sh                # deploy main
#   ./scripts/deploy.sh v1.2.0         # deploy a specific tag/branch/sha
#   SKIP_BACKUP=1 ./scripts/deploy.sh  # skip pre-deploy backup (NOT recommended)
#   SKIP_MIGRATE=1 ./scripts/deploy.sh # skip prisma migrate deploy
#
# Run from the repo root on the server (e.g. /DATA/AppData/www/schoolnextgen)
# with .env present and docker compose v2 available.

set -euo pipefail

REF="${1:-main}"
# APP_URL is computed after preflight reads APP_PORT from .env. Set the
# APP_URL env var when invoking to override (e.g. healthcheck via TLS proxy):
#   APP_URL=https://snx.example.com ./scripts/deploy.sh
COMPOSE="${COMPOSE:-docker compose}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
MARIADB_IMAGE="${MARIADB_IMAGE:-mariadb:11}"

log() { printf '\033[1;34m[deploy]\033[0m %s\n' "$*"; }
err() { printf '\033[1;31m[deploy] ERROR:\033[0m %s\n' "$*" >&2; }

trap 'err "Deploy failed at line $LINENO. Container state below:"; $COMPOSE ps || true' ERR

# ── 0. Sanity checks ─────────────────────────────────────────────
[[ -f docker-compose.yml ]] || { err "docker-compose.yml not found — run from repo root"; exit 1; }
[[ -f .env ]] || { err ".env not found — production env required"; exit 1; }
command -v git    >/dev/null || { err "git not in PATH"; exit 1; }
command -v docker >/dev/null || { err "docker not in PATH"; exit 1; }

if [[ -n "$(git status --porcelain)" ]]; then
  err "Working tree is dirty. Commit/stash local changes before deploy:"
  git status --short
  exit 1
fi

PREV_SHA="$(git rev-parse HEAD)"
log "Current HEAD: $PREV_SHA"
log "Target ref:   $REF"

# ── 1. Preflight: parse DATABASE_URL + DB reachability ───────────
# Verify TCP + auth against the external MariaDB BEFORE pulling/building,
# so a misconfigured .env aborts cheaply instead of mid-migration.

read_env_var() {
  grep -E "^$1=" .env 2>/dev/null | head -1 | cut -d= -f2- \
    | sed -e 's/^"\(.*\)"$/\1/' -e "s/^'\(.*\)'$/\1/"
}

DATABASE_URL_VAL="$(read_env_var DATABASE_URL)"
[[ -n "$DATABASE_URL_VAL" ]] || { err "DATABASE_URL not set in .env"; exit 1; }

# Parse mysql://user:pass@host:port/dbname[?...]
if [[ "$DATABASE_URL_VAL" =~ ^mysql://([^:@/]+)(:([^@]*))?@([^:/]+)(:([0-9]+))?/([^?]+) ]]; then
  DB_USER="${BASH_REMATCH[1]}"
  DB_PASSWORD="${BASH_REMATCH[3]}"
  DB_HOST="${BASH_REMATCH[4]}"
  DB_PORT="${BASH_REMATCH[6]:-3306}"
  DB_NAME="${BASH_REMATCH[7]}"
else
  err "Could not parse DATABASE_URL — expected mysql://user:pass@host:port/db"
  exit 1
fi
[[ -n "$DB_PASSWORD" ]] || { err "DATABASE_URL has no password — refusing to deploy against an unauthenticated DB"; exit 1; }

APP_PORT_VAL="$(read_env_var APP_PORT)"

log "Preflight target: ${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

# 1a. TCP-level reachability (bash builtin /dev/tcp; 5s timeout; no extra tools).
if ! timeout 5 bash -c "</dev/tcp/${DB_HOST}/${DB_PORT}" 2>/dev/null; then
  err "Cannot reach ${DB_HOST}:${DB_PORT} (TCP). Check network/firewall/MariaDB bind-address."
  exit 1
fi
log "OK: TCP ${DB_HOST}:${DB_PORT} reachable"

# 1b. Auth + database existence via one-shot mariadb client container.
if ! docker run --rm -e MYSQL_PWD="$DB_PASSWORD" "$MARIADB_IMAGE" \
      mariadb -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -D"$DB_NAME" -e "SELECT 1" \
      >/dev/null 2>&1; then
  err "MariaDB auth failed or database '${DB_NAME}' not accessible on ${DB_HOST}:${DB_PORT}."
  err "Re-run for detail:"
  err "  docker run --rm -e MYSQL_PWD=\"\$DB_PASSWORD\" $MARIADB_IMAGE mariadb -h${DB_HOST} -P${DB_PORT} -u${DB_USER} -D${DB_NAME} -e 'SELECT 1'"
  exit 1
fi
log "OK: MariaDB auth + database '${DB_NAME}' accessible"

# ── 2. Backup DB ─────────────────────────────────────────────────
if [[ -z "${SKIP_BACKUP:-}" ]]; then
  log "Backing up ${DB_NAME} from ${DB_HOST}..."
  mkdir -p "$BACKUP_DIR"
  STAMP="$(date +%F_%H%M%S)"
  BACKUP_FILE="$BACKUP_DIR/pre-deploy-${STAMP}.sql.gz"
  # mariadb-dump runs in a one-shot container that reaches the external DB
  # over the host's network. MYSQL_PWD keeps the password out of argv.
  docker run --rm -e MYSQL_PWD="$DB_PASSWORD" "$MARIADB_IMAGE" \
    mariadb-dump -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" \
      --single-transaction --quick --routines --triggers \
      --default-character-set=utf8mb4 "$DB_NAME" \
    | gzip > "$BACKUP_FILE"
  SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  log "Backup written: $BACKUP_FILE ($SIZE)"
else
  log "SKIP_BACKUP=1 — skipping backup (risky)"
fi

# ── 3. Pull latest code ──────────────────────────────────────────
log "Fetching origin..."
git fetch --all --tags --prune

log "Checking out $REF..."
git checkout "$REF"
git pull --ff-only origin "$REF" || log "(no fast-forward — likely a tag/sha, continuing)"

NEW_SHA="$(git rev-parse HEAD)"
if [[ "$PREV_SHA" == "$NEW_SHA" ]]; then
  # HEAD unchanged. If the app container is already running, we're done —
  # otherwise treat this as a first-time bootstrap and proceed with build +
  # migrate + start so the new server actually gets the app up.
  if [[ -n "$($COMPOSE ps --status running -q app 2>/dev/null)" ]]; then
    log "Already at $NEW_SHA and app container is running — nothing to deploy"
    exit 0
  fi
  log "HEAD unchanged but app container is not running — bootstrapping deploy"
else
  log "Will deploy: $PREV_SHA → $NEW_SHA"
  git --no-pager log --oneline "${PREV_SHA}..${NEW_SHA}" || true
fi

# ── 4. Build app image ───────────────────────────────────────────
log "Building app image..."
$COMPOSE build app

# ── 5. Apply Prisma migrations ───────────────────────────────────
# The production runner image is slim (Next.js standalone only) — no
# `pnpm`, no `prisma` CLI. So we build the Dockerfile's `builder` stage
# as a one-shot migrator image. Builder layers are cached from step 4
# (`compose build app`), so this is mostly cache replay plus image export.
# DATABASE_URL is passed explicitly because the migrator image runs via
# `docker run`, not compose, and so doesn't auto-read .env.
if [[ -z "${SKIP_MIGRATE:-}" ]]; then
  log "Building migrator image (Dockerfile target=builder)..."
  docker build --target builder -t schoolnextgen-migrator:latest .
  log "Running prisma migrate deploy..."
  docker run --rm -e DATABASE_URL="$DATABASE_URL_VAL" \
    schoolnextgen-migrator:latest \
    pnpm prisma migrate deploy
else
  log "SKIP_MIGRATE=1 — skipping migrations"
fi

# ── 6. Restart app ───────────────────────────────────────────────
log "Restarting app container..."
$COMPOSE up -d app

# ── 7. Health check (60s window) ─────────────────────────────────
APP_URL="${APP_URL:-http://localhost:${APP_PORT_VAL:-3000}}"
log "Waiting for $APP_URL/api/health to return 200..."
for i in $(seq 1 30); do
  if curl -fsS -o /dev/null -w '%{http_code}' "$APP_URL/api/health" | grep -q '^200$'; then
    log "Health check passed after ${i}x2s"
    log "Deploy complete: $NEW_SHA"
    $COMPOSE ps
    exit 0
  fi
  sleep 2
done

# ── Rollback hint ────────────────────────────────────────────────
err "Health check failed after 60s. To roll back:"
err "  git checkout $PREV_SHA && $COMPOSE build app && $COMPOSE up -d app"
if [[ -n "${BACKUP_FILE:-}" ]]; then
  err "  # If migrations ran, restore DB from $BACKUP_FILE:"
  err "  MYSQL_PWD='<password from DATABASE_URL>' gunzip < $BACKUP_FILE | docker run --rm -i -e MYSQL_PWD $MARIADB_IMAGE mariadb -h${DB_HOST} -P${DB_PORT} -u${DB_USER} ${DB_NAME}"
else
  err "  # No pre-deploy backup taken (SKIP_BACKUP was set). Restore from your most recent backup in $BACKUP_DIR/ if needed."
fi
$COMPOSE logs --tail=80 app
exit 1
