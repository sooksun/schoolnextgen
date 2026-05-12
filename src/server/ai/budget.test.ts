import { beforeEach, describe, expect, it } from 'vitest'
import { ActionError } from '@/lib/result'
import { resetDb, seedBasic, testPrisma, type SeededIds } from '../../../tests/fixtures'
import { assertWithinAiBudget, getAgentMonthlyTokenUsage } from './budget'

let ids: SeededIds

beforeEach(async () => {
  await resetDb()
  ids = await seedBasic()
})

async function recordRun(opts: { agentId: string; total: number; status?: string; createdAt?: Date }) {
  await testPrisma.aiRunLog.create({
    data: {
      agentId: opts.agentId,
      schoolId: ids.schoolId,
      modelProvider: 'anthropic',
      modelName: 'claude-haiku-4-5',
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: opts.total,
      status: opts.status ?? 'success',
      createdAt: opts.createdAt,
    },
  })
}

describe('getAgentMonthlyTokenUsage', () => {
  it('returns 0 when there are no runs', async () => {
    expect(await getAgentMonthlyTokenUsage(ids.agentId)).toBe(0)
  })

  it('sums totalTokens across successful runs in the current month', async () => {
    await recordRun({ agentId: ids.agentId, total: 1000 })
    await recordRun({ agentId: ids.agentId, total: 500 })
    await recordRun({ agentId: ids.agentId, total: 300 })
    expect(await getAgentMonthlyTokenUsage(ids.agentId)).toBe(1800)
  })

  it('ignores failed runs', async () => {
    await recordRun({ agentId: ids.agentId, total: 1000 })
    await recordRun({ agentId: ids.agentId, total: 9999, status: 'error' })
    expect(await getAgentMonthlyTokenUsage(ids.agentId)).toBe(1000)
  })

  it('ignores runs from previous months', async () => {
    const twoMonthsAgo = new Date()
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
    await recordRun({ agentId: ids.agentId, total: 10_000, createdAt: twoMonthsAgo })
    await recordRun({ agentId: ids.agentId, total: 500 }) // current month
    expect(await getAgentMonthlyTokenUsage(ids.agentId)).toBe(500)
  })

  it('does not bleed across agents', async () => {
    const otherAgent = await testPrisma.agent.create({
      data: {
        schoolId: ids.schoolId,
        agentType: 'classroom_assistant',
        gradeLevel: 'G3',
        name: 'AI ป.3',
        systemPrompt: 'x',
        modelProvider: 'anthropic',
        modelName: 'claude-haiku-4-5',
        temperature: 0.3,
      },
    })
    await recordRun({ agentId: ids.agentId, total: 100 })
    await recordRun({ agentId: otherAgent.id, total: 999 })
    expect(await getAgentMonthlyTokenUsage(ids.agentId)).toBe(100)
    expect(await getAgentMonthlyTokenUsage(otherAgent.id)).toBe(999)
  })
})

describe('assertWithinAiBudget', () => {
  it('allows the call when monthlyTokenBudget is null (unlimited)', async () => {
    await recordRun({ agentId: ids.agentId, total: 1_000_000 }) // huge
    const result = await assertWithinAiBudget(ids.agentId)
    expect(result.budget).toBeNull()
  })

  it('allows the call when usage < budget', async () => {
    await testPrisma.agent.update({
      where: { id: ids.agentId },
      data: { monthlyTokenBudget: 10_000 },
    })
    await recordRun({ agentId: ids.agentId, total: 4_000 })

    const result = await assertWithinAiBudget(ids.agentId)
    expect(result.used).toBe(4000)
    expect(result.budget).toBe(10_000)
  })

  it('blocks the call when usage >= budget', async () => {
    await testPrisma.agent.update({
      where: { id: ids.agentId },
      data: { monthlyTokenBudget: 5_000 },
    })
    await recordRun({ agentId: ids.agentId, total: 5_000 }) // exactly at limit

    await expect(assertWithinAiBudget(ids.agentId)).rejects.toThrow(ActionError)
    await expect(assertWithinAiBudget(ids.agentId)).rejects.toMatchObject({
      code: 'RATE_LIMITED',
    })
  })

  it('blocks when usage exceeds budget', async () => {
    await testPrisma.agent.update({
      where: { id: ids.agentId },
      data: { monthlyTokenBudget: 1_000 },
    })
    await recordRun({ agentId: ids.agentId, total: 800 })
    await recordRun({ agentId: ids.agentId, total: 500 }) // total 1300 > 1000

    await expect(assertWithinAiBudget(ids.agentId)).rejects.toMatchObject({
      code: 'RATE_LIMITED',
    })
  })

  it('NOT_FOUND for a non-existent agent', async () => {
    await expect(
      assertWithinAiBudget('00000000-0000-0000-0000-000000000000'),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })
})
