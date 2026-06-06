'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MicButton } from '@/components/MicButton'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { addTasks } from '@/lib/storage'
import { ParsedTask } from '@/lib/types'

export default function CapturePage() {
  const router = useRouter()
  const [text, setText]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [name, setName]       = useState('')

  const { transcript, isListening, isSupported, start, stop, reset } =
    useSpeechRecognition('uk-UA')

  useEffect(() => {
    const n = localStorage.getItem('23_name')
    if (!n) { router.replace('/onboarding'); return }
    setName(n)
  }, [router])

  useEffect(() => {
    if (transcript) setText(transcript)
  }, [transcript])

  function handleToggleMic() {
    if (isListening) {
      stop()
    } else {
      reset()
      setText('')
      start()
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)
    setError(null)

    const res = await fetch('/api/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error === 'no_tasks_found'
        ? 'Не знайшов задач. Спробуй ще раз.'
        : 'Щось пішло не так. Спробуй ще раз.')
      setLoading(false)
      return
    }

    const data = await res.json()
    addTasks(data.tasks as ParsedTask[])
    router.push('/inbox')
  }

  return (
    <div className="screen bg-accent px-6 py-12">
      {/* Header */}
      <div className="mb-6">
        <p className="text-white/50 text-xs tracking-widest uppercase mb-2">
          {name ? `привіт, ${name}` : '23'}
        </p>
        <h1 className="font-serif text-4xl font-bold text-white leading-tight">
          Що зараз<br />крутиться<br />в голові?
        </h1>
      </div>

      <p className="text-white/60 text-sm mb-8">
        Говори або пиши все підряд.<br />AI розбере сам.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
        {/* Mic button — centered */}
        <div className="flex justify-center mb-2">
          <MicButton
            isListening={isListening}
            isSupported={isSupported}
            onStart={handleToggleMic}
            onStop={handleToggleMic}
          />
        </div>

        {isListening && (
          <p className="text-white/60 text-xs text-center -mt-3 animate-pulse">
            Слухаю…
          </p>
        )}

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="або просто введи текст…"
          rows={7}
          className="
            bg-white/12 border border-white/20 rounded-2xl
            px-4 py-3 text-white placeholder-white/35 text-sm
            outline-none focus:border-white/50 resize-none
          "
        />

        {error && <p className="text-white/70 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="bg-white text-accent font-semibold rounded-full py-3.5 text-sm disabled:opacity-40 mt-auto"
        >
          {loading ? 'Розбираємо...' : 'Розібрати →'}
        </button>
      </form>

      <p
        className="text-white/40 text-xs text-center mt-5 cursor-pointer"
        onClick={() => router.push('/today')}
      >
        до сьогоднішніх задач
      </p>
    </div>
  )
}
