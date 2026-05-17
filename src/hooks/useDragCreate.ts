import { useRef, useState, useCallback } from 'react'
import { pixelToMinute, snapMinute, GRID_START_MINUTE, GRID_END_MINUTE } from '../utils/time'
import { useAppStore } from '../store/useAppStore'
import type { DragState } from '../types'

const DRAG_THRESHOLD = 8
const SNAP: 15 | 30 = 15
const MIN_DURATION = 15
const TAP_MAX_MOVE = 5

export function useDragCreate(scrollContainerRef: React.RefObject<HTMLDivElement | null>) {
  const openCreateModal = useAppStore((s) => s.openCreateModal)
  const [drag, setDrag] = useState<DragState | null>(null)
  const startClientY = useRef(0)
  const startMinuteRef = useRef(0)
  const dragging = useRef(false)
  const downFired = useRef(false)  // guard: only react to ups that had our own down

  const clamp = (m: number) =>
    Math.min(Math.max(m, GRID_START_MINUTE), GRID_END_MINUTE - MIN_DURATION)

  const clientYToMinute = useCallback((clientY: number) => {
    const el = scrollContainerRef.current
    if (!el) return GRID_START_MINUTE
    const rect = el.getBoundingClientRect()
    const scrollTop = el.scrollTop
    const PT = 8 // pt-2 padding in TimelineView
    const offsetY = clientY - rect.top + scrollTop - PT
    return pixelToMinute(offsetY)
  }, [scrollContainerRef])

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const raw = clientYToMinute(e.clientY)
    const snapped = clamp(snapMinute(raw, SNAP))
    startClientY.current = e.clientY
    startMinuteRef.current = snapped
    dragging.current = false
    downFired.current = true
    setDrag(null)
  }, [clientYToMinute])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1 || !downFired.current) return

    if (!dragging.current) {
      if (Math.abs(e.clientY - startClientY.current) < DRAG_THRESHOLD) return
      dragging.current = true
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }

    const raw = clientYToMinute(e.clientY)
    const snapped = clamp(snapMinute(raw, SNAP))
    const start = startMinuteRef.current

    const [s, end] = snapped <= start
      ? [snapped, start + MIN_DURATION]
      : [start, Math.max(snapped, start + MIN_DURATION)]

    setDrag({ active: true, startMinute: s, endMinute: end })
  }, [clientYToMinute])

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!downFired.current) return  // pointerDown came from a child (event block) - ignore

    if (dragging.current && drag) {
      openCreateModal(drag.startMinute, drag.endMinute)
    } else if (Math.abs(e.clientY - startClientY.current) <= TAP_MAX_MOVE) {
      // Tap on empty grid → quick create at that time slot
      const raw = clientYToMinute(e.clientY)
      const start = clamp(snapMinute(raw, SNAP))
      openCreateModal(start, Math.min(start + 60, GRID_END_MINUTE))
    }
    dragging.current = false
    downFired.current = false
    setDrag(null)
  }, [drag, openCreateModal, clientYToMinute])

  const onPointerCancel = useCallback(() => {
    dragging.current = false
    downFired.current = false
    setDrag(null)
  }, [])

  return { drag, onPointerDown, onPointerMove, onPointerUp, onPointerCancel }
}
