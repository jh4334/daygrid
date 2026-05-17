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

  const currentSec = Math.floor(now / 1000)
  const today = new Date()
  const endSec =
    Math.floor(today.setHours(0, 0, 0, 0) / 1000) + event.endMinute * 60
  const remaining = Math.max(0, endSec - currentSec)
  const h = Math.floor(remaining / 3600)
  const m = Math.floor((remaining % 3600) / 60)
  const s = remaining % 60

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: category.color }}
    >
      <button
        onClick={() => setFocusEvent(null)}
        className="absolute top-5 right-5 text-white/70 text-2xl"
      >
        ✕
      </button>

      <p className="text-white/70 text-sm font-medium mb-2">
        {formatMinute(event.startMinute)} – {formatMinute(event.endMinute)}
      </p>
      <h1 className="text-white text-2xl font-bold mb-10">{event.title}</h1>

      <div className="text-white font-bold text-6xl tracking-tight">
        {h > 0 ? `${pad(h)}:` : ''}{pad(m)}:{pad(s)}
      </div>

      <button
        onClick={() => setFocusEvent(null)}
        className="mt-14 w-14 h-14 rounded-full bg-white/20 flex items-center justify-center"
      >
        <span className="text-white text-xl">⏸</span>
      </button>
    </div>
  )
}
