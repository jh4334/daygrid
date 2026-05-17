import { useEffect, useRef } from 'react'
import { TimeAxis } from './TimeAxis'
import { EventGrid } from './EventGrid'
import { minuteToPixel } from '../../utils/time'
import { useCurrentTime } from '../../hooks/useCurrentTime'

interface Props {
  date: string
}

export function TimelineView({ date }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const currentMinute = useCurrentTime()

  useEffect(() => {
    if (!scrollRef.current) return
    const target = Math.max(0, minuteToPixel(currentMinute) - 150)
    scrollRef.current.scrollTop = target
  }, []) // only on mount

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden">
      <div className="flex pt-2 pb-10" style={{ minHeight: '100%' }}>
        <TimeAxis />
        <EventGrid date={date} />
      </div>
    </div>
  )
}
