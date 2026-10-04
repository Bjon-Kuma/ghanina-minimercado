import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useCart } from '../src/hooks/useCart'
import { CART_STORAGE_KEY } from '../src/lib/cart'
import { coca, jamon, soldOut } from './helpers'

describe('useCart', () => {
  it('7. el carrito sobrevive a una recarga (localStorage)', () => {
    const first = renderHook(() => useCart())
    act(() => {
      first.result.current.add(coca)
      first.result.current.add(coca)
      first.result.current.add(jamon)
      first.result.current.add(jamon)
      first.result.current.add(jamon)
    })
    expect(JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY)!)).toEqual({ [coca.id]: 2, [jamon.id]: 3 })
    first.unmount()

    const second = renderHook(() => useCart())
    expect(second.result.current.quantityOf(coca.id)).toBe(2)
    expect(second.result.current.quantityOf(jamon.id)).toBe(3)
    expect(second.result.current.total).toBe(149 * 2 + 89 * 3)
  })

  it('8. ignora productos sin stock', () => {
    const { result } = renderHook(() => useCart([coca, soldOut]))
    act(() => result.current.add(soldOut))
    expect(result.current.lines).toHaveLength(0)
  })

  it('vacía el carrito', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.add(coca))
    act(() => result.current.clear())
    expect(result.current.count).toBe(0)
  })
})
