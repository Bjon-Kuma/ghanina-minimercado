import { CATEGORIES, type CategoryFilterId } from '../data/products'

type Props = {
  selected: CategoryFilterId | null
  onSelect: (id: CategoryFilterId) => void
}

export function CategoryFilter({ selected, onSelect }: Props) {
  return (
    <nav className="categories" aria-label="Categorías">
      <ul className="categories__list">
        {CATEGORIES.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              className="chip"
              aria-pressed={selected === c.id}
              onClick={() => onSelect(c.id)}
            >
              <span aria-hidden="true">{c.emoji}</span> {c.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
