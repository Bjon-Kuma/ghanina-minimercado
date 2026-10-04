import type { CategoryFilterId } from '../data/products'
import { FEATURED_LIMIT } from '../data/products'
import type { Product } from '../types/product'

/** Minúsculas, sin tildes y sin signos: "Coca-Cola" → "coca cola". */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ.]+/g, ' ')
    .trim()
}

/**
 * Con texto de búsqueda se busca en todo el catálogo (no importa la categoría);
 * sin texto se muestra la categoría elegida.
 */
export function filterProducts(products: Product[], category: CategoryFilterId, query: string): Product[] {
  const words = normalizeText(query).split(' ').filter(Boolean)
  if (words.length > 0) {
    return products.filter((p) => {
      const name = normalizeText(p.name)
      const compact = name.replace(/ /g, '')
      return words.every((w) => name.includes(w) || compact.includes(w))
    })
  }
  if (category === 'featured') return products.filter((p) => p.featured).slice(0, FEATURED_LIMIT)
  return products.filter((p) => p.category === category)
}
