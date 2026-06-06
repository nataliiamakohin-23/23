'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OnboardingPage() {
  const router = useRouter()
  const [name, setName]       = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.updateUser({
      data: { display_name: name.trim() },
    })
    router.push('/capture')
  }

  return (
    <div className="screen bg-accent px-6 py-10 justify-center">
      <div className="mb-10">
        <p className="text-white/50 text-xs tracking-widest uppercase mb-1">23</p>
        <h1 className="font-serif text-4xl font-bold text-white leading-tight">
          Як тебе<br />звати?
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="ім'я"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          autoFocus
          className="bg-white/15 border border-white/25 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm outline-none focus:border-white/60"
        />
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="bg-white text-accent font-semibold rounded-full py-3 text-sm mt-2 disabled:opacity-50"
        >
          {loading ? 'Зберігаємо...' : 'Поїхали →'}
        </button>
      </form>
    </div>
  )
}
