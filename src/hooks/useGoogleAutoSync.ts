import { useEffect, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import { fetchGoogleEvents } from '../services/googleCalendar'
import { addDays } from '../utils/dateUtils'

const SYNC_INTERVAL_MS = 10 * 60 * 1000 // 10분마다 자동 재동기화

export function useGoogleAutoSync() {
  const token = useAppStore((s) => s.googleAccessToken)
  const selectedDate = useAppStore((s) => s.selectedDate)
  const syncing = useRef(false)
  const lastSyncedDate = useRef<string | null>(null)
  const lastSyncTime = useRef(0)

  const runSync = async (accessToken: string, centerDate: string) => {
    if (syncing.current) return
    syncing.current = true
    try {
      const { importGoogleEvents, setLastSyncedAt } = useAppStore.getState()
      const events = await fetchGoogleEvents(
        accessToken,
        addDays(centerDate, -7),
        addDays(centerDate, 7)
      )
      importGoogleEvents(events)
      setLastSyncedAt(new Date().toLocaleTimeString('ko-KR'))
      lastSyncedDate.current = centerDate
      lastSyncTime.current = Date.now()
    } catch (e) {
      const msg = e instanceof Error ? e.message : ''
      if (msg.includes('401')) {
        useAppStore.getState().setGoogleAccessToken(null)
      }
    } finally {
      syncing.current = false
    }
  }

  // 토큰 생기거나 날짜 바뀔 때 자동 동기화
  useEffect(() => {
    if (!token) return
    const stale = Date.now() - lastSyncTime.current > SYNC_INTERVAL_MS
    if (lastSyncedDate.current === selectedDate && !stale) return
    runSync(token, selectedDate)
  }, [token, selectedDate])

  // 10분 주기 자동 재동기화
  useEffect(() => {
    if (!token) return
    const id = setInterval(() => {
      const { selectedDate: date } = useAppStore.getState()
      runSync(token, date)
    }, SYNC_INTERVAL_MS)
    return () => clearInterval(id)
  }, [token])
}
