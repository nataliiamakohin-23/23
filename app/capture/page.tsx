'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MicButton } from '@/components/MicButton'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { addTasks } from '@/lib/storage'
import { ParsedTask } from '@/lib/types'

const serif = { fontFamily: 'var(--font-playfair), Georgia, serif' }

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
    if (isListening) { stop() } else { reset(); setText(''); start() }
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
      setError(data.error === 'no_tasks_found' ? 'Не знайшов задач. Спробуй ще раз.' : 'Щось пішло не так.')
      setLoading(false)
      return
    }

    const data = await res.json()
    addTasks(data.tasks as ParsedTask[])
    router.push('/inbox')
  }

  return (
    <div className="screen bg-white px-8 py-14 justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p style={{ ...serif, color: '#F04E23', fontSize: '1.75rem', fontWeight: 700, lineHeight: 1 }}>23</p>
        <button
          style={serif}
          className="text-gray-900 text-sm font-semibold"
          onClick={() => router.push('/today')}
        >
          Перейти до плану дня →
        </button>
      </div>

      {/* Headline */}
      <div className="flex-1 flex flex-col justify-center py-8">
        <h1 style={serif} className="text-5xl font-bold text-gray-900 leading-tight mb-4">
          {name ? `${name},` : 'Що зараз'}<br />
          {name ? 'що в голові?' : 'крутиться'}{!name && <><br />в голові?</>}
        </h1>
        <p style={serif} className="text-gray-400 text-base mt-3">
          Говори або пиши — AI розбере сам.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex justify-center">
          <MicButton isListening={isListening} isSupported={isSupported} onStart={handleToggleMic} onStop={handleToggleMic} />
        </div>

        {isListening && (
          <p style={serif} className="text-gray-400 text-xs text-center -mt-4 animate-pulse">Слухаю…</p>
        )}

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="або введи текст тут…"
          rows={4}
          style={serif}
          className="bg-transparent border-b-2 border-gray-900 text-gray-900 text-base outline-none resize-none py-2 placeholder:text-gray-300"
        />

        {error && <p style={serif} className="text-red-400 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={loading || !text.trim()}
          style={{ ...serif, color: loading || !text.trim() ? '#d1d5db' : '#111827' }}
          className="self-start text-2xl font-bold"
        >
          {loading ? 'Розбираємо…' : 'Додати →'}
        </button>
      </form>
    </div>
  )
}
