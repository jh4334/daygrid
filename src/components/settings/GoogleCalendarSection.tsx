import { useState } from 'react'
import { useGoogleLogin, googleLogout } from '@react-oauth/google'
import { useAppStore } from '../../store/useAppStore'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

// Outer shell: only renders the connected component when clientId exists.
// useGoogleLogin() must be inside GoogleOAuthProvider — splitting avoids
// calling the hook when no provider is in the tree.
export function GoogleCalendarSection() {
  if (!clientId) {
    return (
      <p className="text-xs text-gray-400 leading-relaxed">
        Google Calendar 연동을 위해<br />
        <code className="bg-gray-100 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code>를 설정하세요.
      </p>
    )
  }
  return <GoogleCalendarConnected />
}

function GoogleCalendarConnected() {
  const token = useAppStore((s) => s.googleAccessToken)
  const lastSyncedAt = useAppStore((s) => s.lastSyncedAt)
  const setGoogleAccessToken = useAppStore((s) => s.setGoogleAccessToken)
  const setLastSyncedAt = useAppStore((s) => s.setLastSyncedAt)
  const clearGoogleEvents = useAppStore((s) => s.clearGoogleEvents)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    onSuccess: (res) => {
      setError(null)
      setLoading(false)
      setGoogleAccessToken(res.access_token)
    },
    onError: () => {
      setLoading(false)
      setError('구글 로그인에 실패했습니다.')
    },
  })

  const disconnect = () => {
    googleLogout()
    setGoogleAccessToken(null)
    setLastSyncedAt(null)
    const { events } = useAppStore.getState()
    const googleDates = [...new Set(events.filter((e) => e.isGoogleEvent).map((e) => e.date))]
    googleDates.forEach(clearGoogleEvents)
  }

  if (!token) {
    return (
      <div className="space-y-2">
        <button
          onClick={() => { setLoading(true); login() }}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 active:bg-gray-50 disabled:opacity-60 transition-colors"
        >
          <GoogleIcon />
          {loading ? '연결 중...' : 'Google 계정으로 연결'}
        </button>
        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 py-2 px-3 bg-green-50 rounded-xl">
        <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-green-700">Google Calendar 연결됨</p>
          {lastSyncedAt && (
            <p className="text-[10px] text-green-600/70 mt-0.5">마지막 동기화 {lastSyncedAt}</p>
          )}
        </div>
        <GoogleIcon />
      </div>
      <button
        onClick={disconnect}
        className="w-full py-2 rounded-xl text-xs font-semibold text-gray-400 active:bg-gray-50 transition-colors"
      >
        연결 해제
      </button>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.3 6.5 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19.1 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.3 6.5 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.2 0-9.7-3.3-11.3-8H6.3C9.7 35.7 16.3 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6.2 5.2C41.6 35.9 44 30.4 44 24c0-1.3-.1-2.6-.4-3.9z"/>
    </svg>
  )
}
