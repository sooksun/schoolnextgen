import { beforeEach, describe, expect, it, vi } from 'vitest'
import { resetDb, seedBasic, fakeScope, testPrisma, type SeededIds } from '../../../tests/fixtures'

// ──── @ai-sdk/rsc mock ───────────────────────────────────────
// The real createStreamableValue / readStreamableValue require RSC runtime
// context and don't work in vitest. Stub with a tiny queue that matches the
// producer + consumer contract.
type Sink<T> = { chunks: T[]; done: boolean; err: unknown; waiters: Array<() => void> }
const tickSink = <T,>(s: Sink<T>) => {
  const w = s.waiters
  s.waiters = []
  for (const r of w) r()
}

vi.mock('@ai-sdk/rsc', () => ({
  createStreamableValue: <T,>(initial: T) => {
    const sink: Sink<T> = { chunks: [initial], done: false, err: null, waiters: [] }
    return {
      value: sink,
      update: (v: T) => {
        sink.chunks.push(v)
        tickSink(sink)
      },
      done: () => {
        sink.done = true
        tickSink(sink)
      },
      error: (e: unknown) => {
        sink.err = e
        sink.done = true
        tickSink(sink)
      },
    }
  },
  readStreamableValue: async function* <T>(sink: Sink<T>) {
    let i = 0
    while (true) {
      while (i < sink.chunks.length) yield sink.chunks[i++]
      if (sink.done) {
        if (sink.err) throw sink.err
        return
      }
      await new Promise<void>((r) => sink.waiters.push(r))
    }
  },
}))

const { readStreamableValue } = await import('@ai-sdk/rsc')

// ──── Anthropic SDK mock ─────────────────────────────────────
// Build a fake stream object matching the shape of `messages.stream`:
//   - AsyncIterable of MessageStreamEvent ({ type: 'content_block_delta', delta: { type: 'text_delta', text } })
//   - .finalMessage() returning a Message with .usage
type FakeUsage = {
  input_tokens: number
  output_tokens: number
  cache_creation_input_tokens?: number
  cache_read_input_tokens?: number
}

function makeFakeStream(chunks: string[], usage: FakeUsage = { input_tokens: 1500, output_tokens: 80 }) {
  let finalText = chunks.join('')
  return {
    [Symbol.asyncIterator]() {
      let i = 0
      return {
        async next() {
          if (i < chunks.length) {
            return {
              value: {
                type: 'content_block_delta',
                delta: { type: 'text_delta', text: chunks[i++] },
              },
              done: false,
            }
          }
          return { value: undefined, done: true }
        },
      }
    },
    async finalMessage() {
      return { usage, content: [{ type: 'text', text: finalText }] }
    },
  }
}

vi.mock('@/server/ai/anthropic', () => ({
  anthropic: {
    messages: {
      stream: vi.fn(),
    },
  },
}))

