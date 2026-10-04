import type { Ref } from 'react'
import { CloseIcon, SearchIcon } from './Icons'

type Props = {
  value: string
  onChange: (value: string) => void
  inputRef?: Ref<HTMLInputElement>
}

export function SearchBar({ value, onChange, inputRef }: Props) {
  return (
    <div className="search" role="search">
      <label htmlFor="search-input" className="visually-hidden">Buscar productos</label>
      <SearchIcon className="search__icon" width={20} height={20} />
      <input
        ref={inputRef}
        id="search-input"
        className="search__input"
        type="search"
        placeholder="¿Qué necesitás?"
        autoComplete="off"
        enterKeyHint="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button type="button" className="search__clear" onClick={() => onChange('')} aria-label="Borrar búsqueda">
          <CloseIcon width={18} height={18} />
        </button>
      )}
    </div>
  )
}
