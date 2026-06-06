import { Task } from '@/lib/types'

interface TaskCardProps {
  task: Task
  onToday: (id: string) => void
  onLater: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onToday, onLater, onDelete }: TaskCardProps) {
  return (
    <div className="border border-gray-100 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-sm font-medium text-gray-900 leading-snug flex-1">
          {task.title}
        </p>
        <span
          className={`
            text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5
            ${task.priority === 'must'
              ? 'bg-accent text-white'
              : 'bg-gray-100 text-gray-500'}
          `}
        >
          {task.priority}
        </span>
      </div>

      <div className="flex gap-4 text-xs text-gray-400 mb-3">
        {task.duration_min && <span>{task.duration_min} хв</span>}
        {task.deadline && (
          <span>{new Date(task.deadline).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })}</span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onToday(task.id)}
          className="bg-accent text-white text-xs font-semibold px-3 py-1.5 rounded-full"
        >
          + на сьогодні
        </button>
        <button
          onClick={() => onLater(task.id)}
          className="border border-gray-200 text-gray-500 text-xs px-3 py-1.5 rounded-full"
        >
          пізніше
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="border border-gray-200 text-gray-500 text-xs px-3 py-1.5 rounded-full"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
