import { z } from 'zod'

const EnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 chars (use `openssl rand -hex 32`)'),
  SESSION_COOKIE_NAME: z.string().default('snx_session'),
  ANTHROPIC_API_KEY: z.string().regex(/^sk-ant-/, 'ANTHROPIC_API_KEY must start with sk-ant-'),
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().int().positive().default(100),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  // ─── Sentry (optional) ────────────────────────────────────
  // When SENTRY_DSN is empty/missing, Sentry is disabled and the app boots
  // exactly as before — no network calls, no extra logs. Same for client.
  SENTRY_DSN: z.string().optional(),
  SENTRY_ENVIRONMENT: z.string().optional(), // override NODE_ENV in Sentry UI (e.g., "pilot-bpr-school")
  SENTRY_TRACES_SAMPLE_RATE: z.coerce.number().min(0).max(1).default(0.1),
  // ─── Cron / background jobs ───────────────────────────────
  // CRON_ENABLED='true' starts in-process schedulers (node-cron). Default off
  // in dev/test, on in production docker. Disable on multi-replica deploys
  // and use external cron + the /api/cron/[job] endpoint instead.
  CRON_ENABLED: z.string().optional(),
  // CRON_SECRET protects /api/cron/[job]. Without it the endpoint refuses
  // ALL requests — never trust "anyone can call it".
  CRON_SECRET: z.string().min(16).optional(),
  // ─── Email (Resend — optional) ────────────────────────────
  // Missing RESEND_API_KEY → email features run in dry-run mode (log "would
  // send to X" but don't actually call Resend). First consumer: T-131 daily
  // reminder hook in src/server/cron/daily-reminder.ts.
  RESEND_API_KEY: z.string().optional(),
  // From header. Must match a verified domain in Resend. For pilot without
  // a verified domain, Resend provides 'onboarding@resend.dev' sandbox.
  EMAIL_FROM: z.string().default('SchoolNextgen <onboarding@resend.dev>'),
})

const parsed = EnvSchema.safeParse(process.env)
if (!parsed.success) {
  console.error('❌ Invalid environment variables:')
  for (const issue of parsed.error.issues) {
    console.error(`  • ${issue.path.join('.')}: ${issue.message}`)
  }
  throw new Error('Environment validation failed. See errors above.')
}

export const env = parsed.data
export type Env = typeof env
