import { useRef, useState, useEffect } from 'react'
import { useAuthStore } from '../../store/useAuthStore'

const PIN_LENGTH = 6

export function PinGate({ children }: { children: React.ReactNode }) {
  const { authenticated, error, loading, unlock } = useAuthStore()

  if (authenticated) return <>{children}</>
  return <PinScreen error={error} loading={loading} onSubmit={unlock} />
}

function PinScreen({
  error,
  loading,
  onSubmit,
}: {
  error: string | null
  loading: boolean
  onSubmit: (pin: string) => void
}) {
  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(''))
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const pinValue = digits.join('')

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (error) {
      setShake(true)
      setDigits(Array(PIN_LENGTH).fill(''))
      const t = setTimeout(() => setShake(false), 500)
      return () => clearTimeout(t)
    }
  }, [error])

  const handleInput = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, PIN_LENGTH)
    const next = clean.split('').concat(Array(PIN_LENGTH).fill('')).slice(0, PIN_LENGTH)
    setDigits(next)
    if (clean.length === PIN_LENGTH) {
      onSubmit(clean)
    }
  }

  const handleDotClick = () => inputRef.current?.focus()

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white select-none">
      {/* Hidden real input (mobile keyboard trigger) */}
      <input
        ref={inputRef}
        value={pinValue}
        onChange={(e) => handleInput(e.target.value)}
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={PIN_LENGTH}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
        autoComplete="off"
      />

      <div className="flex flex-col items-center gap-8 px-8 w-full max-w-sm">
        {/* Logo / Title */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-200">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="3"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">DayGrid</h1>
          <p className="text-sm text-gray-400 font-medium">PIN을 입력하세요</p>
        </div>

        {/* PIN dots */}
        <div
          className={`flex gap-4 transition-transform ${shake ? 'animate-shake' : ''}`}
          onClick={handleDotClick}
        >
          {digits.map((d, i) => (
            <div
              key={i}
              className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all ${
                d
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : digits.slice(0, i).every(Boolean) && !digits[i]
                  ? 'border-blue-300 bg-white scale-105'
                  : 'border-gray-200 bg-gray-50 text-transparent'
              }`}
            >
              {d ? '•' : ''}
            </div>
          ))}
        </div>

        {/* Error */}
        <div className={`h-5 transition-opacity ${error ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-sm text-red-500 font-medium text-center">{error ?? ' '}</p>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}

        {/* Number pad (for desktop) */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((key, i) => {
            if (key === null) return <div key={i} />
            const isBack = key === 'del'
            return (
              <button
                key={i}
                className={`h-14 rounded-2xl text-xl font-bold transition-all active:scale-95 ${
                  isBack
                    ? 'text-gray-400 bg-gray-100 active:bg-gray-200'
                    : 'text-gray-800 bg-gray-50 active:bg-gray-100 border border-gray-100'
                }`}
                onClick={() => {
                  if (isBack) {
                    const filled = digits.filter(Boolean).length
                    if (filled === 0) return
                    const next = [...digits]
                    next[filled - 1] = ''
                    setDigits(next)
                  } else {
                    const filled = digits.filter(Boolean).length
                    if (filled >= PIN_LENGTH) return
                    const next = [...digits]
                    next[filled] = String(key)
                    setDigits(next)
                    if (filled + 1 === PIN_LENGTH) {
                      onSubmit(next.join(''))
                    }
                  }
                }}
              >
                {isBack ? (
                  <span className="flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
                      <line x1="18" y1="9" x2="12" y2="15"/>
                      <line x1="12" y1="9" x2="18" y2="15"/>
                    </svg>
                  </span>
                ) : key}
              </button>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.45s ease-in-out; }
      `}</style>
    </div>
  )
}
