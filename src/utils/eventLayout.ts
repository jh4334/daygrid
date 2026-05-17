import type { CalendarEvent } from '../types'

export function assignColumns(events: CalendarEvent[]): CalendarEvent[] {
  const sorted = [...events].sort((a, b) => a.startMinute - b.startMinute)
  const columns: number[] = []

  for (const event of sorted) {
    let placed = false
    for (let col = 0; col < columns.length; col++) {
      if (columns[col] <= event.startMinute) {
        event.column = col
        columns[col] = event.endMinute
        placed = true
        break
      }
    }
    if (!placed) {
      event.column = columns.length
      columns.push(event.endMinute)
    }
  }

  for (const event of sorted) {
    const group = sorted.filter(
      (e) => e.startMinute < event.endMinute && e.endMinute > event.startMinute
    )
    event.columnCount = Math.max(...group.map((e) => e.column)) + 1
  }

  return sorted
}

export function recomputeLayoutForDate(
  allEvents: CalendarEvent[],
  date: string
): CalendarEvent[] {
  const onDate = allEvents.filter((e) => e.date === date)
  const other = allEvents.filter((e) => e.date !== date)
  const laid = assignColumns(onDate.map((e) => ({ ...e })))
  return [...laid, ...other]
}
