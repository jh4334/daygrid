import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { CalendarEvent, Category, AppView } from '../types'
import { DEFAULT_CATEGORIES } from '../constants/categories'
import { todayIso } from '../utils/dateUtils'
import { recomputeLayoutForDate } from '../utils/eventLayout'

interface ModalState {
  open: boolean
  eventId: string | null
  prefillStart?: number
  prefillEnd?: number
}

interface AppState {
  events: CalendarEvent[]
  categories: Category[]
  selectedDate: string
  view: AppView
  focusEventId: string | null
  modal: ModalState

  addEvent: (draft: Omit<CalendarEvent, 'id' | 'column' | 'columnCount'>) => void
  updateEvent: (id: string, patch: Partial<CalendarEvent>) => void
  deleteEvent: (id: string) => void

  setSelectedDate: (date: string) => void
  setView: (view: AppView) => void
  setFocusEvent: (id: string | null) => void

  updateCategory: (id: string, patch: Partial<Category>) => void
  resetCategories: () => void

  openCreateModal: (startMinute: number, endMinute: number) => void
  openEditModal: (eventId: string) => void
  closeModal: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, _get) => ({
      events: [],
      categories: DEFAULT_CATEGORIES,
      selectedDate: todayIso(),
      view: 'timeline',
      focusEventId: null,
      modal: { open: false, eventId: null },

      addEvent: (draft) => {
        const event: CalendarEvent = { ...draft, id: nanoid(), column: 0, columnCount: 1 }
        set((state) => ({
          events: recomputeLayoutForDate([...state.events, event], draft.date),
          modal: { open: false, eventId: null },
        }))
      },

      updateEvent: (id, patch) => {
        set((state) => {
          const events = state.events.map((e) => (e.id === id ? { ...e, ...patch } : e))
          const date = events.find((e) => e.id === id)?.date ?? state.selectedDate
          return { events: recomputeLayoutForDate(events, date), modal: { open: false, eventId: null } }
        })
      },

      deleteEvent: (id) => {
        set((state) => {
          const date = state.events.find((e) => e.id === id)?.date ?? state.selectedDate
          const events = state.events.filter((e) => e.id !== id)
          return { events: recomputeLayoutForDate(events, date), modal: { open: false, eventId: null } }
        })
      },

      setSelectedDate: (date) => set({ selectedDate: date }),
      setView: (view) => set({ view }),
      setFocusEvent: (id) => set({ focusEventId: id, view: id ? 'focus' : 'timeline' }),

      updateCategory: (id, patch) =>
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),

      resetCategories: () => set({ categories: DEFAULT_CATEGORIES }),

      openCreateModal: (startMinute, endMinute) =>
        set({ modal: { open: true, eventId: null, prefillStart: startMinute, prefillEnd: endMinute } }),

      openEditModal: (eventId) =>
        set({ modal: { open: true, eventId } }),

      closeModal: () => set({ modal: { open: false, eventId: null } }),
    }),
    {
      name: 'daygrid-storage',
      partialize: (state) => ({
        events: state.events,
        categories: state.categories,
        selectedDate: state.selectedDate,
      }),
    }
  )
)

export function useEventsForDate(date: string): CalendarEvent[] {
  return useAppStore((s) => s.events.filter((e) => e.date === date))
}

export function useCategoryById(id: string): Category | undefined {
  return useAppStore((s) => s.categories.find((c) => c.id === id))
}

export function useCurrentEvent(): CalendarEvent | undefined {
  return useAppStore((s) => {
    const today = todayIso()
    if (s.selectedDate !== today) return undefined
    const now = new Date()
    const cur = now.getHours() * 60 + now.getMinutes()
    return s.events.find(
      (e) => e.date === today && e.startMinute <= cur && e.endMinute > cur
    )
  })
}
