export interface Category {
  id: string
  name: string
  color: string
  textColor: string
}

export interface CalendarEvent {
  id: string
  title: string
  categoryId: string
  date: string
  startMinute: number
  endMinute: number
  column: number
  columnCount: number
  isGoogleEvent?: boolean
}

export interface DragState {
  active: boolean
  startMinute: number
  endMinute: number
}

export type AppView = 'timeline' | 'focus'
