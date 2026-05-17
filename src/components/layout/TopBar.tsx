import { useAppStore } from '../../store/useAppStore'
import { addDays, formatHeaderDate, isToday } from '../../utils/dateUtils'

interface Props {
  onSettingsClick: () => void
}

export function TopBar({ onSettingsClick }: Props) {
  const selectedDate = useAppStore((s) => s.selectedDate)
  const setSelectedDate = useAppStore((s) => s.setSelectedDate)
  const { dateNum, dayLabel } = formatHeaderDate(selectedDate)
  const todayFlag = isToday(selectedDate)

  return (
    <div className="flex items-center px-4 pt-3 pb-2 shrink-0 bg-white border-b border-gray-50">
      <div className="flex-1 flex items-baseline gap-2">
        <span className="text-[28px] font-black tracking-tight text-gray-900 leading-none">
          {dateNum}
        </span>
        <span className="text-sm text-gray-400 font-medium">
          {dayLabel}{todayFlag ? ', Today' : ''}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setSelectedDate(addDays(selectedDate, -1))}
          className="w-8 h-8 flex items-center justify-center text-gray-400 rounded-full active:bg-gray-100 text-lg"
        >
          ‹
        </button>
        <button
          onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          className="w-8 h-8 flex items-center justify-center text-gray-400 rounded-full active:bg-gray-100 text-lg"
        >
          ›
        </button>
        <button
          onClick={onSettingsClick}
          className="w-8 h-8 flex items-center justify-center text-gray-500 rounded-full active:bg-gray-100 ml-0.5"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v3m0 14v3M4.22 4.22l2.12 2.12m11.32 11.32 2.12 2.12M2 12h3m14 0h3M4.22 19.78l2.12-2.12m11.32-11.32 2.12-2.12"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
