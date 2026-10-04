import { describe, expect, it } from 'vitest'
import { PRODUCTS } from '../src/data/products'
import { getCartLines, getCartTotal } from '../src/lib/cart'
import { buildWhatsAppMessage, buildWhatsAppUrl } from '../src/lib/whatsapp'
import type { Cart, PaymentMethod } from '../src/types/cart'
import { coca, jamon, oreo } from './helpers'

function message(cart: Cart, payment: PaymentMethod = 'cash', name = 'Juan Pérez', address = 'Rivera 1234') {
  const lines = getCartLines(cart, PRODUCTS)
  return buildWhatsAppMessage({ customer: { name, address }, lines, total: getCartTotal(lines), payment })
}

describe('mensaje de WhatsApp', () => {
  it('genera el mensaje exacto', () => {
    const text = message({ [coca.id]: 2, [jamon.id]: 3, [oreo.id]: 1 }, 'card', 'Juan Pérez', 'Av. Rivera 1234, apto 201')
    expect(text).toBe(
      [
        'Hola, soy Juan Pérez de Av. Rivera 1234, apto 201.',
        '',
        'Necesito que me envíen esto lo antes posible:',
        '',
        '- 2 x Coca-Cola 1.5 L',
        '- 300 g de Jamón cocido',
        '- 1 x Galletitas Oreo',
        '',
        'Total estimado: $ 650',
        'Forma de pago: Tarjeta al recibir',
        '',
        'Gracias.',
      ].join('\n'),
    )
  })

  it('9. unidades: contiene "2 x Coca-Cola 1.5 L"', () => {
    expect(message({ [coca.id]: 2 })).toContain('- 2 x Coca-Cola 1.5 L')
  })

  it('10. peso: contiene "300 g de Jamón cocido" y no "3 x Jamón cocido"', () => {
    const text = message({ [jamon.id]: 3 })
    expect(text).toContain('- 300 g de Jamón cocido')
    expect(text).not.toContain('3 x Jamón cocido')
  })

  it('11. incluye nombre y dirección del comprador', () => {
    const text = message({ [coca.id]: 1 }, 'cash', 'Juan Pérez', 'Rivera 1234')
    expect(text).toContain('Juan Pérez')
    expect(text).toContain('Rivera 1234')
  })

  it('12. efectivo', () => {
    expect(message({ [coca.id]: 1 }, 'cash')).toContain('Forma de pago: Efectivo')
  })

  it('13. tarjeta al recibir', () => {
    expect(message({ [coca.id]: 1 }, 'card')).toContain('Forma de pago: Tarjeta al recibir')
  })

  it('no incluye ids ni datos técnicos', () => {
    const text = message({ [coca.id]: 1, [jamon.id]: 2 })
    expect(text).not.toContain(coca.id)
    expect(text).not.toContain(jamon.id)
    expect(text).not.toMatch(/[{}[\]]/)
  })

  it('14. codifica tildes, ñ, espacios y saltos de línea en el enlace wa.me', () => {
    const text = 'Hola, soy Ñandú Muñoz\nDirección: Peñarol 1º & 2?'
    const url = buildWhatsAppUrl('59899123456', text)
    expect(url.startsWith('https://wa.me/59899123456?text=')).toBe(true)
    const encoded = url.split('?text=')[1]
    expect(encoded).not.toMatch(/[\s\n&?]/)
    expect(encoded).toContain('%C3%91') // Ñ
    expect(encoded).toContain('%C3%B1') // ñ
    expect(encoded).toContain('%C3%BA') // ú
    expect(encoded).toContain('%0A') // salto de línea
    expect(encoded).toContain('%20') // espacio
    expect(decodeURIComponent(encoded)).toBe(text)
    expect(new URL(url).searchParams.get('text')).toBe(text)
  })
})
