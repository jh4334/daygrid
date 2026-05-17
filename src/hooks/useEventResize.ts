import { useRef, useCallback } from 'react'
import { pixelToMinute, snapMinute, GRID_END_MINUTE } from '../utils/time'
import { useAppStore } from '../store/useAppStore'

export function useEventResize(
  scrollContainerRef: React.RefObject<HTMLDivElement | null>,
  eventId: string,
  startMinute: number
) {
  const updateEvent = useAppStore((s) => s.updateEvent)
  const resizing = useRef(false)

  const clientYToMinute = useCallback((clientY: number) => {
    const el = scrollContainerRef.current
    if (!el) return startMinute
    const rect = el.getBoundingClientRect()
    const scrollTop = el.scrollTop
    const PT = 8
    const offsetY = clientY - rect.top + scrollTop - PT
    return pixelToMinute(offsetY)
  }, [scrollContainerRef, startMinute])

  const onResizePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    resizing.current = true
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onResizePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!resizing.current || e.buttons !== 1) return
    e.stopPropagation()
    const raw = clientYToMinute(e.clientY)
    const snapped = snapMinute(raw, 15)
    const end = Math.min(Math.max(snapped, startMinute + 15), GRID_END_MINUTE)
    updateEvent(eventId, { endMinute: end })
  }, [clientYToMinute, eventId, startMinute, updateEvent])

  const onResizePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation()
    resizing.current = false
  }, [])

  return { onResizePointerDown, onResizePointerMove, onResizePointerUp }
}
