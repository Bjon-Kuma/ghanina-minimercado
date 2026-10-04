import type { Cart, CartLine } from '../types/cart'
import type { Product } from '../types/product'

export const CART_STORAGE_KEY = 'ghanina-cart-v1'

export function addItem(cart: Cart, product: Product): Cart {
  if (!product.available) return cart
  return { ...cart, [product.id]: (cart[product.id] ?? 0) + 1 }
}

export function decrementItem(cart: Cart, productId: string): Cart {
  const current = cart[productId] ?? 0
  if (current <= 1) return removeItem(cart, productId)
  return { ...cart, [productId]: current - 1 }
}

export function removeItem(cart: Cart, productId: string): Cart {
  if (!(productId in cart)) return cart
  const next = { ...cart }
  delete next[productId]
  return next
}

/** Gramos que representa una cantidad de un producto por peso. */
export function gramsFor(product: Product, quantity: number): number {
  return quantity * (product.weightStep ?? 100)
}

/** "300 g", "1 kg", "1,2 kg" */
export function formatWeight(grams: number): string {
  if (grams < 1000) return `${grams} g`
  return `${(grams / 1000).toLocaleString('es-UY', { maximumFractionDigits: 2 })} kg`
}

/** Líneas del carrito en el orden en que se agregaron. */
export function getCartLines(cart: Cart, products: Product[]): CartLine[] {
  const byId = new Map(products.map((p) => [p.id, p]))
  const lines: CartLine[] = []
  for (const [id, quantity] of Object.entries(cart)) {
    const product = byId.get(id)
    if (product && quantity > 0) {
      lines.push({ product, quantity, subtotal: product.price * quantity })
    }
  }
  return lines
}

export function getCartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.subtotal, 0)
}

/** Unidades + un ítem por cada fiambre (300 g de jamón cuenta como 1 producto). */
export function getItemCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + (line.product.saleType === 'weight' ? 1 : line.quantity), 0)
}

/** Lee el carrito guardado, descartando datos rotos o productos que ya no existen. */
export function parseStoredCart(raw: string | null, products: Product[]): Cart {
  if (!raw) return {}
  try {
    const data: unknown = JSON.parse(raw)
    if (!data || typeof data !== 'object' || Array.isArray(data)) return {}
    const known = new Map(products.map((p) => [p.id, p]))
    const cart: Cart = {}
    for (const [id, qty] of Object.entries(data)) {
      const product = known.get(id)
      if (product?.available && Number.isInteger(qty) && (qty as number) > 0) {
        cart[id] = qty as number
      }
    }
    return cart
  } catch {
    return {}
  }
}
