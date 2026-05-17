import { useState, useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { formatMinute } from '../../utils/time'

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, '0')
}

export function FocusTimer() {
  const focusEventId = useAppStore((s) => s.focusEventId)
  const events = useAppStore((s) => s.events)
  const categories = useAppStore((s) => s.categories)
  const setFocusEvent = useAppStore((s) => s.setFocusEvent)
  const [now, setNow] = useState(Date.now())

  const event = events.find((e) => e.id === focusEventId)
  const category = categories.find((c) => c.id === event?.categoryId)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!event || !category) return null

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const endSec = Math.floor(todayStart.getTime() / 1000) + event.endMinute * 60
  const currentSec = Math.floor(now / 1000)
  const remaining = Math.max(0, endSec - currentSec)
  const elapsed = Math.max(0, event.endMinute * 60 - event.startMinute * 60 - remaining)
  const totalSec = (event.endMinute - event.startMinute) * 60
  const progress = totalSec > 0 ? Math.min(1, elapsed / totalSec) : 0

  const h = Math.floor(remaining / 3600)
  const m = Math.floor((remaining % 3600) / 60)
  const s = remaining % 60

  const circumference = 2 * Math.PI * 54

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: category.color }}
    >
      <button
        onClick={() => setFocusEvent(null)}
        className="absolute top-12 right-5 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white/70 font-bold"
      >
        ✕
      </button>

      <p className="text-white/60 text-sm font-semibold mb-1 tracking-wide uppercase">
        집중 중
      </p>
      <h1 className="text-white text-2xl font-black mb-8 px-8 text-center">{event.title}</h1>

      {/* Circular progress */}
      <div className="relative w-40 h-40 mb-8">
        <svg className="absolute inset-0 -rotate-90" width="160" height="160">
          <circle cx="80" cy="80" r="54" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8"/>
          <circle
            cx="80" cy="80" r="54"
            fill="none"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white font-black text-3xl tracking-tight">
            {h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`}
          </span>
          <span className="text-white/60 text-xs mt-1">남은 시간</span>
        </div>
      </div>

      <p className="text-white/50 text-sm">
        {formatMinute(event.startMinute)} – {formatMinute(event.endMinute)}
      </p>

      <button
        onClick={() => setFocusEvent(null)}
        className="mt-12 w-14 h-14 rounded-full bg-white/20 flex items-center justify-center active:bg-white/30 transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <rect x="6" y="4" width="4" height="16" rx="1"/>
          <rect x="14" y="4" width="4" height="16" rx="1"/>
        </svg>
      </button>
    </div>
  )
}
