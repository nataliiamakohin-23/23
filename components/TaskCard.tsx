import { Task } from '@/lib/types'

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
        <h2 className="font-serif text-xl font-bold text-gray-900 leading-snug flex-1">
          {task.title}
        </h2>
        <span
          className={`
            text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 mt-1
            ${task.priority === 'must'
              ? 'bg-accent text-white'
              : 'bg-gray-100 text-gray-400'}
          `}
        >
          {task.priority}
        </span>
      </div>

      <div className="flex gap-5 text-xs text-gray-400 mb-5">
        {task.duration_min && <span>{task.duration_min} хв</span>}
        {task.deadline && (
          <span>
            до {new Date(task.deadline).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })}
          </span>
        )}
      </div>

      <div className="flex gap-6 text-sm font-semibold">
        <button
          onClick={() => onToday(task.id)}
          className="text-accent"
        >
          + на сьогодні
        </button>
        <button
          onClick={() => onLater(task.id)}
          className="text-gray-400"
        >
          пізніше
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-gray-300"
        >
          видалити
        </button>
      </div>
    </div>
  )
}
