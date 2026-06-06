'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ProgressBar } from '@/components/ProgressBar'
import { TaskCheckbox } from '@/components/TaskCheckbox'
import { Task } from '@/lib/types'

const TODAY = new Date().toISOString().split('T')[0]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('uk-UA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export default function TodayPage() {
  const router = useRouter()
  const [tasks, setTasks]     = useState<Task[]>([])
  const [name, setName]       = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    Promise.all([
      supabase.auth.getUser(),
      supabase
        .from('tasks')
        .select('*')
        .eq('status', 'today')
        .eq('scheduled_date', TODAY)
        .order('priority', { ascending: true })
        .order('created_at', { ascending: true }),
      supabase
        .from('tasks')
        .select('*')
        .eq('status', 'done')
        .eq('scheduled_date', TODAY),
    ]).then(([{ data: { user } }, { data: todayTasks }, { data: doneTasks }]) => {
      const n = user?.user_metadata?.display_name
      if (n) setName(n)

      const allToday = [
        ...((todayTasks as Task[]) ?? []),
        ...((doneTasks as Task[]) ?? []),
      ]
      allToday.sort((a, b) => {
        if (a.status === 'done' && b.status !== 'done') return 1
        if (b.status === 'done' && a.status !== 'done') return -1
        if (a.priority === 'must' && b.priority !== 'must') return -1
        if (b.priority === 'must' && a.priority !== 'must') return 1
        return 0
      })
      setTasks(allToday)
      setLoading(false)
    })
  }, [])

  async function handleToggle(id: string, markDone: boolean) {
    const supabase = createClient()
    const update = markDone
      ? { status: 'done' as const, completed_at: new Date().toISOString() }
      : { status: 'today' as const, completed_at: null }

    await supabase.from('tasks').update(update).eq('id', id)

    setTasks(prev => prev.map(t =>
      t.id === id
        ? { ...t, status: update.status, completed_at: update.completed_at ?? null }
        : t
    ))
  }

  const completed = tasks.filter(t => t.status === 'done').length
  const total = tasks.length

  return (
    <div className="screen bg-white px-5 py-10">
      <div className="mb-6">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
          {formatDate(TODAY)}
        </p>
        <h1 className="font-serif text-3xl font-bold text-gray-900 leading-tight">
          {name ? `Твій день,\n${name}.` : 'Твій день.'}
        </h1>
      </div>

      <ProgressBar completed={completed} total={total} />
      <p className="text-xs text-gray-400 mt-1 mb-6">
        {completed} з {total} виконано
      </p>

      {loading ? (
        <p className="text-gray-400 text-sm">Завантажуємо…</p>
      ) : tasks.length === 0 ? (
        <div className="text-center mt-16">
          <p className="text-gray-400 text-sm mb-4">Список порожній. Що в голові?</p>
          <button
            onClick={() => router.push('/capture')}
            className="bg-accent text-white text-sm font-semibold px-6 py-3 rounded-full"
          >
            Brain dump →
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            {tasks.map(task => (
              <TaskCheckbox key={task.id} task={task} onToggle={handleToggle} />
            ))}
          </div>

          <button
            onClick={() => router.push('/capture')}
            className="w-full border border-dashed border-gray-200 rounded-2xl py-3 text-gray-400 text-sm text-center"
          >
            + додати задачу
          </button>
        </>
      )}
    </div>
  )
}
