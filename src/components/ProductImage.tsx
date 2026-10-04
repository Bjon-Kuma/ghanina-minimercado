import { useState } from 'react'
import type { Product } from '../types/product'

/** Imagen del producto con un respaldo neutro si el archivo no existe. */
export function ProductImage({ product, className }: { product: Product; className?: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className={`${className ?? ''} img-fallback`} role="img" aria-label={product.name}>
        {product.name.charAt(0)}
      </div>
    )
  }
  return (
    <img
      className={className}
      src={`${import.meta.env.BASE_URL}${product.image}`}
      alt={product.name}
      loading="lazy"
      decoding="async"
      width={400}
      height={400}
      onError={() => setFailed(true)}
    />
  )
}
