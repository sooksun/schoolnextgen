import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import { env } from '@/lib/env'

const globalForAnthropic = globalThis as unknown as { anthropic?: Anthropic }

export const anthropic =
  globalForAnthropic.anthropic ??
  new Anthropic({
    apiKey: env.ANTHROPIC_API_KEY,
    maxRetries: 2,
  })

if (env.NODE_ENV !== 'production') globalForAnthropic.anthropic = anthropic

export type AnthropicUsage = {
  input_tokens: number
  output_tokens: number
  cache_creation_input_tokens?: number | null
  cache_read_input_tokens?: number | null
}
