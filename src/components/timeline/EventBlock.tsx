import { memo, useContext } from 'react'
import { minuteToPixel, formatMinute } from '../../utils/time'
import { useEventResize } from '../../hooks/useEventResize'
import type { CalendarEvent, Category } from '../../types'
import { ScrollContainerContext } from './TimelineView'

interface Props {
  event: CalendarEvent
  category: Category
  onClick: () => void
}

export const EventBlock = memo(function EventBlock({ event, category, onClick }: Props) {
  const scrollRef = useContext(ScrollContainerContext)
  const { onResizePointerDown, onResizePointerMove, onResizePointerUp } = useEventResize(
    scrollRef, event.id, event.startMinute
  )

  const top = minuteToPixel(event.startMinute)
  const height = Math.max(minuteToPixel(event.endMinute) - top, 20)
  const left = `${(event.column / event.columnCount) * 100}%`
  const width = `calc(${(1 / event.columnCount) * 100}% - 3px)`
  const duration = event.endMinute - event.startMinute

  const showTime = height >= 38
  const showTitle = height >= 20

  return (
    <div
      className="absolute rounded-xl cursor-pointer select-none group"
      style={{
        top,
        height,
        left,
        width,
        backgroundColor: category.color,
        color: category.textColor,
        boxShadow: event.isGoogleEvent
          ? `inset 0 0 0 2px ${category.textColor}40`
          : `0 1px 4px ${category.color}55`,
      }}
      onPointerDown={(e) => e.stopPropagation()} // prevent grid drag-create from activating
      onClick={onClick}
    >
      {showTitle && (
        <div className="px-2 pt-1.5 leading-tight overflow-hidden h-full">
          <p
            className="text-[12px] font-bold leading-tight"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: showTime ? 1 : 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {event.title}
          </p>
          {showTime && (
            <p className="text-[10px] mt-0.5" style={{ opacity: 0.75 }}>
              {formatMinute(event.startMinute)}–{formatMinute(event.endMinute)}
              {duration >= 30 && (
                <span className="ml-1">
                  ({duration >= 60
                    ? `${Math.floor(duration / 60)}h${duration % 60 ? ` ${duration % 60}m` : ''}`
                    : `${duration}m`})
                </span>
              )}
            </p>
          )}
          {event.isGoogleEvent && (
            <span className="absolute top-1 right-1.5 text-[9px] opacity-50">G</span>
          )}
        </div>
      )}

      {/* Resize handle – shown on hover */}
      {!event.isGoogleEvent && height > 32 && (
        <div
          className="absolute bottom-0 left-0 right-0 h-4 flex items-center justify-center cursor-ns-resize opacity-0 group-hover:opacity-100 transition-opacity"
          onPointerDown={onResizePointerDown}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-8 h-[3px] rounded-full bg-current opacity-30" />
        </div>
      )}
    </div>
  )
})