const scopeMock = vi.hoisted(() => ({ current: null as ReturnType<typeof fakeScope> | null }))
vi.mock('@/server/tenant/scope', () => ({
  requireScope: async () => {
    if (!scopeMock.current) throw new Error('no fake scope set')
    return scopeMock.current
  },
  resolveCurrentScope: async () => scopeMock.current,
  SCOPE_COOKIE_NAME: 'snx_test_school',
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

const { anthropic } = await import('@/server/ai/anthropic')
const streamMock = anthropic.messages.stream as unknown as ReturnType<typeof vi.fn>
const { summarizeReflectionAction } = await import('./summarize')
const { createReflectionAction } = await import('./actions')

let ids: SeededIds

beforeEach(async () => {
  await resetDb()
  ids = await seedBasic()
  streamMock.mockReset()
  scopeMock.current = null
})

async function createReflectionForTeacher(): Promise<string> {
  scopeMock.current = fakeScope({ ids, role: 'teacher' })
  const r = await createReflectionAction({
    reflectionDate: '2026-05-11',
    subject: 'ภาษาไทย',
    topic: 'คำควบกล้ำ',
    whatHappened: 'นักเรียนมีส่วนร่วมดี',
    successes: 'ทุกคนอ่านออก',
  })
  if (!r.ok) throw new Error('seed reflection failed: ' + r.error)
  return r.data.id
}

async function consumeStream(output: unknown): Promise<string[]> {
  const chunks: string[] = []
  for await (const v of readStreamableValue(output as never)) {
    if (typeof v === 'string') chunks.push(v)
  }
  return chunks
}

describe('summarizeReflectionAction — happy path', () => {
  it('streams tokens, persists summary, advances status, logs run', async () => {
    streamMock.mockReturnValue(
      makeFakeStream([
        '{"summary":"',
        'นักเรียนเข้าใจ',
        'คำควบกล้ำดี',
        '","tags":["',
        'อ่านออกเขียนได้',
        '"]}',
      ]),
    )
    const reflectionId = await createReflectionForTeacher()

    const result = await summarizeReflectionAction(reflectionId)
    const chunks = await consumeStream(result.output)

    // Streaming yielded incremental accumulated values
    expect(chunks.length).toBeGreaterThan(1)
    // Final emitted value should be the parsed clean summary (no JSON brackets)
    expect(chunks.at(-1)).toBe('นักเรียนเข้าใจคำควบกล้ำดี')

    // Reflection row updated
    const updated = await testPrisma.teacherDailyReflection.findUniqueOrThrow({
      where: { id: reflectionId },
    })
    expect(updated.status).toBe('ai_summarized')
    expect(updated.aiSummary).toBe('นักเรียนเข้าใจคำควบกล้ำดี')
    expect(updated.aiTags).toEqual(['อ่านออกเขียนได้'])

    // ReflectionAiSummary row created
    const summaries = await testPrisma.reflectionAiSummary.findMany({
      where: { reflectionId },
    })
    expect(summaries).toHaveLength(1)
    expect(summaries[0].modelName).toBe('claude-haiku-4-5')

    // AiRunLog written with usage + cost
    const logs = await testPrisma.aiRunLog.findMany({ where: { agentId: ids.agentId } })
    expect(logs).toHaveLength(1)
    expect(logs[0].status).toBe('success')
    expect(logs[0].promptTokens).toBe(1500)
    expect(logs[0].completionTokens).toBe(80)
    expect(logs[0].totalTokens).toBe(1580)
    expect(Number(logs[0].costUsd)).toBeGreaterThan(0)
  })

  it('records prompt cache tokens when Anthropic returns them', async () => {
    streamMock.mockReturnValue(
      makeFakeStream(['{"summary":"x","tags":[]}'], {
        input_tokens: 200,
        output_tokens: 20,
        cache_creation_input_tokens: 1300,
        cache_read_input_tokens: 1500,
      }),
    )
    const reflectionId = await createReflectionForTeacher()
    const result = await summarizeReflectionAction(reflectionId)
    await consumeStream(result.output)

    const log = await testPrisma.aiRunLog.findFirstOrThrow({
      where: { agentId: ids.agentId },
    })
    expect(log.promptCacheCreationTokens).toBe(1300)
    expect(log.promptCacheReadTokens).toBe(1500)
  })
})

describe('summarizeReflectionAction — permission boundary', () => {
  it('teacher cannot summarize another teacher\'s reflection', async () => {
    const reflectionId = await createReflectionForTeacher()

    // Switch to a different user with same role
    scopeMock.current = {
      ...fakeScope({ ids, role: 'teacher' }),
      user: { id: 'other-user', personId: 'other-person', email: 'other@x' },
    }

    await expect(summarizeReflectionAction(reflectionId)).rejects.toMatchObject({
      code: 'PERMISSION_DENIED',
    })
    expect(streamMock).not.toHaveBeenCalled()
    // No AI run logged (we never called Anthropic)
    expect(await testPrisma.aiRunLog.count()).toBe(0)
  })

  it('rejects non-existent reflection', async () => {
    scopeMock.current = fakeScope({ ids, role: 'teacher' })
    await expect(
      summarizeReflectionAction('00000000-0000-0000-0000-000000000000'),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' })
    expect(streamMock).not.toHaveBeenCalled()
  })
})

describe('summarizeReflectionAction — budget gate', () => {
  it('blocks the call when the agent budget is already spent', async () => {
    // Set tiny budget; pre-fill usage to exceed it
    await testPrisma.agent.update({
      where: { id: ids.agentId },
      data: { monthlyTokenBudget: 1_000 },
    })
    await testPrisma.aiRunLog.create({
      data: {
        agentId: ids.agentId,
        schoolId: ids.schoolId,
        modelProvider: 'anthropic',
        modelName: 'claude-haiku-4-5',
        totalTokens: 1_500, // already over
        status: 'success',
      },
    })

    const reflectionId = await createReflectionForTeacher()

    await expect(summarizeReflectionAction(reflectionId)).rejects.toMatchObject({
      code: 'RATE_LIMITED',
    })
    // Critical: Anthropic NEVER called when over budget — we don't pay for refused work
    expect(streamMock).not.toHaveBeenCalled()
  })

  it('allows when budget is null (unlimited) regardless of usage', async () => {
    await testPrisma.aiRunLog.create({
      data: {
        agentId: ids.agentId,
        schoolId: ids.schoolId,
        modelProvider: 'anthropic',
        modelName: 'claude-haiku-4-5',
        totalTokens: 999_999,
        status: 'success',
      },
    })
    // budget stays NULL
    streamMock.mockReturnValue(makeFakeStream(['{"summary":"ok","tags":[]}']))
    const reflectionId = await createReflectionForTeacher()
    const result = await summarizeReflectionAction(reflectionId)
    await consumeStream(result.output)
    expect(streamMock).toHaveBeenCalledTimes(1)
  })
})

describe('summarizeReflectionAction — error path', () => {
  it('logs failure to ai_run_logs when the Anthropic stream throws', async () => {
    streamMock.mockImplementation(() => {
      throw new Error('Anthropic 500')
    })
    const reflectionId = await createReflectionForTeacher()

    const result = await summarizeReflectionAction(reflectionId)
    // Streamable emits error — readStreamableValue throws when consumed
    await expect(consumeStream(result.output)).rejects.toBeDefined()

    // Reflection NOT advanced
    const r = await testPrisma.teacherDailyReflection.findUniqueOrThrow({
      where: { id: reflectionId },
    })
    expect(r.status).toBe('draft')
    expect(r.aiSummary).toBeNull()

    // But a failure log row exists for cost-accounting / debugging
    const logs = await testPrisma.aiRunLog.findMany({ where: { agentId: ids.agentId } })
    expect(logs).toHaveLength(1)
    expect(logs[0].status).toBe('error')
    expect(logs[0].errorMessage).toContain('Anthropic 500')
  })

  it('tolerates malformed JSON in AI response (uses raw text as summary)', async () => {
    streamMock.mockReturnValue(makeFakeStream(['this is not json at all']))
    const reflectionId = await createReflectionForTeacher()

    const result = await summarizeReflectionAction(reflectionId)
    await consumeStream(result.output)

    const r = await testPrisma.teacherDailyReflection.findUniqueOrThrow({
      where: { id: reflectionId },
    })
    // Parser falls back to raw text; status still advances
    expect(r.status).toBe('ai_summarized')
    expect(r.aiSummary).toContain('this is not json')
    // Empty tags since JSON parse failed
    expect(r.aiTags).toEqual([])
  })
})
