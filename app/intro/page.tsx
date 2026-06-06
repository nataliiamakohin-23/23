'use client'

import { useRouter } from 'next/navigation'

const serif = { fontFamily: 'var(--font-playfair), Georgia, serif' }

export default function IntroPage() {
  const router = useRouter()

  return (
    <div className="screen px-8 py-14 justify-between" style={{ backgroundColor: '#F04E23' }}>
      <p style={{ ...serif, color: 'white', fontSize: '1.75rem', fontWeight: 700, lineHeight: 1 }}>23</p>

      <div className="flex-1 flex flex-col justify-center gap-8">
        <h1 style={serif} className="text-4xl font-bold text-white leading-tight">
          Привіт!
        </h1>

        <div className="flex flex-col gap-5 text-white/80 text-base leading-relaxed">
          <p>Для твоїх продуктивних днів стане помічним цей додаток.</p>
          <p>Пиши або говори всі думки, що крутяться в голові — AI сам структурує їх у задачі з пріоритетами та часовими оцінками.</p>
          <p>
            Ми назвали додаток <span className="text-white font-bold">23</span>, бо вважаємо це ідеальною кількістю виконаних задач за день.
          </p>
        </div>
      </div>

      <button
        style={serif}
        className="self-start text-2xl font-bold text-white"
        onClick={() => router.push('/onboarding')}
      >
        Почати →
      </button>
    </div>
  )
}
