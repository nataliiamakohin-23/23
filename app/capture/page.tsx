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
    if (isListening) { stop() }
    else { reset(); setText(''); start() }
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
        : 'Щось пішло не так.')
      setLoading(false)
      return
    }

    const data = await res.json()
    addTasks(data.tasks as ParsedTask[])
    router.push('/inbox')
  }

  return (
    <div className="screen bg-accent px-8 py-14 justify-between">
      {/* Logo */}
      <div className="flex items-center justify-between">
        <p className="font-serif text-white text-sm font-bold">23</p>
        <span
          className="text-white/50 text-xs cursor-pointer"
          onClick={() => router.push('/today')}
        >
          сьогодні →
        </span>
      </div>

      {/* Headline */}
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="font-serif text-5xl font-bold text-white leading-tight mb-4">
          {name ? `${name},\nщо в голові?` : 'Що зараз\nкрутиться\nв голові?'}
        </h1>
        <p className="text-white/50 text-sm mt-2">
          Говори або пиши — AI розбере сам.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Mic */}
        <div className="flex justify-center">
          <MicButton
            isListening={isListening}
            isSupported={isSupported}
            onStart={handleToggleMic}
            onStop={handleToggleMic}
          />
        </div>

        {isListening && (
          <p className="text-white/60 text-xs text-center -mt-4 animate-pulse">
            Слухаю…
          </p>
        )}

        {/* Underline textarea */}
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="або введи текст тут…"
          rows={4}
          className="bg-transparent border-b-2 border-white/40 text-white placeholder-white/30 text-base outline-none resize-none focus:border-white/80 transition-colors py-2"
        />

        {error && <p className="text-white/60 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="self-start font-serif text-2xl font-bold text-white disabled:opacity-30"
        >
          {loading ? 'Розбираємо…' : 'Розібрати →'}
        </button>
      </form>
    </div>
  )
}
