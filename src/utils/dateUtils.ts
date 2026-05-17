import { format, isToday as dfIsToday, addDays as dfAddDays, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'

export function todayIso(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function isToday(isoDate: string): boolean {
  return dfIsToday(parseISO(isoDate))
}

export function addDays(isoDate: string, n: number): string {
  return format(dfAddDays(parseISO(isoDate), n), 'yyyy-MM-dd')
}

export function formatDisplayDate(isoDate: string): string {
  const date = parseISO(isoDate)
  return format(date, 'MM.dd EEE', { locale: ko })
}

export function formatHeaderDate(isoDate: string): { dateNum: string; dayLabel: string } {
  const date = parseISO(isoDate)
  return {
    dateNum: format(date, 'MM.dd'),
    dayLabel: format(date, 'EEE', { locale: ko }),
  }
}
