import { useCurrentTime } from '../../hooks/useCurrentTime'
import { minuteToPixel, formatMinute, GRID_START_MINUTE, GRID_END_MINUTE } from '../../utils/time'

export function CurrentTimeIndicator() {
  const minute = useCurrentTime()
  if (minute < GRID_START_MINUTE || minute > GRID_END_MINUTE) return null
  const top = minuteToPixel(minute)

  return (
    <div className="absolute left-0 right-0 pointer-events-none z-20" style={{ top }}>
      <div className="flex items-center">
        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full -translate-y-1/2 shrink-0">
          {formatMinute(minute)}
        </span>
        <div className="flex-1 h-px bg-red-500" />
      </div>
    </div>
  )
}
