import { formatWeight, gramsFor } from '../lib/cart'
import { formatPrice } from '../lib/currency'
import type { CartLine } from '../types/cart'
import type { Product } from '../types/product'
import { TrashIcon } from './Icons'
import { ProductImage } from './ProductImage'
import { QuantityControl } from './QuantityControl'
import { Sheet } from './Sheet'

type Props = {
  lines: CartLine[]
  total: number
  onAdd: (product: Product) => void
  onDecrement: (id: string) => void
  onRemove: (id: string) => void
  onClear: () => void
  onCheckout: () => void
  onClose: () => void
}

export function CartDrawer({ lines, total, onAdd, onDecrement, onRemove, onClear, onCheckout, onClose }: Props) {
  const empty = lines.length === 0

  return (
    <Sheet
      title="Tu pedido"
      onClose={onClose}
      footer={
        empty ? undefined : (
          <>
            <div className="total-row">
              <span>Total estimado</span>
              <strong data-testid="cart-total">{formatPrice(total)}</strong>
            </div>
            <button type="button" className="btn btn--primary btn--block" onClick={onCheckout}>
              Continuar con el pedido
            </button>
          </>
        )
      }
    >
      {empty ? (
        <div className="empty">
          <p className="empty__title">Tu carrito está vacío</p>
          <p className="empty__text">Agregá lo que necesites y te lo llevamos en ~20 minutos.</p>
          <button type="button" className="btn btn--ghost" onClick={onClose}>Ver productos</button>
        </div>
      ) : (
        <>
          <ul className="lines">
            {lines.map(({ product, quantity, subtotal }) => {
              const isWeight = product.saleType === 'weight'
              const amount = isWeight ? formatWeight(gramsFor(product, quantity)) : `× ${quantity}`
              return (
                <li key={product.id} className="line" data-testid="cart-line">
                  <ProductImage product={product} className="line__img" />
                  <div className="line__info">
                    <p className="line__name">
                      {product.name} <span className="line__amount">{isWeight ? `— ${amount}` : amount}</span>
                    </p>
                    <p className="line__subtotal">{formatPrice(subtotal)}</p>
                  </div>
                  <div className="line__controls">
                    <QuantityControl
                      size="sm"
                      productName={product.name}
                      display={isWeight ? amount : String(quantity)}
                      onIncrement={() => onAdd(product)}
                      onDecrement={() => onDecrement(product.id)}
                    />
                    <button
                      type="button"
                      className="icon-btn icon-btn--muted"
                      onClick={() => onRemove(product.id)}
                      aria-label={`Eliminar ${product.name} del carrito`}
                    >
                      <TrashIcon width={20} height={20} />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
          <button type="button" className="link-btn" onClick={onClear}>Vaciar carrito</button>
        </>
      )}
    </Sheet>
  )
}
