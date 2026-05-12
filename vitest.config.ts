import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Stub server-only so vitest can import files that use it
      'server-only': path.resolve(__dirname, './tests/stubs/server-only.ts'),
    },
  },
  test: {
    // Most tests are server-side (Node).
    // Add `// @vitest-environment happy-dom` to the top of files that need DOM.
    environment: 'node',
    globals: false,
    include: ['src/**/*.{test,spec}.ts', 'src/**/*.{test,spec}.tsx'],
    exclude: ['node_modules', '.next'],
    testTimeout: 15_000,
    hookTimeout: 30_000,
    pool: 'forks',
    // Integration tests share one MySQL test DB. Running test files in parallel
    // forks would let them race on TRUNCATE/INSERT and corrupt each other.
    // fileParallelism: false serializes test files; per-test isolation comes
    // from beforeEach resetDb() in each integration test.
    fileParallelism: false,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**', 'src/server/**'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts', 'src/**/prompts/*'],
      reporter: ['text', 'html'],
    },
  },
})
