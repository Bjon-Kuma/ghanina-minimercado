import type { Product } from './product'

/** Carrito guardado: id de producto → cantidad (unidades o pasos de peso). */
export type Cart = Record<string, number>

export type CartLine = {
  product: Product
  quantity: number
  subtotal: number
}

export type PaymentMethod = 'cash' | 'card'

export type Customer = {
  name: string
  address: string
}
