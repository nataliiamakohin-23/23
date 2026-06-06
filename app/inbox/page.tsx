'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getTasks, updateTask, deleteTask } from '@/lib/storage'
import { TaskCard } from '@/components/TaskCard'
import { Task } from '@/lib/types'

const TODAY = new Date().toISOString().split('T')[0]
const serif = { fontFamily: 'var(--font-playfair), Georgia, serif' }

export default function InboxPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const all = getTasks().filter(t => t.status === 'inbox')
    setTasks([...all.filter(t => t.priority === 'must'), ...all.filter(t => t.priority === 'nice')])
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
      <div className="flex items-start justify-between mb-10">
        <div>
          <p style={{ ...serif, color: '#F04E23', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem' }}>23</p>
          <h1 style={serif} className="text-4xl font-bold text-gray-900 leading-tight">
            {tasks.length === 0
              ? 'Усе розібрано.'
              : <>AI знайшов<br />{tasks.length} задач{tasks.length === 1 ? 'у' : 'и'}.</>}
          </h1>
        </div>
        <span style={{ backgroundColor: '#F04E2320', color: '#F04E23', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px' }}>
          AI ✦
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-gray-300 text-sm mb-12">Inbox порожній.</p>
          <button style={serif} className="self-start text-xl font-bold text-gray-900" onClick={() => router.push('/today')}>
            До сьогодні →
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} onToday={handleToday} onLater={handleLater} onDelete={handleDelete} />
            ))}
          </div>
          <button style={{ ...serif, color: '#F04E23' }} className="mt-10 text-xl font-bold" onClick={() => router.push('/today')}>
            До сьогодні →
          </button>
        </>
      )}
    </div>
  )
}
