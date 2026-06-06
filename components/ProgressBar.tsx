interface ProgressBarProps {
  completed: number
  total: number
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="w-full h-0.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-accent rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
