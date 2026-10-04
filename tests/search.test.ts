import { describe, expect, it } from 'vitest'
import { PRODUCTS } from '../src/data/products'
import { filterProducts, normalizeText } from '../src/lib/search'
import { formatPrice } from '../src/lib/currency'

const names = (list: { name: string }[]) => list.map((p) => p.name)

describe('búsqueda y categorías', () => {
  it('ignora mayúsculas y tildes', () => {
    expect(normalizeText('JAMÓN')).toBe('jamon')
    expect(names(filterProducts(PRODUCTS, 'featured', 'jamon'))).toEqual(['Jamón cocido'])
    expect(names(filterProducts(PRODUCTS, 'featured', 'AZUCAR'))).toEqual(['Azúcar Bella Unión 1 kg'])
  })

  it('"coca" encuentra Coca-Cola 1.5 L, también desde otra categoría', () => {
    expect(names(filterProducts(PRODUCTS, 'hogar', 'coca'))).toEqual(['Coca-Cola 1.5 L'])
    expect(names(filterProducts(PRODUCTS, 'featured', 'cocacola'))).toEqual(['Coca-Cola 1.5 L'])
  })

  it('Más vendidos muestra los 15 productos destacados', () => {
    expect(filterProducts(PRODUCTS, 'featured', '')).toHaveLength(15)
  })

  it('filtra por categoría', () => {
    expect(names(filterProducts(PRODUCTS, 'fiambres', ''))).toEqual(['Jamón cocido', 'Queso dambo'])
  })

  it('formatea precios en pesos uruguayos', () => {
    expect(formatPrice(1245)).toBe('$ 1.245')
    expect(formatPrice(383)).toBe('$ 383')
  })
})
