export const GRID_START_MINUTE = 360  // 6:00
export const GRID_END_MINUTE = 1440   // 24:00
export const PIXELS_PER_HOUR = 60
export const GRID_HEIGHT = ((GRID_END_MINUTE - GRID_START_MINUTE) / 60) * PIXELS_PER_HOUR

export function minuteToPixel(minute: number): number {
  return (minute - GRID_START_MINUTE) * (PIXELS_PER_HOUR / 60)
}

export function pixelToMinute(px: number): number {
  return Math.round(px / (PIXELS_PER_HOUR / 60)) + GRID_START_MINUTE
}

export function snapMinute(minute: number, interval: 15 | 30 = 15): number {
  return Math.round(minute / interval) * interval
}

export function formatMinute(minute: number): string {
  const h = Math.floor(minute / 60)
  const m = minute % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function currentMinuteOfDay(): number {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}
