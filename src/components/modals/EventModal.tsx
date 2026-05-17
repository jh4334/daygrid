import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { CategoryPicker } from './CategoryPicker'
import { snapMinute } from '../../utils/time'

function minuteToInputValue(m: number): string {
  const h = Math.floor(m / 60).toString().padStart(2, '0')
  const min = (m % 60).toString().padStart(2, '0')
  return `${h}:${min}`
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
  const defaultCategoryId = categories.filter((c) => c.id !== 'google-import')[0]?.id ?? 'productive'

  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState(defaultCategoryId)
  const [startStr, setStartStr] = useState('09:00')
  const [endStr, setEndStr] = useState('10:00')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!modal.open) return
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
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [modal.open, modal.eventId])

  if (!modal.open) return null

  const handleSave = () => {
    if (!title.trim()) return
    const startMinute = snapMinute(inputValueToMinute(startStr), 15)
    const endMinute = snapMinute(inputValueToMinute(endStr), 15)
    if (endMinute <= startMinute) return

    if (existingEvent) {
      updateEvent(existingEvent.id, { title: title.trim(), categoryId, startMinute, endMinute })
    } else {
      addEvent({
        title: title.trim(),
        categoryId,
        date: selectedDate,
        startMinute,
        endMinute,
      })
    }
  }

  const handleDelete = () => {
    if (existingEvent) deleteEvent(existingEvent.id)
  }

  const isReadOnly = existingEvent?.isGoogleEvent

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={closeModal} />
      <div className="relative w-full max-w-lg bg-white rounded-t-2xl p-5 pb-safe space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">
            {existingEvent ? (isReadOnly ? '구글 일정' : '일정 수정') : '새 일정'}
          </h2>
          <button onClick={closeModal} className="text-gray-400 text-xl leading-none">✕</button>
        </div>

        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="일정 이름"
          disabled={!!isReadOnly}
          className="w-full border-b border-gray-200 pb-2 text-base outline-none disabled:text-gray-500"
        />

        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">시작</label>
            <input
              type="time"
              value={startStr}
              onChange={(e) => setStartStr(e.target.value)}
              disabled={!!isReadOnly}
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none"
            />
          </div>
          <span className="text-gray-300 mt-4">→</span>
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">종료</label>
            <input
              type="time"
              value={endStr}
              onChange={(e) => setEndStr(e.target.value)}
              disabled={!!isReadOnly}
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none"
            />
          </div>
        </div>

        {!isReadOnly && (
          <div>
            <label className="text-xs text-gray-400 mb-2 block">카테고리</label>
            <CategoryPicker
              categories={categories}
              selectedId={categoryId}
              onSelect={setCategoryId}
            />
          </div>
        )}

        <div className="flex gap-2 pt-1">
          {existingEvent && !isReadOnly && (
            <button
              onClick={handleDelete}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-red-500 bg-red-50 active:bg-red-100"
            >
              삭제
            </button>
          )}
          {!isReadOnly && (
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-500 active:bg-blue-600 disabled:opacity-40"
            >
              {existingEvent ? '저장' : '추가'}
            </button>
          )}
          {isReadOnly && (
            <button
              onClick={closeModal}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-500 bg-gray-100"
            >
              닫기
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

