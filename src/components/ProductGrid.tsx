import type { Product } from '../types/product'
import { ProductCard } from './ProductCard'

type Props = {
  products: Product[]
  quantityOf: (id: string) => number
  onAdd: (product: Product) => void
  onDecrement: (id: string) => void
}

export function ProductGrid({ products, quantityOf, onAdd, onDecrement }: Props) {
  return (
    <ul className="grid" data-testid="product-grid">
      {products.map((p) => (
        <li key={p.id} className="grid__item">
          <ProductCard product={p} quantity={quantityOf(p.id)} onAdd={onAdd} onDecrement={onDecrement} />
        </li>
      ))}
    </ul>
  )
}
