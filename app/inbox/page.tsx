'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getTasks, updateTask, deleteTask } from '@/lib/storage'
import { TaskCard } from '@/components/TaskCard'
import { Task } from '@/lib/types'

const TODAY = new Date().toISOString().split('T')[0]

export default function InboxPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const all = getTasks().filter(t => t.status === 'inbox')
    const must = all.filter(t => t.priority === 'must')
    const nice = all.filter(t => t.priority === 'nice')
    setTasks([...must, ...nice])
  }, [])

  function handleToday(id: string) {
    updateTask(id, { status: 'today', scheduled_date: TODAY })
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  function handleLater(id: string) {
    updateTask(id, { status: 'later' })
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  function handleDelete(id: string) {
    deleteTask(id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="screen bg-white px-8 py-14">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="font-serif text-accent text-sm font-bold mb-3">23</p>
          <h1 className="font-serif text-4xl font-bold text-gray-900 leading-tight">
            {tasks.length === 0
              ? 'Усе\nрозібрано.'
              : `AI знайшов\n${tasks.length} задач${tasks.length === 1 ? 'у' : 'и'}.`}
          </h1>
        </div>
        <span className="text-accent text-xs font-bold mt-1 bg-accent/10 px-2 py-1 rounded-full">
          AI ✦
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-gray-300 text-sm mb-12">Inbox порожній.</p>
          <button
            onClick={() => router.push('/today')}
            className="self-start font-serif text-xl font-bold text-gray-900"
          >
            До сьогодні →
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToday={handleToday}
                onLater={handleLater}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <button
            onClick={() => router.push('/today')}
            className="mt-10 font-serif text-xl font-bold text-accent"
          >
            До сьогодні →
          </button>
        </>
      )}
    </div>
  )
}
