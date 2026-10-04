import { describe, expect, it } from 'vitest'
import { PRODUCTS } from '../src/data/products'
import {
  addItem,
  decrementItem,
  formatWeight,
  getCartLines,
  getCartTotal,
  getItemCount,
  gramsFor,
  parseStoredCart,
  removeItem,
} from '../src/lib/cart'
import type { Cart } from '../src/types/cart'
import { coca, jamon, oreo, soldOut } from './helpers'

describe('carrito', () => {
  it('1. agrega un producto a un carrito vacío con cantidad 1', () => {
    expect(addItem({}, coca)).toEqual({ [coca.id]: 1 })
  })

  it('2. incrementa la cantidad al volver a agregar', () => {
    const cart = addItem(addItem({}, coca), coca)
    expect(cart[coca.id]).toBe(2)
  })

  it('3. reduce la cantidad con menos', () => {
    expect(decrementItem({ [coca.id]: 2 }, coca.id)[coca.id]).toBe(1)
  })

  it('4. elimina el producto al llegar a cero', () => {
    const cart = decrementItem({ [coca.id]: 1 }, coca.id)
    expect(cart).toEqual({})
    expect(coca.id in cart).toBe(false)
  })

  it('nunca deja cantidades negativas', () => {
    expect(decrementItem({}, coca.id)).toEqual({})
    expect(decrementItem(decrementItem({ [coca.id]: 1 }, coca.id), coca.id)).toEqual({})
  })

  it('5. calcula el total: Coca-Cola $149 × 2 + Oreo $85 × 1 = 383', () => {
    const cart: Cart = { [coca.id]: 2, [oreo.id]: 1 }
    expect(getCartTotal(getCartLines(cart, PRODUCTS))).toBe(383)
  })

  it('6. jamón por peso: cantidad 3 = 300 g y $267', () => {
    const lines = getCartLines({ [jamon.id]: 3 }, PRODUCTS)
    expect(gramsFor(jamon, 3)).toBe(300)
    expect(formatWeight(gramsFor(jamon, 3))).toBe('300 g')
    expect(lines[0].subtotal).toBe(267)
    expect(getCartTotal(lines)).toBe(267)
  })

  it('formatea pesos de un kilo o más en kg', () => {
    expect(formatWeight(1000)).toBe('1 kg')
    expect(formatWeight(1200)).toBe('1,2 kg')
  })

  it('8. no agrega productos sin stock', () => {
    const cart = addItem({}, soldOut)
    expect(cart).toEqual({})
  })

  it('removeItem y conteo de productos', () => {
    const cart: Cart = { [coca.id]: 2, [jamon.id]: 3, [oreo.id]: 1 }
    expect(getItemCount(getCartLines(cart, PRODUCTS))).toBe(4)
    expect(removeItem(cart, jamon.id)).toEqual({ [coca.id]: 2, [oreo.id]: 1 })
  })

  it('7. restaura el carrito guardado e ignora datos inválidos', () => {
    const saved = JSON.stringify({ [coca.id]: 2, [jamon.id]: 3, borrado: 4, [oreo.id]: -1 })
    expect(parseStoredCart(saved, PRODUCTS)).toEqual({ [coca.id]: 2, [jamon.id]: 3 })
    expect(parseStoredCart('no es json', PRODUCTS)).toEqual({})
    expect(parseStoredCart(null, PRODUCTS)).toEqual({})
  })
})
