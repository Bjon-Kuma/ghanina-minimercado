import { useCallback, useMemo } from 'react'
import { PRODUCTS } from '../data/products'
import {
  addItem,
  CART_STORAGE_KEY,
  decrementItem,
  getCartLines,
  getCartTotal,
  getItemCount,
  parseStoredCart,
  removeItem,
} from '../lib/cart'
import type { Product } from '../types/product'
import { useLocalStorage } from './useLocalStorage'

export function useCart(products: Product[] = PRODUCTS) {
  const [cart, setCart] = useLocalStorage(CART_STORAGE_KEY, (raw) => parseStoredCart(raw, products))

  const lines = useMemo(() => getCartLines(cart, products), [cart, products])

  return {
    lines,
    total: getCartTotal(lines),
    count: getItemCount(lines),
    quantityOf: (id: string) => cart[id] ?? 0,
    add: useCallback((product: Product) => setCart((c) => addItem(c, product)), [setCart]),
    decrement: useCallback((id: string) => setCart((c) => decrementItem(c, id)), [setCart]),
    remove: useCallback((id: string) => setCart((c) => removeItem(c, id)), [setCart]),
    clear: useCallback(() => setCart({}), [setCart]),
  }
}

export type CartApi = ReturnType<typeof useCart>
