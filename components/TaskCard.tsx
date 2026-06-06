import { Task } from '@/lib/types'

const serif = { fontFamily: 'var(--font-playfair), Georgia, serif' }

interface TaskCardProps {
  task: Task
  onToday: (id: string) => void
  onLater: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onToday, onLater, onDelete }: TaskCardProps) {
  return (
    <div className="py-6 border-b border-gray-100 last:border-none">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h2 style={serif} className="text-xl font-bold text-gray-900 leading-snug flex-1">
          {task.title}
        </h2>
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: '999px',
          flexShrink: 0,
          marginTop: 4,
          backgroundColor: task.priority === 'must' ? '#F04E23' : '#f3f4f6',
          color: task.priority === 'must' ? 'white' : '#9ca3af',
        }}>
          {task.priority}
        </span>
      </div>

      <div className="flex gap-5 text-xs text-gray-400 mb-5">
        {task.duration_min && <span>{task.duration_min} хв</span>}
        {task.deadline && (
          <span>до {new Date(task.deadline).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })}</span>
        )}
      </div>

      <div className="flex gap-6 text-sm font-semibold">
        <button style={{ color: '#F04E23' }} onClick={() => onToday(task.id)}>
          + на сьогодні
        </button>
        <button className="text-gray-400" onClick={() => onLater(task.id)}>
          пізніше
        </button>
        <button className="text-gray-300" onClick={() => onDelete(task.id)}>
          видалити
        </button>
      </div>
    </div>
  )
}
