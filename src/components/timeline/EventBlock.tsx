import { memo } from 'react'
import { minuteToPixel, formatMinute } from '../../utils/time'
import type { CalendarEvent, Category } from '../../types'

interface Props {
  event: CalendarEvent
  category: Category
  onClick: () => void
}

export const EventBlock = memo(function EventBlock({ event, category, onClick }: Props) {
  const top = minuteToPixel(event.startMinute)
  const height = minuteToPixel(event.endMinute) - minuteToPixel(event.startMinute)
  const left = `${(event.column / event.columnCount) * 100}%`
  const width = `calc(${(1 / event.columnCount) * 100}% - 2px)`

  const showTime = height >= 32
  const showTitle = height >= 18

  return (
    <div
      className="absolute rounded cursor-pointer overflow-hidden select-none active:brightness-90"
      style={{
        top,
        height: Math.max(height, 18),
        left,
        width,
        backgroundColor: category.color,
        color: category.textColor,
        border: event.isGoogleEvent ? `2px dashed ${category.textColor}33` : 'none',
      }}
      onClick={onClick}
    >
      {showTitle && (
        <div className="px-1.5 pt-0.5 leading-tight">
          <p className="text-xs font-semibold truncate">{event.title}</p>
          {showTime && (
            <p className="text-[10px] opacity-80 truncate">
              {formatMinute(event.startMinute)}–{formatMinute(event.endMinute)}
            </p>
          )}
        </div>
      )}
    </div>
  )
})
