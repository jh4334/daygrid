import { useEffect, useRef } from 'react'
import { TimeAxis } from './TimeAxis'
import { EventGrid } from './EventGrid'
import { ScrollContainerContext } from './scrollContext'
import { minuteToPixel } from '../../utils/time'
import { useCurrentTime } from '../../hooks/useCurrentTime'

export { ScrollContainerContext }

interface Props {
  date: string
  isToday: boolean
}

export function TimelineView({ date, isToday }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const currentMinute = useCurrentTime()

  useEffect(() => {
    if (!scrollRef.current) return
    const target = isToday
      ? Math.max(0, minuteToPixel(currentMinute) - 200)
      : 0
    scrollRef.current.scrollTop = target
  }, [])

  return (
    <ScrollContainerContext.Provider value={scrollRef}>
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="flex pt-2 pb-16" style={{ minHeight: '100%' }}>
          <TimeAxis />
          <EventGrid date={date} scrollRef={scrollRef} />
        </div>
      </div>
    </ScrollContainerContext.Provider>
  )
}
