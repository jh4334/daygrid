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
    <div className="flex items-center px-4 py-3 shrink-0">
      <button
        onClick={() => setSelectedDate(addDays(selectedDate, -1))}
        className="w-8 h-8 flex items-center justify-center text-gray-400 text-lg"
      >
        ‹
      </button>

      <div className="flex-1 flex items-baseline gap-2 justify-center">
        <span className="text-2xl font-black tracking-tight">{dateNum}</span>
        <span className="text-sm text-gray-400 font-medium">
          {dayLabel}
          {todayFlag && ', Today'}
        </span>
      </div>

      <button
        onClick={() => setSelectedDate(addDays(selectedDate, 1))}
        className="w-8 h-8 flex items-center justify-center text-gray-400 text-lg"
      >
        ›
      </button>

      <button
        onClick={onSettingsClick}
        className="w-8 h-8 flex items-center justify-center text-gray-400 ml-1 text-lg"
      >
        ···
      </button>
    </div>
  )
}
