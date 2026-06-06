'use client'

import { useState, useCallback, useRef } from 'react'

interface UseSpeechRecognitionResult {
  transcript: string
  isListening: boolean
  isSupported: boolean
  start: () => void
  stop: () => void
  reset: () => void
}

export function useSpeechRecognition(
  lang = 'uk-UA'
): UseSpeechRecognitionResult {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  const start = useCallback(() => {
    if (!isSupported) return

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    const recognition = new SpeechRecognitionAPI()
    recognition.lang = lang
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event: any) => {
      let final = ''
      let interim = ''
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          final += result[0].transcript + ' '
        } else {
          interim += result[0].transcript
        }
      }
      setTranscript(final + interim)
    }

    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [isSupported, lang])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  const reset = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
    setTranscript('')
  }, [])

  return { transcript, isListening, isSupported, start, stop, reset }
}
