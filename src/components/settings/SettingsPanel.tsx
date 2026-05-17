import { useAppStore } from '../../store/useAppStore'
import { CategoryEditor } from './CategoryEditor'
import { GoogleCalendarSection } from './GoogleCalendarSection'

interface Props {
  open: boolean
  onClose: () => void
}

export function SettingsPanel({ open, onClose }: Props) {
  const categories = useAppStore((s) => s.categories)
  const updateCategory = useAppStore((s) => s.updateCategory)
  const resetCategories = useAppStore((s) => s.resetCategories)

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/25 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-12 pb-4 border-b border-gray-100">
          <h2 className="font-black text-lg text-gray-900">설정</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          <section>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              Google Calendar
            </h3>
            <GoogleCalendarSection />
          </section>

          <div className="h-px bg-gray-100" />

          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                색상 카테고리
              </h3>
              <button
                onClick={resetCategories}
                className="text-xs font-semibold text-blue-500 active:text-blue-700"
              >
                초기화
              </button>
            </div>
            <div className="space-y-1">
              {categories
                .filter((c) => c.id !== 'google-import')
                .map((cat) => (
                  <CategoryEditor
                    key={cat.id}
                    category={cat}
                    onUpdate={(patch) => updateCategory(cat.id, patch)}
                  />
                ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
