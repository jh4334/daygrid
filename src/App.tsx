import { GoogleOAuthProvider } from '@react-oauth/google'
import { AppShell } from './components/layout/AppShell'
import { PinGate } from './components/auth/PinGate'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

export default function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <PinGate>
        <AppShell />
      </PinGate>
    </GoogleOAuthProvider>
  )
}
