import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle (only the files needed at runtime)
  // under `.next/standalone/`. Docker image copies just that + static + public.
  output: 'standalone',

  // Ensure Prisma's query engine binaries + schema are bundled in the
  // standalone output. nft doesn't auto-trace these because they're loaded
  // dynamically via require() at runtime. Without this, the container starts
  // but Prisma fails with "Cannot find module libquery_engine-*.so.node".
  outputFileTracingIncludes: {
    '/**/*': [
      './node_modules/.pnpm/@prisma+client*/node_modules/.prisma/client/*.so.node',
      './node_modules/.pnpm/@prisma+client*/node_modules/.prisma/client/schema.prisma',
      './prisma/schema.prisma',
    ],
  },

  experimental: {
    // Server Actions are stable since Next 14, but the bodySizeLimit option
    // still lives under `experimental.serverActions` in Next 16.
    serverActions: {
      bodySizeLimit: '110mb',
    },
  },
}

export default nextConfig
