import { useState, useEffect } from 'react'
import { currentMinuteOfDay } from '../utils/time'

export function useCurrentTime(): number {
  const [minute, setMinute] = useState(currentMinuteOfDay)

  useEffect(() => {
    const tick = () => setMinute(currentMinuteOfDay())
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])

  return minute
}
