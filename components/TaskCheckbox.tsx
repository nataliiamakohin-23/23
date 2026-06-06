import { Task } from '@/lib/types'

interface TaskCheckboxProps {
  task: Task
  onToggle: (id: string, done: boolean) => void
}

export function TaskCheckbox({ task, onToggle }: TaskCheckboxProps) {
  const done = task.status === 'done'
  const isNice = task.priority === 'nice'

  return (
    <div
      className={`flex items-start gap-4 py-5 border-b border-gray-50 last:border-none cursor-pointer transition-opacity ${isNice && !done ? 'opacity-50' : 'opacity-100'}`}
      onClick={() => onToggle(task.id, !done)}
    >
      {/* Checkbox */}
      <div className={`
        mt-1 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center
        border-2 transition-all duration-200
        ${done ? 'bg-accent border-accent' : 'border-gray-300'}
      `}>
        {done && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
            stroke="white" strokeWidth="2" strokeLinecap="round">
            <polyline points="2,5 4,7.5 8,2.5" />
          </svg>
        )}
      </div>

      {/* Text */}
      <div className="flex-1">
        <p className={`font-serif text-lg font-bold leading-snug ${done ? 'line-through text-gray-300' : 'text-gray-900'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-3 mt-1">
          {task.duration_min && (
            <span className={`text-xs ${done ? 'text-gray-200' : 'text-gray-400'}`}>
              {task.duration_min} хв
            </span>
          )}
          {task.priority === 'must' && !done && (
            <span className="text-xs text-accent font-bold">must</span>
          )}
        </div>
      </div>
    </div>
  )
}
