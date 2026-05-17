import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { CategoryPicker } from './CategoryPicker'
import { snapMinute } from '../../utils/time'

function minuteToInputValue(m: number): string {
  return `${Math.floor(m / 60).toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}`
}

function inputValueToMinute(val: string): number {
  const [h, m] = val.split(':').map(Number)
  return h * 60 + m
}

export function EventModal() {
  const modal = useAppStore((s) => s.modal)
  const categories = useAppStore((s) => s.categories)
  const events = useAppStore((s) => s.events)
  const selectedDate = useAppStore((s) => s.selectedDate)
  const addEvent = useAppStore((s) => s.addEvent)
  const updateEvent = useAppStore((s) => s.updateEvent)
  const deleteEvent = useAppStore((s) => s.deleteEvent)
  const closeModal = useAppStore((s) => s.closeModal)

  const existingEvent = modal.eventId ? events.find((e) => e.id === modal.eventId) : null
  const defaultCategoryId = categories[4]?.id ?? 'productive'

  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState(defaultCategoryId)
  const [startStr, setStartStr] = useState('09:00')
  const [endStr, setEndStr] = useState('10:00')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!modal.open) {
      setShowDeleteConfirm(false)
      return
    }
    if (existingEvent) {
      setTitle(existingEvent.title)
      setCategoryId(existingEvent.categoryId)
      setStartStr(minuteToInputValue(existingEvent.startMinute))
      setEndStr(minuteToInputValue(existingEvent.endMinute))
    } else {
      setTitle('')
      setCategoryId(defaultCategoryId)
      setStartStr(minuteToInputValue(modal.prefillStart ?? 540))
      setEndStr(minuteToInputValue(modal.prefillEnd ?? 600))
    }
    setTimeout(() => inputRef.current?.focus(), 150)
  }, [modal.open, modal.eventId])

  const selectedCategory = categories.find((c) => c.id === categoryId)

  const handleSave = () => {
    if (!title.trim()) return
    const startMinute = snapMinute(inputValueToMinute(startStr), 15)
    const endMinute = snapMinute(inputValueToMinute(endStr), 15)
    if (endMinute <= startMinute) return

    if (existingEvent) {
      updateEvent(existingEvent.id, { title: title.trim(), categoryId, startMinute, endMinute })
    } else {
      addEvent({ title: title.trim(), categoryId, date: selectedDate, startMinute, endMinute })
    }
  }

  const handleDelete = () => {
    if (!showDeleteConfirm) { setShowDeleteConfirm(true); return }
    if (existingEvent) deleteEvent(existingEvent.id)
  }

  const accentColor = selectedCategory?.color ?? '#3B82F6'

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/30 transition-opacity duration-200 ${modal.open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeModal}
      />

      {/* Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out max-w-lg mx-auto ${
          modal.open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Color accent bar */}
        <div
          className="h-1 w-16 rounded-full mx-auto mt-3 mb-1 transition-colors duration-200"
          style={{ backgroundColor: accentColor }}
        />

        <div className="px-5 pt-2 pb-6 space-y-4" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-gray-900">
              {existingEvent ? '일정 수정' : '새 일정'}
            </h2>
            <button onClick={closeModal} className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-sm font-bold">
              ✕
            </button>
          </div>

          {/* Title input */}
          <div className="relative">
            <input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="일정 이름 입력"
              className="w-full text-[17px] font-semibold text-gray-900 placeholder-gray-300 outline-none pb-2 border-b-2 transition-colors"
              style={{ borderColor: title ? accentColor : '#E5E7EB' }}
            />
          </div>

          {/* Time pickers */}
          <div className="flex gap-2 items-center">
            <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">시작</label>
              <input
                type="time"
                value={startStr}
                onChange={(e) => setStartStr(e.target.value)}
                className="w-full text-sm font-semibold text-gray-800 bg-transparent outline-none mt-0.5"
              />
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14m-7-7 7 7-7 7"/>
            </svg>
            <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">종료</label>
              <input
                type="time"
                value={endStr}
                onChange={(e) => setEndStr(e.target.value)}
                className="w-full text-sm font-semibold text-gray-800 bg-transparent outline-none mt-0.5"
              />
            </div>
          </div>

          {/* Category picker */}
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">카테고리</p>
            <CategoryPicker
              categories={categories}
              selectedId={categoryId}
              onSelect={setCategoryId}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            {existingEvent && (
              <button
                onClick={handleDelete}
                className={`flex-none py-3 px-4 rounded-2xl text-sm font-semibold transition-colors ${
                  showDeleteConfirm
                    ? 'bg-red-500 text-white'
                    : 'bg-red-50 text-red-500 active:bg-red-100'
                }`}
              >
                {showDeleteConfirm ? '확인 삭제' : '삭제'}
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-40"
              style={{ backgroundColor: accentColor }}
            >
              {existingEvent ? '저장' : '추가하기'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
