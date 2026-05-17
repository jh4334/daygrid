import type { Category } from '../types'

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'house-work', name: 'House work', color: '#EF4444', textColor: '#ffffff' },
  { id: 'prep', name: 'Prep', color: '#F97316', textColor: '#ffffff' },
  { id: 'meal', name: 'Meal & Coffee', color: '#EAB308', textColor: '#000000' },
  { id: 'physical', name: 'Physical activity', color: '#22C55E', textColor: '#ffffff' },
  { id: 'productive', name: 'Productive', color: '#3B82F6', textColor: '#ffffff' },
  { id: 'game', name: 'Game / OTT', color: '#8B5CF6', textColor: '#ffffff' },
  { id: 'creative', name: 'Creative', color: '#EC4899', textColor: '#ffffff' },
  { id: 'rest', name: 'Rest & Sleep', color: '#9CA3AF', textColor: '#ffffff' },
  { id: 'google-import', name: 'Google Calendar', color: '#4285F4', textColor: '#ffffff' },
]

export const GOOGLE_COLOR_MAP: Record<string, string> = {
  '1': '#7986CB',
  '2': '#33B679',
  '3': '#8E24AA',
  '4': '#E67C73',
  '5': '#F6BF26',
  '6': '#F4511E',
  '7': '#039BE5',
  '8': '#616161',
  '9': '#3F51B5',
  '10': '#0B8043',
  '11': '#D50000',
}
