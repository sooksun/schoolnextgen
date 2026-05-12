'use server'

import 'server-only'
import { revalidatePath } from 'next/cache'
import { createStreamableValue } from '@ai-sdk/rsc'
import { prisma } from '@/lib/db'
import { requireScope } from '@/server/tenant/scope'
import { can } from '@/lib/scope/can'
import { ActionError, requirePermission } from '@/lib/result'
import { captureActionError } from '@/lib/observability'
import { anthropic, type AnthropicUsage } from '@/server/ai/anthropic'
import { logAiRun } from '@/server/ai/run'
import { assertWithinAiBudget } from '@/server/ai/budget'
import { CLASSROOM_PERSONA_LOWER_PRIMARY } from '@/server/ai/prompts/classroom-lower-primary'
import {
  SUMMARIZE_INSTRUCTION,
  buildReflectionUserMessage,
  parseSummaryResponse,
} from '@/server/ai/prompts/summarize-reflection'

/**
 * Stream an AI-generated summary for a reflection.
 *
 * Returns `{ output }` where `output` is a streamable value. Client side:
 *
 *   const { output } = await summarizeReflectionAction(id)
 *   for await (const partial of readStreamableValue(output)) {
 *     setText(partial ?? '')
 *   }
 *
 * On completion:
 *   - Saves ReflectionAiSummary row
 *   - Updates TeacherDailyReflection.aiSummary, aiTags, status='ai_summarized'
 *   - Writes AiRunLog with tokens + cost
 *   - revalidatePath for the reflection detail and timeline pages
 */
export async function summarizeReflectionAction(reflectionId: string) {
  const scope = await requireScope()

  const reflection = await prisma.teacherDailyReflection.findFirst({
    where: { id: reflectionId, schoolId: scope.schoolId, deletedAt: null },
  })
  if (!reflection) throw new ActionError('NOT_FOUND', 'ไม่พบบันทึก')
  requirePermission(can.summarizeReflection(scope, reflection), 'ไม่สามารถสรุปบันทึกนี้')

  // Look up the classroom assistant agent for this teacher's level (if known)
  // Fallback to any classroom_assistant for the school.
  const classroom = reflection.classroomId
    ? await prisma.classroom.findUnique({ where: { id: reflection.classroomId } })
    : null

  let agent = await prisma.agent.findFirst({
    where: {
      schoolId: scope.schoolId,
      agentType: 'classroom_assistant',
      status: 'active',
      ...(classroom?.level ? { gradeLevel: classroom.level } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })
  if (!agent) {
    agent = await prisma.agent.findFirst({
      where: { schoolId: scope.schoolId, agentType: 'classroom_assistant', status: 'active' },
      orderBy: { createdAt: 'desc' },
    })
  }
  if (!agent) throw new ActionError('NOT_FOUND', 'ไม่พบ Agent ผู้ช่วยครูประจำชั้น')

  // Budget gate — runs BEFORE any Anthropic call so we don't bill for tokens
  // we'd refuse to use anyway. Throws ActionError('RATE_LIMITED', ...) if over.
  await assertWithinAiBudget(agent.id)

  const stream = createStreamableValue<string>('')

  // Detach: stream runs in background after we return the streamable
  void (async () => {
    const t0 = Date.now()
    try {
      const personaText = agent.systemPrompt || CLASSROOM_PERSONA_LOWER_PRIMARY
      const userMessage = buildReflectionUserMessage(reflection)

      // Anthropic SDK 0.95: messages.stream returns an iterable AsyncIterable
      // and exposes finalMessage() after iteration completes.
      const response = anthropic.messages.stream({
        model: agent.modelName,
        max_tokens: agent.maxTokens ?? 1024,
        temperature: Number(agent.temperature),
        system: [
          { type: 'text', text: personaText, cache_control: { type: 'ephemeral' } },
          { type: 'text', text: SUMMARIZE_INSTRUCTION, cache_control: { type: 'ephemeral' } },
        ],
        messages: [{ role: 'user', content: userMessage }],
      })

      let full = ''
      for await (const event of response) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          full += event.delta.text
          stream.update(full)
        }
      }

      const final = await response.finalMessage()
      const usage = (final.usage ?? {
        input_tokens: 0,
        output_tokens: 0,
      }) as AnthropicUsage

      const parsed = parseSummaryResponse(full)

      await prisma.$transaction(async (tx) => {
        await tx.reflectionAiSummary.create({
          data: {
            reflectionId,
            agentId: agent!.id,
            summaryText: parsed.summary || full,
            tags: parsed.tags as never,
            modelName: agent!.modelName,
          },
        })
        await tx.teacherDailyReflection.update({
          where: { id: reflectionId },
          data: {
            aiSummary: parsed.summary || full,
            aiTags: parsed.tags as never,
            status: 'ai_summarized',
          },
        })
        await logAiRun(tx, {
          agentId: agent!.id,
          schoolId: scope.schoolId,
          modelProvider: 'anthropic',
          modelName: agent!.modelName,
          usage,
          latencyMs: Date.now() - t0,
          status: 'success',
        })
      })

      // Emit final parsed summary as last value (in case JSON tail was streamed
      // but client wants the clean summary)
      stream.update(parsed.summary || full)
      stream.done()
      revalidatePath(`/teacher/reflections/${reflectionId}`)
      revalidatePath('/teacher/reflections')
    } catch (e) {
      captureActionError('summarizeReflectionAction', e, { reflectionId, agentId: agent.id })
      await logAiRun(prisma, {
        agentId: agent!.id,
        schoolId: scope.schoolId,
        modelProvider: 'anthropic',
        modelName: agent!.modelName,
        usage: null,
        latencyMs: Date.now() - t0,
        status: 'error',
        errorMessage: e instanceof Error ? e.message : String(e),
      }).catch(() => {})
      stream.error(e instanceof Error ? e.message : 'AI error')
    }
  })()

  return { output: stream.value }
}
