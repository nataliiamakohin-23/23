import { Task } from '@/lib/types'

const serif = { fontFamily: 'var(--font-playfair), Georgia, serif' }

interface TaskCheckboxProps {
  task: Task
  onToggle: (id: string, done: boolean) => void
}

export function TaskCheckbox({ task, onToggle }: TaskCheckboxProps) {
  const done = task.status === 'done'
  const dimmed = task.priority === 'nice' && !done

  return (
    <div
      className="flex items-start gap-4 py-5 border-b border-gray-50 last:border-none cursor-pointer"
      style={{ opacity: dimmed ? 0.45 : 1, transition: 'opacity 0.2s' }}
      onClick={() => onToggle(task.id, !done)}
    >
      <div style={{
        marginTop: 4,
        width: 20,
        height: 20,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px solid ${done ? '#F04E23' : '#d1d5db'}`,
        backgroundColor: done ? '#F04E23' : 'transparent',
        transition: 'all 0.2s',
      }}>
        {done && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <polyline points="2,5 4,7.5 8,2.5" />
          </svg>
        )}
      </div>

      <div className="flex-1">
        <p style={serif} className={`text-lg font-bold leading-snug ${done ? 'line-through text-gray-300' : 'text-gray-900'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-3 mt-1">
          {task.duration_min && (
            <span className={`text-xs ${done ? 'text-gray-200' : 'text-gray-400'}`}>
              {task.duration_min} хв
            </span>
          )}
          {task.priority === 'must' && !done && (
            <span style={{ color: '#F04E23' }} className="text-xs font-bold">must</span>
          )}
        </div>
      </div>
    </div>
  )
}
