'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getTasks, updateTask } from '@/lib/storage'
import { ProgressBar } from '@/components/ProgressBar'
import { TaskCheckbox } from '@/components/TaskCheckbox'
import { Task } from '@/lib/types'

const TODAY = new Date().toISOString().split('T')[0]
const serif = { fontFamily: 'var(--font-playfair), Georgia, serif' }
const logo = { ...serif, color: '#F04E23', fontSize: '1.75rem', fontWeight: 700, lineHeight: 1 }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function TodayPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [name, setName]   = useState('')

  useEffect(() => {
    setName(localStorage.getItem('23_name') || '')
    const all = getTasks().filter(
      t => t.scheduled_date === TODAY && (t.status === 'today' || t.status === 'done')
    )
    all.sort((a, b) => {
      if (a.status === 'done' && b.status !== 'done') return 1
      if (b.status === 'done' && a.status !== 'done') return -1
      if (a.priority === 'must' && b.priority !== 'must') return -1
      if (b.priority === 'must' && a.priority !== 'must') return 1
      return 0
    })
    setTasks(all)
  }, [])

  function handleToggle(id: string, markDone: boolean) {
    const updates = markDone
      ? { status: 'done' as const, completed_at: new Date().toISOString() }
      : { status: 'today' as const, completed_at: null }
    updateTask(id, updates)
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  const completed = tasks.filter(t => t.status === 'done').length
  const total = tasks.length

  return (
    <div className="screen bg-white px-8 py-14">
      <div className="flex items-center justify-between mb-10">
        <p style={logo}>23</p>
        <button className="text-gray-300 text-xs" onClick={() => router.push('/capture')}>
          + новий dump
        </button>
      </div>

      <div className="mb-8">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">
          {formatDate(TODAY)}
        </p>
        <h1 style={serif} className="text-4xl font-bold text-gray-900 leading-tight">
          {name ? `Твій день,\n${name}.` : 'Твій день.'}
        </h1>
      </div>

      {total > 0 && (
        <div className="mb-8">
          <ProgressBar completed={completed} total={total} />
          <p className="text-xs text-gray-300 mt-2">{completed} з {total} виконано</p>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-gray-300 text-sm mb-12">Список порожній.</p>
          <button style={serif} className="self-start text-xl font-bold text-gray-900" onClick={() => router.push('/capture')}>
            Brain dump →
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1">
            {tasks.map(task => (
              <TaskCheckbox key={task.id} task={task} onToggle={handleToggle} />
            ))}
          </div>
          <button className="mt-10 text-gray-300 text-sm border-b border-gray-200 pb-0.5" onClick={() => router.push('/capture')}>
            + додати задачу
          </button>
        </>
      )}
    </div>
  )
}
