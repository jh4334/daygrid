import { useRef } from 'react'
import type { Category } from '../../types'

interface Props {
  category: Category
  onUpdate: (patch: Partial<Category>) => void
}

export function CategoryEditor({ category, onUpdate }: Props) {
  const colorInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className="w-8 h-8 rounded-full shrink-0 cursor-pointer border-2 border-white shadow"
        style={{ backgroundColor: category.color }}
        onClick={() => colorInputRef.current?.click()}
      >
        <input
          ref={colorInputRef}
          type="color"
          value={category.color}
          onChange={(e) => onUpdate({ color: e.target.value })}
          className="opacity-0 w-0 h-0"
        />
      </div>
      <input
        value={category.name}
        onChange={(e) => onUpdate({ name: e.target.value })}
        className="flex-1 text-sm border-b border-gray-200 outline-none pb-0.5"
      />
    </div>
  )
}
