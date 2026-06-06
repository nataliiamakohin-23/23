'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/today')
      router.refresh()
    }
  }

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
    })
  }

  return (
    <div className="screen bg-accent px-6 py-10 justify-center">
      <div className="mb-10">
        <p className="text-white/50 text-xs tracking-widest uppercase mb-1">23</p>
        <h1 className="font-serif text-4xl font-bold text-white leading-tight">
          З поверненням.
        </h1>
      </div>

      <form onSubmit={handleEmail} className="flex flex-col gap-4">
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
          placeholder="пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="bg-white/15 border border-white/25 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm outline-none focus:border-white/60"
        />
        {error && <p className="text-white/70 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-white text-accent font-semibold rounded-full py-3 text-sm mt-2 disabled:opacity-50"
        >
          {loading ? 'Входимо...' : 'Увійти →'}
        </button>
      </form>

      <button
        onClick={handleGoogle}
        className="mt-3 border border-white/30 text-white rounded-full py-3 text-sm w-full"
      >
        Увійти через Google
      </button>

      <p className="text-white/50 text-xs text-center mt-6">
        Немає акаунту?{' '}
        <Link href="/signup" className="text-white underline">Зареєструватись</Link>
      </p>
    </div>
  )
}
