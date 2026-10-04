import { STORE_CONFIG } from '../config/store'
import { CartIcon, SearchIcon } from './Icons'

type Props = {
  cartCount: number
  onSearchClick: () => void
  onCartClick: () => void
}

const [brand, ...restWords] = STORE_CONFIG.name.split(' ')
const rest = restWords.join(' ')

export function Header({ cartCount, onSearchClick, onCartClick }: Props) {
  return (
    <header className="header">
      <div className="awning" aria-hidden="true" />
      <div className="header__bar">
        <a className="brand" href="#top">
          <span className="brand__mark" aria-hidden="true">G</span>
          <span className="brand__name">
            {brand}{' '}
            {rest && <span className="brand__sub">{rest}</span>}
          </span>
        </a>
        <div className="header__actions">
          <button type="button" className="icon-btn" onClick={onSearchClick} aria-label="Buscar productos">
            <SearchIcon />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={onCartClick}
            aria-label={cartCount > 0 ? `Ver carrito, ${cartCount} productos` : 'Ver carrito'}
          >
            <CartIcon />
            {cartCount > 0 && <span className="icon-btn__badge" aria-hidden="true">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}
