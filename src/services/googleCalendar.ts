import type { CalendarEvent } from '../types'
import { format } from 'date-fns'

interface GoogleEvent {
  id: string
  summary?: string
  start: { dateTime?: string; date?: string }
  end: { dateTime?: string; date?: string }
  colorId?: string
  status?: string
}

function dateTimeToMinute(dt: string): number {
  const d = new Date(dt)
  return d.getHours() * 60 + d.getMinutes()
}

function dateTimeToDate(dt: string): string {
  return format(new Date(dt), 'yyyy-MM-dd')
}

export async function fetchGoogleEvents(
  accessToken: string,
  dateMin: string,
  dateMax: string
): Promise<CalendarEvent[]> {
  const params = new URLSearchParams({
    timeMin: new Date(dateMin).toISOString(),
    timeMax: new Date(dateMax + 'T23:59:59').toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '250',
  })

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )

  if (!res.ok) throw new Error(`Google Calendar API error: ${res.status}`)

  const data = await res.json()
  const items: GoogleEvent[] = data.items ?? []

  return items
    .filter((e) => e.start.dateTime && e.status !== 'cancelled')
    .map((e) => {
      const startMinute = dateTimeToMinute(e.start.dateTime!)
      const endMinute = dateTimeToMinute(e.end.dateTime!)
      return {
        id: `goog-${e.id}`,
        title: e.summary ?? '(제목 없음)',
        categoryId: 'google-import',
        date: dateTimeToDate(e.start.dateTime!),
        startMinute: Math.max(360, startMinute),
        endMinute: Math.min(1440, endMinute || startMinute + 60),
        column: 0,
        columnCount: 1,
        isGoogleEvent: true,
      } satisfies CalendarEvent
    })
    .filter((e) => e.endMinute > e.startMinute)
}

