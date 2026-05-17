import { GoogleOAuthProvider } from '@react-oauth/google'
import { AppShell } from './components/layout/AppShell'
import { PinGate } from './components/auth/PinGate'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

export default function App() {
  const inner = (
    <PinGate>
      <AppShell />
    </PinGate>
  )

  if (!clientId) return inner

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {inner}
    </GoogleOAuthProvider>
  )
}
