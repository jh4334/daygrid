import type { Category } from '../../types'

interface Props {
  categories: Category[]
  selectedId: string
  onSelect: (id: string) => void
}

export function CategoryPicker({ categories, selectedId, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 py-1">
      {categories.filter((c) => c.id !== 'google-import').map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          style={{
            backgroundColor: selectedId === cat.id ? cat.color : `${cat.color}22`,
            color: selectedId === cat.id ? cat.textColor : cat.color,
            outline: selectedId === cat.id ? `2px solid ${cat.color}` : 'none',
          }}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
