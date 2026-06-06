interface MicButtonProps {
  isListening: boolean
  isSupported: boolean
  onStart: () => void
  onStop: () => void
}

export function MicButton({ isListening, isSupported, onStart, onStop }: MicButtonProps) {
  if (!isSupported) {
    return (
      <div className="relative flex items-center justify-center" title="Твій браузер не підтримує голосовий ввід. Використай текстове поле.">
        <button
          type="button"
          disabled
          aria-label="Голосовий ввід недоступний у цьому браузері"
          className="w-14 h-14 rounded-full flex items-center justify-center bg-white/40 cursor-not-allowed"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#F04E23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            opacity="0.4">
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 10a7 7 0 0 0 14 0" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="9" y1="22" x2="15" y2="22" />
            <line x1="2" y1="2" x2="22" y2="22" stroke="#F04E23" />
          </svg>
        </button>
        <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs whitespace-nowrap">
          браузер не підтримує
        </p>
      </div>
    )
  }

  return (
    <div className="relative flex items-center justify-center">
      {isListening && (
        <>
          <span className="absolute inline-flex h-14 w-14 rounded-full bg-white/30 animate-pulse_ring" />
          <span className="absolute inline-flex h-14 w-14 rounded-full bg-white/20 animate-pulse_ring [animation-delay:0.4s]" />
        </>
      )}
      <button
        type="button"
        onClick={isListening ? onStop : onStart}
        aria-label={isListening ? 'Зупинити запис' : 'Почати запис голосу'}
        className={`
          relative z-10 w-14 h-14 rounded-full flex items-center justify-center
          transition-colors duration-200
          ${isListening ? 'bg-white shadow-lg' : 'bg-white/90 hover:bg-white'}
        `}
      >
        {isListening ? (
          <span className="w-4 h-4 rounded-sm bg-accent block" />
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#F04E23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 10a7 7 0 0 0 14 0" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="9" y1="22" x2="15" y2="22" />
          </svg>
        )}
      </button>
    </div>
  )
}
