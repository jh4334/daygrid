import { create } from 'zustand'

const AUTH_KEY = 'daygrid-auth'
const EXPIRY_DAYS = 30

interface AuthEntry {
  token: string
  expiry: number
}

function loadAuth(): AuthEntry | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const entry = JSON.parse(raw) as AuthEntry
    if (Date.now() > entry.expiry) {
      localStorage.removeItem(AUTH_KEY)
      return null
    }
    return entry
  } catch {
    return null
  }
}

function saveAuth(token: string) {
  const entry: AuthEntry = {
    token,
    expiry: Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(entry))
}

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// PIN hash embedded at build time. Empty = no auth required (dev mode).
const EXPECTED_HASH = import.meta.env.VITE_PIN_HASH as string | undefined

interface AuthState {
  authenticated: boolean
  error: string | null
  loading: boolean
  unlock: (pin: string) => Promise<void>
  lock: () => void
}

export const useAuthStore = create<AuthState>((set) => {
  const noAuth = !EXPECTED_HASH
  const stored = loadAuth()
  const initialAuth = noAuth || !!stored

  return {
    authenticated: initialAuth,
    error: null,
    loading: false,

    unlock: async (pin: string) => {
      set({ loading: true, error: null })
      const hash = await sha256(pin)
      if (hash === EXPECTED_HASH) {
        saveAuth(hash)
        set({ authenticated: true, loading: false, error: null })
      } else {
        set({ loading: false, error: 'PIN이 올바르지 않습니다' })
      }
    },

    lock: () => {
      localStorage.removeItem(AUTH_KEY)
      set({ authenticated: false, error: null })
    },
  }
})
