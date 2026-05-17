import { useGoogleLogin, googleLogout } from '@react-oauth/google'
import { useAppStore } from '../../store/useAppStore'
import { fetchGoogleEvents } from '../../services/googleCalendar'
import { addDays, todayIso } from '../../utils/dateUtils'
import { useState } from 'react'

export function GoogleCalendarSection() {
  const token = useAppStore((s) => s.googleAccessToken)
  const lastSyncedAt = useAppStore((s) => s.lastSyncedAt)
  const setGoogleAccessToken = useAppStore((s) => s.setGoogleAccessToken)
  const setLastSyncedAt = useAppStore((s) => s.setLastSyncedAt)
  const importGoogleEvents = useAppStore((s) => s.importGoogleEvents)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    onSuccess: async (res) => {
      setGoogleAccessToken(res.access_token)
      setError(null)
      await sync(res.access_token)
    },
    onError: () => setError('구글 로그인에 실패했습니다.'),
  })

  const sync = async (accessToken = token) => {
    if (!accessToken) return
    setSyncing(true)
    setError(null)
    try {
      const today = todayIso()
      const dateMin = addDays(today, -7)
      const dateMax = addDays(today, 7)
      const events = await fetchGoogleEvents(accessToken, dateMin, dateMax)
      importGoogleEvents(events)
      setLastSyncedAt(new Date().toLocaleTimeString('ko-KR'))
    } catch (e) {
      const msg = e instanceof Error ? e.message : '동기화 실패'
      if (msg.includes('401')) {
        setGoogleAccessToken(null)
        setError('토큰이 만료되었습니다. 다시 연결해주세요.')
      } else {
        setError(msg)
      }
    } finally {
      setSyncing(false)
    }
  }

  const disconnect = () => {
    googleLogout()
    setGoogleAccessToken(null)
    setLastSyncedAt(null)
  }

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  if (!clientId) {
    return (
      <div className="py-2">
        <p className="text-xs text-gray-400">
          구글 캘린더 연동을 위해 <code>.env.local</code>에 <br />
          <code>VITE_GOOGLE_CLIENT_ID=</code>를 설정하세요.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {!token ? (
        <button
          onClick={() => login()}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 active:bg-gray-50"
        >
          <GoogleIcon />
          Google 계정으로 연결
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-gray-500">연결됨</span>
            {lastSyncedAt && (
              <span className="text-xs text-gray-400 ml-auto">마지막 동기화 {lastSyncedAt}</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => sync()}
              disabled={syncing}
              className="flex-1 py-2 rounded-xl text-sm font-medium text-blue-600 bg-blue-50 active:bg-blue-100 disabled:opacity-50"
            >
              {syncing ? '동기화 중...' : '동기화'}
            </button>
            <button
              onClick={disconnect}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 active:bg-gray-200"
            >
              연결 해제
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
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
