#!/usr/bin/env bash
# SchoolNextgen production deploy script.
#
# Pulls latest code, backs up the DB, applies migrations, rebuilds the app
# container, restarts it, and runs a health check. Aborts on first failure.
#
# Usage:
#   ./scripts/deploy.sh                # deploy main
#   ./scripts/deploy.sh v1.2.0         # deploy a specific tag/branch/sha
#   SKIP_BACKUP=1 ./scripts/deploy.sh  # skip pre-deploy backup (NOT recommended)
#   SKIP_MIGRATE=1 ./scripts/deploy.sh # skip prisma migrate deploy
#
# Expects to run on the server inside the repo root (e.g. /DATA/AppData/www/schoolnextgen)
# with docker compose already configured and `.env` present.

set -euo pipefail

REF="${1:-main}"
APP_URL="${APP_URL:-http://localhost:3000}"
COMPOSE="${COMPOSE:-docker compose}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"

log() { printf '\033[1;34m[deploy]\033[0m %s\n' "$*"; }
err() { printf '\033[1;31m[deploy] ERROR:\033[0m %s\n' "$*" >&2; }

trap 'err "Deploy failed at line $LINENO. Container state below:"; $COMPOSE ps || true' ERR

# ── 0. Sanity checks ─────────────────────────────────────────────
[[ -f docker-compose.yml ]] || { err "docker-compose.yml not found — run from repo root"; exit 1; }
[[ -f .env ]] || { err ".env not found — production env required"; exit 1; }
command -v git >/dev/null || { err "git not in PATH"; exit 1; }

if [[ -n "$(git status --porcelain)" ]]; then
  err "Working tree is dirty. Commit/stash local changes before deploy:"
  git status --short
  exit 1
fi

PREV_SHA="$(git rev-parse HEAD)"
log "Current HEAD: $PREV_SHA"
log "Target ref:   $REF"

# ── 1. Backup DB ─────────────────────────────────────────────────
# Compose's mysql service has MYSQL_ROOT_PASSWORD set (see docker-compose.yml),
# so mysqldump must authenticate. Read it from .env and pass via MYSQL_PWD so
# the password doesn't show up in `ps` inside the container.
read_env_var() {
  grep -E "^$1=" .env 2>/dev/null | head -1 | cut -d= -f2- \
    | sed -e 's/^"\(.*\)"$/\1/' -e "s/^'\(.*\)'$/\1/"
}

if [[ -z "${SKIP_BACKUP:-}" ]]; then
  MYSQL_ROOT_PASSWORD="$(read_env_var MYSQL_ROOT_PASSWORD)"
  MYSQL_DATABASE="$(read_env_var MYSQL_DATABASE)"
  MYSQL_DATABASE="${MYSQL_DATABASE:-school_agent_db}"

  if [[ -z "$MYSQL_ROOT_PASSWORD" ]]; then
    err "MYSQL_ROOT_PASSWORD not set in .env — cannot authenticate mysqldump."
    err "Either set it in .env, or rerun with SKIP_BACKUP=1 (risky — no rollback safety net)."
    exit 1
  fi

  log "Backing up MySQL ($MYSQL_DATABASE) before migrate..."
  mkdir -p "$BACKUP_DIR"
  STAMP="$(date +%F_%H%M%S)"
  BACKUP_FILE="$BACKUP_DIR/pre-deploy-${STAMP}.sql.gz"
  $COMPOSE exec -T -e MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysql \
    mysqldump -uroot --single-transaction --quick --routines "$MYSQL_DATABASE" \
    | gzip > "$BACKUP_FILE"
  SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  log "Backup written: $BACKUP_FILE ($SIZE)"
else
  log "SKIP_BACKUP=1 — skipping backup (risky)"
fi

# ── 2. Pull latest code ──────────────────────────────────────────
log "Fetching origin..."
git fetch --all --tags --prune

log "Checking out $REF..."
git checkout "$REF"
git pull --ff-only origin "$REF" || log "(no fast-forward — likely a tag/sha, continuing)"

NEW_SHA="$(git rev-parse HEAD)"
if [[ "$PREV_SHA" == "$NEW_SHA" ]]; then
  log "Already at $NEW_SHA — nothing to deploy"
  exit 0
fi
log "Will deploy: $PREV_SHA → $NEW_SHA"
git --no-pager log --oneline "${PREV_SHA}..${NEW_SHA}" || true

# ── 3. Build app image ───────────────────────────────────────────
log "Building app image..."
$COMPOSE build app

# ── 4. Apply Prisma migrations ───────────────────────────────────
if [[ -z "${SKIP_MIGRATE:-}" ]]; then
  log "Running prisma migrate deploy..."
  $COMPOSE run --rm app pnpm prisma migrate deploy
else
  log "SKIP_MIGRATE=1 — skipping migrations"
fi

# ── 5. Restart app ───────────────────────────────────────────────
log "Restarting app container..."
$COMPOSE up -d app

# ── 6. Health check (60s window) ─────────────────────────────────
log "Waiting for /api/health to return 200..."
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
  err "  source .env && gunzip < $BACKUP_FILE | $COMPOSE exec -T -e MYSQL_PWD=\"\$MYSQL_ROOT_PASSWORD\" mysql mysql -uroot ${MYSQL_DATABASE:-school_agent_db}"
else
  err "  # No pre-deploy backup taken (SKIP_BACKUP was set). Restore from your most recent backup in $BACKUP_DIR/ if needed."
fi
$COMPOSE logs --tail=80 app
exit 1
