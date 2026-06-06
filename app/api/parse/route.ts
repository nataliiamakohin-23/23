import { NextRequest, NextResponse } from 'next/server'
import { parseDump } from '@/lib/claude'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const rawText: string = body.text?.trim()

  if (!rawText || rawText.length < 3) {
    return NextResponse.json({ error: 'text_too_short' }, { status: 400 })
  }

  let parsedTasks
  try {
    parsedTasks = await parseDump(rawText)
  } catch {
    return NextResponse.json({ error: 'parse_failed' }, { status: 422 })
  }

  if (parsedTasks.length === 0) {
    return NextResponse.json({ error: 'no_tasks_found' }, { status: 422 })
  }

  return NextResponse.json({ tasks: parsedTasks })
}
