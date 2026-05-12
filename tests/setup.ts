/**
 * Vitest setup — runs once before any test file is collected.
 * Load .env.test so process.env is populated for any module that reads it.
 */
import { config as loadEnv } from 'dotenv'
import path from 'node:path'

loadEnv({ path: path.resolve(__dirname, '../.env.test'), override: true })
