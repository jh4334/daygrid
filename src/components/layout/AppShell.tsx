import { useState, useRef, useCallback } from 'react'
import { TopBar } from './TopBar'
import { BottomBar } from './BottomBar'
import { TimelineView } from '../timeline/TimelineView'
import { EventModal } from '../modals/EventModal'
import { SettingsPanel } from '../settings/SettingsPanel'
import { FocusTimer } from '../focus/FocusTimer'
import { useAppStore } from '../../store/useAppStore'
import { addDays, isToday } from '../../utils/dateUtils'

export function AppShell() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const selectedDate = useAppStore((s) => s.selectedDate)
  const setSelectedDate = useAppStore((s) => s.setSelectedDate)
  const view = useAppStore((s) => s.view)

  // 좌우 스와이프로 날짜 이동
  const swipeStart = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    swipeStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!swipeStart.current) return
    const dx = e.changedTouches[0].clientX - swipeStart.current.x
    const dy = Math.abs(e.changedTouches[0].clientY - swipeStart.current.y)
    if (Math.abs(dx) > 60 && Math.abs(dx) > dy * 1.5) {
      setSelectedDate(addDays(selectedDate, dx < 0 ? 1 : -1))
    }
    swipeStart.current = null
  }, [selectedDate, setSelectedDate])

  return (
    <div
      className="flex flex-col h-dvh max-w-lg mx-auto bg-white relative overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <TopBar onSettingsClick={() => setSettingsOpen(true)} />
      <TimelineView date={selectedDate} key={selectedDate} isToday={isToday(selectedDate)} />
      <BottomBar />
      <EventModal />
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      {view === 'focus' && <FocusTimer />}
    </div>
  )
}
