import { AppShell } from './components/layout/AppShell'
import { PinGate } from './components/auth/PinGate'

export default function App() {
  return (
    <PinGate>
      <AppShell />
    </PinGate>
  )
}
