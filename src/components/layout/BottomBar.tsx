import { useAppStore, useCurrentEvent } from '../../store/useAppStore'
import { formatMinute } from '../../utils/time'
import { todayIso, isToday } from '../../utils/dateUtils'

export function BottomBar() {
  const setSelectedDate = useAppStore((s) => s.setSelectedDate)
  const setFocusEvent = useAppStore((s) => s.setFocusEvent)
  const categories = useAppStore((s) => s.categories)
  const selectedDate = useAppStore((s) => s.selectedDate)
  const currentEvent = useCurrentEvent()
  const category = categories.find((c) => c.id === currentEvent?.categoryId)
  const showingToday = isToday(selectedDate)

  return (
    <div
      className="shrink-0 flex items-center px-4 py-3 bg-white border-t border-gray-100"
      style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
    >
      <button
        onClick={() => setSelectedDate(todayIso())}
        className={`text-sm font-semibold w-14 text-left transition-colors ${
          showingToday ? 'text-blue-500' : 'text-gray-600'
        }`}
      >
        오늘
      </button>

      <div className="flex-1 flex justify-center">
        {currentEvent && category ? (
          <button
            onClick={() => setFocusEvent(currentEvent.id)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium text-white shadow-md active:scale-95 transition-transform"
            style={{ backgroundColor: category.color, boxShadow: `0 2px 8px ${category.color}50` }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse shrink-0" />
            <span className="truncate max-w-[130px] font-bold">{currentEvent.title}</span>
            <span className="opacity-80 text-[11px] shrink-0">
              {formatMinute(currentEvent.startMinute)}–{formatMinute(currentEvent.endMinute)}
            </span>
          </button>
        ) : (
          <span className="text-[11px] text-gray-300 font-medium">진행 중인 일정 없음</span>
        )}
      </div>

      <div className="w-14 flex justify-end">
        <button className="w-8 h-8 flex items-center justify-center text-gray-400 rounded-full active:bg-gray-100">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
