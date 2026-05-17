import type { Category } from '../../types'

interface Props {
  categories: Category[]
  selectedId: string
  onSelect: (id: string) => void
}

export function CategoryPicker({ categories, selectedId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {categories.map((cat) => {
        const selected = selectedId === cat.id
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className="flex flex-col items-center gap-1 py-2 rounded-xl transition-all active:scale-95"
            style={{
              backgroundColor: selected ? `${cat.color}18` : 'transparent',
              outline: selected ? `2px solid ${cat.color}` : '2px solid transparent',
            }}
          >
            <div
              className="w-7 h-7 rounded-full shadow-sm"
              style={{ backgroundColor: cat.color }}
            />
            <span className="text-[10px] font-medium text-gray-500 leading-tight text-center px-0.5 truncate w-full">
              {cat.name.split(' ')[0]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
