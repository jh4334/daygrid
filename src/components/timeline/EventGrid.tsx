import { useRef, useMemo } from 'react'
import { GRID_HEIGHT, PIXELS_PER_HOUR, GRID_START_MINUTE, GRID_END_MINUTE } from '../../utils/time'
import { useAppStore, useEventsForDate } from '../../store/useAppStore'
import { useDragCreate } from '../../hooks/useDragCreate'
import { EventBlock } from './EventBlock'
import { GhostBlock } from './GhostBlock'
import { CurrentTimeIndicator } from './CurrentTimeIndicator'

const hourLines = Array.from(
  { length: (GRID_END_MINUTE - GRID_START_MINUTE) / 60 },
  (_, i) => i
)

interface Props {
  date: string
}

export function EventGrid({ date }: Props) {
  const gridRef = useRef<HTMLDivElement>(null)
  const events = useEventsForDate(date)
  const categories = useAppStore((s) => s.categories)
  const openEditModal = useAppStore((s) => s.openEditModal)
  const { drag, onPointerDown, onPointerMove, onPointerUp, onPointerCancel } = useDragCreate(gridRef)

  const lastCategoryId = useAppStore((s) => {
    const evs = [...s.events].sort((a, b) => b.startMinute - a.startMinute)
    return evs[0]?.categoryId ?? s.categories[4]?.id ?? 'productive'
  })

  const ghostColor = useMemo(() => {
    return categories.find((c) => c.id === lastCategoryId)?.color ?? '#3B82F6'
  }, [categories, lastCategoryId])

  return (
    <div
      ref={gridRef}
      className="relative flex-1 touch-none"
      style={{ height: GRID_HEIGHT }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      {/* Hour grid lines */}
      {hourLines.map((i) => (
        <div
          key={i}
          className="absolute left-0 right-0 border-t border-gray-100"
          style={{ top: i * PIXELS_PER_HOUR }}
        />
      ))}
      {/* Half-hour lines */}
      {hourLines.map((i) => (
        <div
          key={`half-${i}`}
          className="absolute left-0 right-0 border-t border-gray-50"
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
      <CurrentTimeIndicator />
    </div>
  )
}
