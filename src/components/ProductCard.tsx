import { formatWeight, gramsFor } from '../lib/cart'
import { formatPrice } from '../lib/currency'
import type { Product } from '../types/product'
import { ProductImage } from './ProductImage'
import { QuantityControl } from './QuantityControl'

type Props = {
  product: Product
  quantity: number
  onAdd: (product: Product) => void
  onDecrement: (id: string) => void
}

export function ProductCard({ product, quantity, onAdd, onDecrement }: Props) {
  const isWeight = product.saleType === 'weight'
  const step = product.weightStep ?? 100
  const soldOut = !product.available

  return (
    <article className={`card${soldOut ? ' card--soldout' : ''}`} aria-label={product.name}>
      <div className="card__media">
        <ProductImage product={product} className="card__img" />
        {soldOut && <span className="card__badge">Sin stock</span>}
      </div>
      <div className="card__body">
        <h3 className="card__name">{product.name}</h3>
        <p className="card__price">
          <span className="price-tag">{formatPrice(product.price)}</span>
          {isWeight && <span className="card__unit"> / {step} g</span>}
        </p>
        {isWeight && <p className="card__hint">Precio por {step} g</p>}
      </div>
      <div className="card__action">
        {soldOut ? (
          <button type="button" className="btn btn--add" disabled>Sin stock</button>
        ) : quantity > 0 ? (
          <QuantityControl
            productName={product.name}
            display={isWeight ? formatWeight(gramsFor(product, quantity)) : String(quantity)}
            onIncrement={() => onAdd(product)}
            onDecrement={() => onDecrement(product.id)}
          />
        ) : (
          <button type="button" className="btn btn--add" onClick={() => onAdd(product)} aria-label={`Agregar ${product.name}`}>
            Agregar
          </button>
        )}
      </div>
    </article>
  )
}
