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
      {open && <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-base">설정</h2>
          <button onClick={onClose} className="text-gray-400 text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-5">
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Google Calendar
            </h3>
            <GoogleCalendarSection />
          </section>

          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                카테고리
              </h3>
              <button
                onClick={resetCategories}
                className="text-xs text-blue-500"
              >
                초기화
              </button>
            </div>
            {categories
              .filter((c) => c.id !== 'google-import')
              .map((cat) => (
                <CategoryEditor
                  key={cat.id}
                  category={cat}
                  onUpdate={(patch) => updateCategory(cat.id, patch)}
                />
              ))}
          </section>
        </div>
      </div>
    </>
  )
}
