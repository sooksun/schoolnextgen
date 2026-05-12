import 'server-only'

/**
 * Task → model mapping per D-005 (Cloud AI policy).
 * Prices are USD per 1M tokens. Used by `calcCost()` for `ai_run_logs.cost_usd`.
 *
 * Source: Anthropic pricing page (cached estimates as of 2026-05).
 * If pricing changes, update here and re-run analytics.
 */

export type ModelId =
  | 'claude-haiku-4-5'
  | 'claude-sonnet-4-6'
  | 'claude-opus-4-7'

export const MODEL_PRICING: Record<ModelId, {
  inputPerMTok: number
  outputPerMTok: number
  cacheWritePerMTok: number  // 1.25× input typical
  cacheReadPerMTok: number   // 0.10× input typical
}> = {
  'claude-haiku-4-5': {
    inputPerMTok: 1.0,
    outputPerMTok: 5.0,
    cacheWritePerMTok: 1.25,
    cacheReadPerMTok: 0.1,
  },
  'claude-sonnet-4-6': {
    inputPerMTok: 3.0,
    outputPerMTok: 15.0,
    cacheWritePerMTok: 3.75,
    cacheReadPerMTok: 0.3,
  },
  'claude-opus-4-7': {
    inputPerMTok: 15.0,
    outputPerMTok: 75.0,
    cacheWritePerMTok: 18.75,
    cacheReadPerMTok: 1.5,
  },
}

export const TASK_MODEL_MAP = {
  reflection_summary: 'claude-haiku-4-5' as ModelId,
  lesson_plan_review: 'claude-sonnet-4-6' as ModelId,
  command_breakdown: 'claude-sonnet-4-6' as ModelId,
  plc_aggregation: 'claude-opus-4-7' as ModelId,
  sar_synthesis: 'claude-opus-4-7' as ModelId,
} as const

export function calcCostUsd(
  model: ModelId,
  usage: {
    input_tokens: number
    output_tokens: number
    cache_creation_input_tokens?: number | null
    cache_read_input_tokens?: number | null
  },
): number {
  const p = MODEL_PRICING[model]
  if (!p) return 0
  const cents =
    (usage.input_tokens * p.inputPerMTok) +
    (usage.output_tokens * p.outputPerMTok) +
    ((usage.cache_creation_input_tokens ?? 0) * p.cacheWritePerMTok) +
    ((usage.cache_read_input_tokens ?? 0) * p.cacheReadPerMTok)
  return Number((cents / 1_000_000).toFixed(6))
}
