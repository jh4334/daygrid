import { GRID_START_MINUTE, GRID_END_MINUTE, PIXELS_PER_HOUR, formatHourLabel } from '../../utils/time'

const hours = Array.from(
  { length: (GRID_END_MINUTE - GRID_START_MINUTE) / 60 },
  (_, i) => GRID_START_MINUTE / 60 + i
)

export function TimeAxis() {
  return (
    <div className="relative w-14 shrink-0 select-none">
      {hours.map((h) => {
        const label = formatHourLabel(h)
        const [num, period] = label.includes(' ') ? label.split(' ') : [label, '']
        return (
          <div
            key={h}
            className="absolute right-2 flex flex-col items-end leading-none"
            style={{ top: (h - GRID_START_MINUTE / 60) * PIXELS_PER_HOUR - 7 }}
          >
            <span className="text-[11px] font-semibold text-gray-400">{num}</span>
            {period && <span className="text-[9px] text-gray-300 mt-px">{period}</span>}
          </div>
        )
      })}
    </div>
  )
}
