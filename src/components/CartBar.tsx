import { formatPrice } from '../lib/currency'
import { CartIcon } from './Icons'

type Props = {
  count: number
  total: number
  onOpen: () => void
}

export function CartBar({ count, total, onOpen }: Props) {
  if (count === 0) return null
  return (
    <div className="cartbar">
      <button type="button" className="cartbar__btn" onClick={onOpen}>
        <span className="cartbar__summary">
          <CartIcon width={22} height={22} />
          <span>
            {count} {count === 1 ? 'producto' : 'productos'} · <strong>{formatPrice(total)}</strong>
          </span>
        </span>
        <span className="cartbar__cta">Ver pedido →</span>
      </button>
    </div>
  )
}
