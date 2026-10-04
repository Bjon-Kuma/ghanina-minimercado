import { PRODUCTS } from '../src/data/products'
import type { Product } from '../src/types/product'

export function product(id: string): Product {
  const found = PRODUCTS.find((p) => p.id === id)
  if (!found) throw new Error(`Producto de prueba inexistente: ${id}`)
  return found
}

export const coca = product('coca-cola-1-5l')
export const oreo = product('galletitas-oreo')
export const jamon = product('jamon-cocido')
export const queso = product('queso-dambo')
export const soldOut: Product = { ...product('alfajor-portezuelo'), id: 'agotado', available: false }
