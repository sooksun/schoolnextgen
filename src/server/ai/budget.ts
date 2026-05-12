import 'server-only'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { ActionError } from '@/lib/result'

/**
 * Sum tokens used by an agent for the current calendar month (successful calls only).
 * Failed calls don't count toward the budget — we don't want a flaky network
 * to penalize the school.
 */
export async function getAgentMonthlyTokenUsage(
  agentId: string,
  client: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<number> {
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const agg = await client.aiRunLog.aggregate({
    where: {
      agentId,
      status: 'success',
      createdAt: { gte: startOfMonth },
    },
    _sum: { totalTokens: true },
  })
  return agg._sum.totalTokens ?? 0
}

/**
 * Throw if the agent's monthly token usage has already reached its budget.
 * No budget set (NULL) → no limit. Call BEFORE the Anthropic stream begins.
 *
 * Returns { used, budget } when within budget — useful for surfacing
 * "ใช้ไปแล้ว 8,400 / 50,000 tokens" in the UI later.
 */
export async function assertWithinAiBudget(
  agentId: string,
): Promise<{ used: number; budget: number | null }> {
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    select: { monthlyTokenBudget: true },
  })
  if (!agent) {
    throw new ActionError('NOT_FOUND', 'ไม่พบ Agent')
  }
  if (agent.monthlyTokenBudget == null) {
    return { used: 0, budget: null } // unlimited
  }
  const budget = Number(agent.monthlyTokenBudget) // BigInt → number safe up to 2^53
  const used = await getAgentMonthlyTokenUsage(agentId)
  if (used >= budget) {
    throw new ActionError(
      'RATE_LIMITED',
      `งบ Token AI เดือนนี้หมดแล้ว (ใช้ ${used.toLocaleString()} / ${budget.toLocaleString()})`,
    )
  }
  return { used, budget }
}
