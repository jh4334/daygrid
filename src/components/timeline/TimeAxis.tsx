import { GRID_START_MINUTE, GRID_END_MINUTE, PIXELS_PER_HOUR } from '../../utils/time'

const hours = Array.from(
  { length: (GRID_END_MINUTE - GRID_START_MINUTE) / 60 },
  (_, i) => GRID_START_MINUTE / 60 + i
)

export function TimeAxis() {
  return (
    <div className="relative w-12 shrink-0 select-none">
      {hours.map((h) => (
        <div
          key={h}
          className="absolute right-2 text-xs text-gray-400 leading-none"
          style={{ top: (h - GRID_START_MINUTE / 60) * PIXELS_PER_HOUR - 6 }}
        >
          {h < 10 ? `${h}` : h}
        </div>
      ))}
    </div>
  )
}
