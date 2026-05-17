import { useMemo } from 'react'
import { GRID_HEIGHT, PIXELS_PER_HOUR, GRID_START_MINUTE, GRID_END_MINUTE, currentMinuteOfDay } from '../../utils/time'
import { useAppStore, useEventsForDate } from '../../store/useAppStore'
import { useDragCreate } from '../../hooks/useDragCreate'
import { EventBlock } from './EventBlock'
import { GhostBlock } from './GhostBlock'
import { CurrentTimeIndicator } from './CurrentTimeIndicator'
import { isToday } from '../../utils/dateUtils'

const hourLines = Array.from(
  { length: (GRID_END_MINUTE - GRID_START_MINUTE) / 60 },
  (_, i) => i
)

interface Props {
  date: string
  scrollRef: React.RefObject<HTMLDivElement | null>
}

export function EventGrid({ date, scrollRef }: Props) {
  const events = useEventsForDate(date)
  const categories = useAppStore((s) => s.categories)
  const openEditModal = useAppStore((s) => s.openEditModal)
  const { drag, onPointerDown, onPointerMove, onPointerUp, onPointerCancel } = useDragCreate(scrollRef)

  const lastCategoryId = useAppStore((s) => {
    const today = date
    const dateEvs = [...s.events]
      .filter((e) => e.date === today)
      .sort((a, b) => b.startMinute - a.startMinute)
    return dateEvs[0]?.categoryId ?? s.categories[4]?.id ?? 'productive'
  })

  const ghostColor = useMemo(() => {
    return categories.find((c) => c.id === lastCategoryId)?.color ?? '#3B82F6'
  }, [categories, lastCategoryId])

  const todayFlag = isToday(date)
  const pastMinute = todayFlag ? currentMinuteOfDay() : (date < new Date().toISOString().slice(0, 10) ? GRID_END_MINUTE : GRID_START_MINUTE)
  const pastHeight = Math.min(Math.max(0, pastMinute - GRID_START_MINUTE), GRID_END_MINUTE - GRID_START_MINUTE) * (PIXELS_PER_HOUR / 60)

  return (
    <div
      className="relative flex-1 touch-none"
      style={{ height: GRID_HEIGHT }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      {/* Past time tint */}
      {pastHeight > 0 && (
        <div
          className="absolute left-0 right-0 top-0 pointer-events-none"
          style={{ height: pastHeight, background: 'rgba(0,0,0,0.022)' }}
        />
      )}

      {/* Hour lines */}
      {hourLines.map((i) => (
        <div
          key={i}
          className="absolute left-0 right-0 border-t border-gray-100"
          style={{ top: i * PIXELS_PER_HOUR }}
        />
      ))}

      {/* Half-hour dashed lines */}
      {hourLines.map((i) => (
        <div
          key={`h-${i}`}
          className="absolute left-4 right-0 border-t border-dashed border-gray-100"
          style={{ top: i * PIXELS_PER_HOUR + PIXELS_PER_HOUR / 2 }}
        />
      ))}

      {events.map((event) => {
        const category = categories.find((c) => c.id === event.categoryId)
        if (!category) return null
        return (
          <EventBlock
            key={event.id}
            event={event}
            category={category}
            onClick={() => openEditModal(event.id)}
          />
        )
      })}

      {drag?.active && <GhostBlock drag={drag} color={ghostColor} />}
      {todayFlag && <CurrentTimeIndicator />}
    </div>
  )
}
