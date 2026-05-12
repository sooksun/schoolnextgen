# syntax=docker/dockerfile:1.7

# ============================================================
# Stage 1: deps — install node_modules (cached layer)
# ============================================================
FROM node:22-alpine AS deps
WORKDIR /app

# OpenSSL needed by Prisma engine on Alpine
RUN apk add --no-cache libc6-compat openssl

# Enable pnpm via corepack — pin to the version in package.json
RUN corepack enable

COPY package.json pnpm-lock.yaml .npmrc ./
# --ignore-scripts: none of the postinstall scripts are needed at install
# time. Prisma engines are pulled by the explicit `pnpm prisma generate`
# step in the builder stage. sharp/msw/unrs-resolver scripts only matter
# for dev tooling or unused features.
ENV CI=true
RUN pnpm install --frozen-lockfile --prod=false --ignore-scripts

# ============================================================
# Stage 2: builder — generate Prisma client, build Next.js
# ============================================================
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV CI=true

# Placeholder env for the build itself. Next.js evaluates route modules to
# collect page data, which imports src/lib/env.ts → Zod validation. Real
# values are injected at container runtime via docker-compose.yml. These
# must satisfy the Zod schema but are never used at runtime.
ENV DATABASE_URL="mysql://build:build@localhost:3306/build"
ENV AUTH_SECRET="build-time-placeholder-do-not-use-in-runtime-thirtytwo+"
ENV ANTHROPIC_API_KEY="sk-ant-build-time-placeholder-not-real"

# Prisma client must be generated against the linux-musl target. Schema already
# lists it under generator.binaryTargets.
RUN pnpm prisma generate
RUN pnpm build

# ============================================================
# Stage 3: runner — minimal runtime image
# ============================================================
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl wget && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV UPLOAD_DIR=/data/uploads

# Next.js standalone output bundles server.js + only the runtime deps needed.
# Prisma's linux-musl query engine is included via outputFileTracingIncludes
# in next.config.ts — it travels with the standalone bundle, no extra COPY.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Schema is needed at runtime + lets us run `prisma migrate deploy` from inside
# the container during first deploy or upgrade. Also bring the prisma CLI
# itself so `docker compose exec app pnpm prisma migrate deploy` works.
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Uploads volume mount point (must be writable by nextjs user)
RUN mkdir -p /data/uploads && chown -R nextjs:nodejs /data

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health > /dev/null || exit 1

CMD ["node", "server.js"]
