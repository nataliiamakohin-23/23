export type Priority = 'must' | 'nice'

export type TaskStatus = 'inbox' | 'today' | 'later' | 'done'

export interface Task {
  id: string
  title: string
  priority: Priority
  duration_min: number | null
  deadline: string | null
  status: TaskStatus
  scheduled_date: string | null
  completed_at: string | null
  created_at: string
}

export interface ParsedTask {
  title: string
  priority: Priority
  duration_min: number
  deadline: string | null
}
