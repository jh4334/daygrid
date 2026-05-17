import { minuteToPixel, formatMinute } from '../../utils/time'
import type { DragState } from '../../types'

interface Props {
  drag: DragState
  color: string
}

export function GhostBlock({ drag, color }: Props) {
  const top = minuteToPixel(drag.startMinute)
  const height = minuteToPixel(drag.endMinute) - minuteToPixel(drag.startMinute)

  return (
    <div
      className="absolute left-0 right-1 rounded pointer-events-none z-10"
      style={{ top, height, backgroundColor: color, opacity: 0.5 }}
    >
      <span className="text-white text-xs font-medium px-1.5 py-0.5 block truncate">
        {formatMinute(drag.startMinute)} – {formatMinute(drag.endMinute)}
      </span>
    </div>
  )
}

