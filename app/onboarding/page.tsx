'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const serif = { fontFamily: 'var(--font-playfair), Georgia, serif' }

export default function OnboardingPage() {
  const router = useRouter()
  const [name, setName] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    localStorage.setItem('23_name', name.trim())
    router.push('/capture')
  }

  return (
    <div className="screen bg-white px-8 py-14 justify-between">
      <p style={serif} className="text-[#F04E23] text-sm font-bold">23</p>

      <div className="flex-1 flex flex-col justify-center">
        <h1 style={serif} className="text-5xl font-bold text-gray-900 leading-tight mb-16">
          Як тебе<br />звати?
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-12">
          <input
            type="text"
            placeholder="твоє ім'я"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoFocus
            className="bg-transparent border-b-2 border-gray-900 text-gray-900 text-xl outline-none py-2 placeholder:text-gray-300"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            style={serif}
            className="self-start text-xl font-bold text-gray-900 disabled:opacity-30"
          >
            Поїхали →
          </button>
        </form>
      </div>

      <p className="text-gray-300 text-xs">Планувальник дня на базі AI</p>
    </div>
  )
}
