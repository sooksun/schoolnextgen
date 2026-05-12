#!/usr/bin/env bash
# Daily MariaDB backup for SchoolNextgen prod (external-DB topology).
#
# Reads DATABASE_URL from .env, dumps via a one-shot mariadb:11 container,
# gzips to ./backups/, and rotates anything older than KEEP_DAYS (30 by default).
#
# Designed for a cron entry on the docker host:
#   0 3 * * *  /DATA/AppData/www/schoolnextgen/scripts/backup-prod.sh \
#               >> /var/log/snx-backup.log 2>&1
#
# Cron runs with a stripped PATH and no working dir — both are handled below.

set -euo pipefail

# Resolve the repo root regardless of where cron invoked us from.
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# cron's PATH usually lacks /usr/local/bin where docker lives.
export PATH="/usr/local/bin:/usr/bin:/bin:${PATH:-}"

BACKUP_DIR="${BACKUP_DIR:-${REPO_ROOT}/backups}"
KEEP_DAYS="${KEEP_DAYS:-30}"
MARIADB_IMAGE="${MARIADB_IMAGE:-mariadb:11}"

log()  { printf '[%s] %s\n' "$(date -Iseconds)" "$*"; }
fail() { printf '[%s] ERROR: %s\n' "$(date -Iseconds)" "$*" >&2; exit 1; }

[[ -f .env ]]                || fail ".env not found in $REPO_ROOT"
command -v docker >/dev/null || fail "docker not in PATH (PATH=$PATH)"

# Parse DATABASE_URL out of .env (handles quoted / unquoted values).
DATABASE_URL_VAL="$(grep -E '^DATABASE_URL=' .env | head -1 | cut -d= -f2- \
                    | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")"
[[ -n "$DATABASE_URL_VAL" ]] || fail "DATABASE_URL not set in .env"

if [[ "$DATABASE_URL_VAL" =~ ^mysql://([^:@/]+)(:([^@]*))?@([^:/]+)(:([0-9]+))?/([^?]+) ]]; then
  DB_USER="${BASH_REMATCH[1]}"
  DB_PASSWORD="${BASH_REMATCH[3]}"
  DB_HOST="${BASH_REMATCH[4]}"
  DB_PORT="${BASH_REMATCH[6]:-3306}"
  DB_NAME="${BASH_REMATCH[7]}"
else
  fail "Could not parse DATABASE_URL — expected mysql://user:pass@host:port/db"
fi
[[ -n "$DB_PASSWORD" ]] || fail "DATABASE_URL has no password"

mkdir -p "$BACKUP_DIR"
STAMP="$(date +%F_%H%M%S)"
BACKUP_FILE="$BACKUP_DIR/daily-${STAMP}.sql.gz"

log "Backing up ${DB_NAME} from ${DB_HOST}:${DB_PORT} as ${DB_USER} → ${BACKUP_FILE}"

# MYSQL_PWD keeps the password out of argv (would otherwise show in `ps`).
docker run --rm -e MYSQL_PWD="$DB_PASSWORD" "$MARIADB_IMAGE" \
  mariadb-dump -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" \
    --single-transaction --quick --routines --triggers \
    --default-character-set=utf8mb4 "$DB_NAME" \
  | gzip > "$BACKUP_FILE"

# Sanity-check the dump. A truly empty gzip is 20 bytes; an empty schema dump
# from mariadb-dump is a few hundred bytes; a real DB is many KB+. Anything
# under 1KB is almost certainly a silent failure.
SIZE_BYTES=$(stat -c '%s' "$BACKUP_FILE" 2>/dev/null || stat -f '%z' "$BACKUP_FILE")
if [[ "$SIZE_BYTES" -lt 1024 ]]; then
  rm -f "$BACKUP_FILE"
  fail "Backup file suspiciously small (${SIZE_BYTES} bytes) — removed"
fi

SIZE_HUMAN="$(du -h "$BACKUP_FILE" | cut -f1)"
log "Backup OK: $BACKUP_FILE ($SIZE_HUMAN)"

# Rotate: delete daily-*.sql.gz older than KEEP_DAYS.
DROPPED=0
while IFS= read -r f; do
  rm -f "$f"
  DROPPED=$((DROPPED + 1))
done < <(find "$BACKUP_DIR" -name 'daily-*.sql.gz' -type f -mtime +"$KEEP_DAYS" 2>/dev/null)
(( DROPPED > 0 )) && log "Rotated $DROPPED backup(s) older than ${KEEP_DAYS} day(s)"

exit 0
