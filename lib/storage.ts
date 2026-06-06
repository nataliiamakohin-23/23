import { Task, ParsedTask } from './types'

const TASKS_KEY = '23_tasks'

export function getTasks(): Task[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

export function addTasks(parsed: ParsedTask[]): Task[] {
  const existing = getTasks()
  const newTasks: Task[] = parsed.map(t => ({
    id: crypto.randomUUID(),
    title: t.title,
    priority: t.priority,
    duration_min: t.duration_min,
    deadline: t.deadline,
    status: 'inbox',
    scheduled_date: null,
    completed_at: null,
    created_at: new Date().toISOString(),
  }))
  const all = [...existing, ...newTasks]
  saveTasks(all)
  return all
}

export function updateTask(id: string, updates: Partial<Task>): void {
  const tasks = getTasks().map(t => t.id === id ? { ...t, ...updates } : t)
  saveTasks(tasks)
}

export function deleteTask(id: string): void {
  saveTasks(getTasks().filter(t => t.id !== id))
}
