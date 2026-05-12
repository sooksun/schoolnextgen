import 'server-only'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { calcCostUsd, type ModelId } from './model-config'
import type { AnthropicUsage } from './anthropic'

export type LogAiRunInput = {
  agentId: string
  schoolId: string | null
  conversationId?: string | null
  modelProvider: string
  modelName: string
  usage: AnthropicUsage | null
  latencyMs: number
  status: 'success' | 'error'
  errorMessage?: string | null
}

/**
 * Log a single AI API call. Accepts either the global `prisma` instance or
 * a transaction client — pass `tx` when this is part of a larger transaction.
 */
export async function logAiRun(
  client: Prisma.TransactionClient | typeof prisma,
  input: LogAiRunInput,
): Promise<void> {
  const usage = input.usage ?? {
    input_tokens: 0,
    output_tokens: 0,
    cache_creation_input_tokens: 0,
    cache_read_input_tokens: 0,
  }

  const cost = input.status === 'success'
    ? calcCostUsd(input.modelName as ModelId, usage)
    : 0

  await client.aiRunLog.create({
    data: {
      conversationId: input.conversationId ?? null,
      agentId: input.agentId,
      schoolId: input.schoolId,
      modelProvider: input.modelProvider,
      modelName: input.modelName,
      promptTokens: usage.input_tokens,
      completionTokens: usage.output_tokens,
      totalTokens: usage.input_tokens + usage.output_tokens,
      promptCacheReadTokens: usage.cache_read_input_tokens ?? 0,
      promptCacheCreationTokens: usage.cache_creation_input_tokens ?? 0,
      costUsd: cost,
      latencyMs: input.latencyMs,
      status: input.status,
      errorMessage: input.errorMessage ?? null,
    },
  })
}
