import { minuteToPixel, formatMinute } from '../../utils/time'
import type { DragState } from '../../types'

interface Props {
  drag: DragState
  color: string
}

export function GhostBlock({ drag, color }: Props) {
  const top = minuteToPixel(drag.startMinute)
  const height = Math.max(minuteToPixel(drag.endMinute) - top, 18)

  return (
    <div
      className="absolute left-0 right-1 rounded-lg pointer-events-none z-10 flex items-start"
      style={{ top, height, backgroundColor: color, opacity: 0.6 }}
    >
      <span className="text-white text-[11px] font-semibold px-2 pt-1">
        {formatMinute(drag.startMinute)} – {formatMinute(drag.endMinute)}
      </span>
    </div>
  )
}
