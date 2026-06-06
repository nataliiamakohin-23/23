import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseDump } from '@/lib/claude'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const rawText: string = body.text?.trim()

  if (!rawText || rawText.length < 3) {
    return NextResponse.json({ error: 'text_too_short' }, { status: 400 })
  }

  const { data: dump, error: dumpError } = await supabase
    .from('dumps')
    .insert({ user_id: user.id, raw_text: rawText })
    .select('id')
    .single()

  if (dumpError) {
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
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

  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .insert(
      parsedTasks.map(t => ({
        user_id: user.id,
        title: t.title,
        priority: t.priority,
        duration_min: t.duration_min,
        deadline: t.deadline,
        status: 'inbox',
        raw_dump_id: dump.id,
      }))
    )
    .select()

  if (tasksError) {
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }

  return NextResponse.json({ tasks })
}
