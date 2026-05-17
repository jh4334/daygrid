import { useRef, useState, useCallback } from 'react'
import { pixelToMinute, snapMinute, GRID_START_MINUTE, GRID_END_MINUTE } from '../utils/time'
import { useAppStore } from '../store/useAppStore'
import type { DragState } from '../types'

const DRAG_THRESHOLD = 5
const SNAP: 15 | 30 = 15
const MIN_DURATION = 15

export function useDragCreate(gridRef: React.RefObject<HTMLDivElement | null>) {
  const openCreateModal = useAppStore((s) => s.openCreateModal)
  const [drag, setDrag] = useState<DragState | null>(null)
  const startPixel = useRef(0)
  const startMinuteRef = useRef(0)
  const dragging = useRef(false)

  const clamp = (m: number) =>
    Math.min(Math.max(m, GRID_START_MINUTE), GRID_END_MINUTE - MIN_DURATION)

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const rect = gridRef.current?.getBoundingClientRect()
    if (!rect) return
    const offsetY = e.clientY - rect.top + (gridRef.current?.scrollTop ?? 0)
    const raw = pixelToMinute(offsetY)
    const snapped = clamp(snapMinute(raw, SNAP))
    startPixel.current = e.clientY
    startMinuteRef.current = snapped
    dragging.current = false
    setDrag(null)
  }, [gridRef])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return
    const rect = gridRef.current?.getBoundingClientRect()
    if (!rect) return

    if (!dragging.current) {
      if (Math.abs(e.clientY - startPixel.current) < DRAG_THRESHOLD) return
      dragging.current = true
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }

    const scrollTop = gridRef.current?.parentElement?.scrollTop ?? 0
    const offsetY = e.clientY - rect.top + scrollTop
    const raw = pixelToMinute(offsetY)
    const snapped = clamp(snapMinute(raw, SNAP))

    const start = startMinuteRef.current
    const [s, end] = snapped <= start
      ? [snapped, start + MIN_DURATION]
      : [start, Math.max(snapped, start + MIN_DURATION)]

    setDrag({ active: true, startMinute: s, endMinute: end })
  }, [gridRef])

  const onPointerUp = useCallback((_e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging.current && drag) {
      openCreateModal(drag.startMinute, drag.endMinute)
    }
    dragging.current = false
    setDrag(null)
  }, [drag, openCreateModal])

  const onPointerCancel = useCallback(() => {
    dragging.current = false
    setDrag(null)
  }, [])

  return { drag, onPointerDown, onPointerMove, onPointerUp, onPointerCancel }
}
