import { describe, expect, it } from 'vitest'
import { PRODUCTS } from '../src/data/products'
import { getCartLines } from '../src/lib/cart'
import { isValidStorePhone, validateCheckout } from '../src/lib/validation'
import { coca } from './helpers'

const lines = getCartLines({ [coca.id]: 1 }, PRODUCTS)
const valid = {
  lines,
  customer: { name: 'Juan Pérez', address: 'Rivera 1234' },
  payment: 'cash' as const,
  storePhone: '59899123456',
}

describe('validación del pedido', () => {
  it('acepta un pedido completo', () => {
    expect(validateCheckout(valid)).toEqual({})
  })

  it('15. no permite pedir con el carrito vacío', () => {
    expect(validateCheckout({ ...valid, lines: [] }).cart).toBeTruthy()
  })

  it('exige nombre, dirección y forma de pago', () => {
    const errors = validateCheckout({ ...valid, customer: { name: '  ', address: '' }, payment: null })
    expect(errors.name).toBeTruthy()
    expect(errors.address).toBe('Agregá tu dirección para poder enviar el pedido.')
    expect(errors.payment).toBeTruthy()
  })

  it('rechaza el número de WhatsApp sin configurar', () => {
    expect(isValidStorePhone('598XXXXXXXX')).toBe(false)
    expect(isValidStorePhone('+598 99 123 456')).toBe(false)
    expect(isValidStorePhone('59899123456')).toBe(true)
    expect(validateCheckout({ ...valid, storePhone: '598XXXXXXXX' }).store).toBeTruthy()
  })
})
