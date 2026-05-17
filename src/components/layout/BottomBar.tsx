import { useAppStore, useCurrentEvent } from '../../store/useAppStore'
import { formatMinute } from '../../utils/time'
import { todayIso } from '../../utils/dateUtils'

export function BottomBar() {
  const setSelectedDate = useAppStore((s) => s.setSelectedDate)
  const setFocusEvent = useAppStore((s) => s.setFocusEvent)
  const categories = useAppStore((s) => s.categories)
  const currentEvent = useCurrentEvent()
  const category = categories.find((c) => c.id === currentEvent?.categoryId)

  return (
    <div className="shrink-0 flex items-center px-4 py-3 border-t border-gray-100 bg-white gap-3">
      <button
        onClick={() => setSelectedDate(todayIso())}
        className="text-sm font-medium text-gray-600 w-12"
      >
        오늘
      </button>

      <div className="flex-1 flex justify-center">
        {currentEvent && category ? (
          <button
            onClick={() => setFocusEvent(currentEvent.id)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-white shadow-sm"
            style={{ backgroundColor: category.color }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
            <span className="truncate max-w-[140px]">{currentEvent.title}</span>
            <span className="opacity-70 text-xs">
              {formatMinute(currentEvent.startMinute)}–{formatMinute(currentEvent.endMinute)}
            </span>
          </button>
        ) : (
          <span className="text-xs text-gray-300">진행 중인 일정 없음</span>
        )}
      </div>

      <div className="w-12 flex justify-end">
        <span className="text-lg">📅</span>
      </div>
    </div>
  )
}
