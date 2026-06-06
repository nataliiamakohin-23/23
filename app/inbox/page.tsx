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
    setTasks(getTasks().filter(t => t.status === 'inbox'))
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

  const mustTasks = tasks.filter(t => t.priority === 'must')
  const niceTasks = tasks.filter(t => t.priority === 'nice')

  return (
    <div className="screen bg-white px-5 py-10">
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 leading-tight">
            AI розібрав<br />
            {`${tasks.length} задач${tasks.length === 1 ? 'у' : 'и'}`}
          </h1>
        </div>
        <span className="bg-accent text-white text-xs font-semibold px-2.5 py-1 rounded-full mt-1">
          AI ✦
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center mt-16">
          <p className="text-gray-400 text-sm mb-4">Inbox порожній 🎉</p>
          <button
            onClick={() => router.push('/today')}
            className="bg-accent text-white text-sm font-semibold px-6 py-3 rounded-full"
          >
            До сьогодні →
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {mustTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToday={handleToday}
                onLater={handleLater}
                onDelete={handleDelete}
              />
            ))}
            {niceTasks.map(task => (
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
            className="mt-6 text-accent text-sm font-semibold text-center w-full"
          >
            Перейти до сьогодні →
          </button>
        </>
      )}
    </div>
  )
}
