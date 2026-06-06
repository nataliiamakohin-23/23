interface MicButtonProps {
  isListening: boolean
  isSupported: boolean
  onStart: () => void
  onStop: () => void
}

export function MicButton({ isListening, isSupported, onStart, onStop }: MicButtonProps) {
  if (!isSupported) {
    return (
      <div className="relative flex flex-col items-center gap-2">
        <button
          type="button"
          disabled
          style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'not-allowed' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F04E23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 10a7 7 0 0 0 14 0" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="9" y1="22" x2="15" y2="22" />
            <line x1="2" y1="2" x2="22" y2="22" />
          </svg>
        </button>
        <p className="text-gray-300 text-xs">браузер не підтримує</p>
      </div>
    )
  }

  return (
    <div className="relative flex items-center justify-center">
      {isListening && (
        <>
          <span style={{
            position: 'absolute', width: 56, height: 56, borderRadius: '50%',
            backgroundColor: '#F04E23', opacity: 0.15,
            animation: 'pulse_ring 1.2s ease-out infinite',
          }} />
          <span style={{
            position: 'absolute', width: 56, height: 56, borderRadius: '50%',
            backgroundColor: '#F04E23', opacity: 0.1,
            animation: 'pulse_ring 1.2s ease-out 0.4s infinite',
          }} />
        </>
      )}
      <button
        type="button"
        onClick={isListening ? onStop : onStart}
        aria-label={isListening ? 'Зупинити запис' : 'Почати запис голосу'}
        style={{
          position: 'relative', zIndex: 10,
          width: 56, height: 56, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: isListening ? '#F04E23' : '#fff0ee',
          border: `2px solid #F04E23`,
          transition: 'all 0.2s',
        }}
      >
        {isListening ? (
          <span style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: 'white', display: 'block' }} />
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F04E23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
