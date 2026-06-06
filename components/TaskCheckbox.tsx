import { Task } from '@/lib/types'

interface TaskCheckboxProps {
  task: Task
  onToggle: (id: string, done: boolean) => void
}

export function TaskCheckbox({ task, onToggle }: TaskCheckboxProps) {
  const done = task.status === 'done'
  const dimmed = task.priority === 'nice' && !done

  return (
    <div
      className={`flex items-start gap-3 py-3.5 border-b border-gray-50 last:border-none cursor-pointer transition-opacity ${dimmed ? 'opacity-50' : 'opacity-100'}`}
      onClick={() => onToggle(task.id, !done)}
    >
      <div
        className={`
          mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center
          border-2 transition-colors duration-200
          ${done ? 'bg-accent border-accent' : 'border-gray-300'}
        `}
      >
        {done && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
            stroke="white" strokeWidth="1.5" strokeLinecap="round">
            <polyline points="2,5 4,7.5 8,2.5" />
          </svg>
        )}
      </div>

      <div className="flex-1">
        <p className={`text-sm font-medium leading-snug ${done ? 'line-through text-gray-300' : 'text-gray-900'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {task.duration_min && (
            <p className={`text-xs ${done ? 'text-gray-200' : 'text-gray-400'}`}>
              {task.duration_min} хв
            </p>
          )}
          {task.priority === 'must' && !done && (
            <span className="text-xs text-accent font-semibold">must</span>
          )}
        </div>
      </div>
    </div>
  )
}
