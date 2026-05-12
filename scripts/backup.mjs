#!/usr/bin/env node
/**
 * Dump the SchoolNextgen MySQL database to a dated, gzipped file.
 * Cross-platform (Windows/macOS/Linux). Requires `mysqldump` in PATH.
 *
 * Usage:
 *   node scripts/backup.mjs                  # uses DATABASE_URL from .env / .env.local
 *   node scripts/backup.mjs --dir /backups   # custom output dir (default: ./backups)
 *   node scripts/backup.mjs --keep 30        # how many days of backups to retain (default: 30)
 *
 * Output:
 *   {dir}/snx-YYYY-MM-DD_HHMMSS.sql.gz
 *
 * Cron suggestion (Linux):
 *   0 3 * * *  cd /srv/snx && node scripts/backup.mjs >> /var/log/snx-backup.log 2>&1
 */
import { spawn } from 'node:child_process'
import { createWriteStream, existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'node:fs'
import { createGzip } from 'node:zlib'
import path from 'node:path'
import { config as loadEnv } from 'dotenv'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')

// Load env (prefer .env.local for app dev, .env for prisma defaults)
loadEnv({ path: path.join(repoRoot, '.env.local') })
loadEnv({ path: path.join(repoRoot, '.env') })

const args = process.argv.slice(2)
function readFlag(name, fallback) {
  const i = args.indexOf(`--${name}`)
  if (i < 0) return fallback
  return args[i + 1] ?? fallback
}

const outDir = path.resolve(repoRoot, readFlag('dir', './backups'))
const keepDays = Number(readFlag('keep', '30'))
const dbUrl = process.env.DATABASE_URL
if (!dbUrl) {
  console.error('❌ DATABASE_URL not set (looked in .env.local and .env)')
  process.exit(1)
}

// Parse mysql://user:pass@host:port/dbname
const m = dbUrl.match(/^mysql:\/\/([^:@/]+)(?::([^@]*))?@([^:/]+)(?::(\d+))?\/([^?]+)/)
if (!m) {
  console.error('❌ Could not parse DATABASE_URL — expected mysql://user:pass@host:port/db')
  process.exit(1)
}
const [, user, password = '', host, port = '3306', database] = m

mkdirSync(outDir, { recursive: true })

const stamp = new Date()
  .toISOString()
  .replace(/[T:]/g, '_')
  .replace(/\..+$/, '')
  .replace(/-/g, '-')
const outFile = path.join(outDir, `snx-${stamp}.sql.gz`)

// Find mysqldump. Priority: MYSQLDUMP_PATH env → Laragon (C: or D:) → PATH.
function findMysqldump() {
  if (process.env.MYSQLDUMP_PATH) return process.env.MYSQLDUMP_PATH
  if (process.platform === 'win32') {
    const candidates = ['C:\\laragon\\bin\\mysql', 'D:\\laragon\\bin\\mysql']
    for (const root of candidates) {
      if (!existsSync(root)) continue
      const versions = readdirSync(root).filter((d) => {
        try {
          return statSync(path.join(root, d)).isDirectory()
        } catch {
          return false
        }
      })
      for (const v of versions) {
        const candidate = path.join(root, v, 'bin', 'mysqldump.exe')
        if (existsSync(candidate)) return candidate
      }
    }
  }
  return 'mysqldump' // assume PATH (Linux Docker, macOS via brew)
}

const mysqldumpCmd = findMysqldump()
console.log(`🗄  Backing up ${database}@${host}:${port} → ${outFile}`)
console.log(`   using: ${mysqldumpCmd}`)

const dumpArgs = [
  `-h${host}`,
  `-P${port}`,
  `-u${user}`,
  ...(password ? [`-p${password}`] : []),
  '--single-transaction',
  '--routines',
  '--triggers',
  '--quick',
  '--default-character-set=utf8mb4',
  database,
]

const child = spawn(mysqldumpCmd, dumpArgs, { stdio: ['ignore', 'pipe', 'inherit'] })
const gzip = createGzip()
const out = createWriteStream(outFile)

child.stdout.pipe(gzip).pipe(out)

try {
  await new Promise((resolve, reject) => {
    child.on('error', (err) => {
      if (err.code === 'ENOENT') {
        reject(
          new Error(
            `mysqldump not found.\n` +
              `  Tried: ${mysqldumpCmd}\n` +
              `  Fix on Laragon: ensure C:\\laragon\\bin\\mysql\\<version>\\bin exists,\n` +
              `         or set MYSQLDUMP_PATH=<full path to mysqldump.exe>.\n` +
              `  Fix on Linux: install mysql-client (apt-get install -y default-mysql-client).`,
          ),
        )
      } else reject(err)
    })
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`mysqldump exited with code ${code}`))
    })
  })
  await new Promise((r) => out.on('close', r))
} catch (e) {
  // Clean up the empty output file on failure so we don't leave a misleading
  // zero-byte "backup" in the dir.
  try {
    if (existsSync(outFile) && statSync(outFile).size < 200) unlinkSync(outFile)
  } catch {
    /* swallow */
  }
  throw e
}

const bytes = statSync(outFile).size
if (bytes < 200) {
  unlinkSync(outFile)
  throw new Error(`Backup file is suspiciously small (${bytes} bytes) — removed.`)
}
const mb = (bytes / 1024 / 1024).toFixed(2)
console.log(`✅ Backup OK (${mb} MB)`)

// Rotate: delete snx-*.sql.gz older than `keep` days
if (keepDays > 0 && Number.isFinite(keepDays)) {
  const cutoff = Date.now() - keepDays * 24 * 60 * 60 * 1000
  let dropped = 0
  for (const f of readdirSync(outDir)) {
    if (!f.startsWith('snx-') || !f.endsWith('.sql.gz')) continue
    const full = path.join(outDir, f)
    const mtime = statSync(full).mtime.getTime()
    if (mtime < cutoff) {
      unlinkSync(full)
      dropped++
    }
  }
  if (dropped > 0) console.log(`🧹 Rotated ${dropped} backup(s) older than ${keepDays} day(s)`)
}
