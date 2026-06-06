'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/onboarding')
    }
  }

  return (
    <div className="screen bg-accent px-6 py-10 justify-center">
      <div className="mb-10">
        <p className="text-white/50 text-xs tracking-widest uppercase mb-1">23</p>
        <h1 className="font-serif text-4xl font-bold text-white leading-tight">
          Починаємо.
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="bg-white/15 border border-white/25 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm outline-none focus:border-white/60"
        />
        <input
          type="password"
          placeholder="пароль (мін. 6 символів)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
          className="bg-white/15 border border-white/25 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm outline-none focus:border-white/60"
        />
        {error && <p className="text-white/70 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-white text-accent font-semibold rounded-full py-3 text-sm mt-2 disabled:opacity-50"
        >
          {loading ? 'Реєструємось...' : 'Створити акаунт →'}
        </button>
      </form>

      <p className="text-white/50 text-xs text-center mt-6">
        Вже є акаунт?{' '}
        <Link href="/login" className="text-white underline">Увійти</Link>
      </p>
    </div>
  )
}
