import { useState } from 'react'
import { TopBar } from './TopBar'
import { BottomBar } from './BottomBar'
import { TimelineView } from '../timeline/TimelineView'
import { EventModal } from '../modals/EventModal'
import { SettingsPanel } from '../settings/SettingsPanel'
import { FocusTimer } from '../focus/FocusTimer'
import { useAppStore } from '../../store/useAppStore'

export function AppShell() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const selectedDate = useAppStore((s) => s.selectedDate)
  const view = useAppStore((s) => s.view)

  return (
    <div className="flex flex-col h-dvh max-w-lg mx-auto bg-white relative overflow-hidden">
      <TopBar onSettingsClick={() => setSettingsOpen(true)} />
      <TimelineView date={selectedDate} key={selectedDate} />
      <BottomBar />
      <EventModal />
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      {view === 'focus' && <FocusTimer />}
    </div>
  )
}
