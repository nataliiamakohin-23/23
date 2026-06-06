import Anthropic from '@anthropic-ai/sdk'
import { ParsedTask } from './types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are a task parser for a productivity app called 23.

The user has done a brain dump. Extract every distinct task from it.

For each task return:
- title: short action-oriented title in the same language as the input (Ukrainian or English)
- priority: "must" (urgent/important/deadline-driven) or "nice" (would be good but not critical)
- duration_min: estimated minutes to complete as an integer (minimum 5)
- deadline: ISO date string (YYYY-MM-DD) only if a specific date was mentioned, otherwise null

Return ONLY a valid JSON array. No markdown, no explanation, no code blocks. Just the array.`

export async function parseDump(rawText: string): Promise<ParsedTask[]> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: rawText,
      },
    ],
    system: SYSTEM_PROMPT,
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  const parsed: ParsedTask[] = JSON.parse(content.text)

  if (!Array.isArray(parsed)) {
    throw new Error('Claude did not return an array')
  }

  return parsed.map(task => ({
    title: String(task.title),
    priority: task.priority === 'must' ? 'must' : 'nice',
    duration_min: Math.max(5, Number(task.duration_min) || 15),
    deadline: task.deadline ?? null,
  }))
}
