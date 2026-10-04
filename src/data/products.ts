import type { CategoryId, Product } from '../types/product'

/**
 * Catálogo de la tienda.
 *
 * PRECIOS DE DEMOSTRACIÓN: reemplazalos por los precios reales del local.
 * - price: en pesos uruguayos, sin decimales.
 * - Productos por peso (saleType: "weight"): price es el precio cada 100 g.
 * - available: false muestra "Sin stock" sin sacar el producto del catálogo.
 * - featured: true lo muestra en "Más vendidos".
 * - image: archivo dentro de public/products/.
 */
export const PRODUCTS: Product[] = [
  { id: 'coca-cola-1-5l', name: 'Coca-Cola 1.5 L', price: 149, category: 'bebidas', image: 'products/coca-cola-1-5l.svg', saleType: 'unit', featured: true, available: true },
  { id: 'agua-salus-1-5l', name: 'Agua Salus 1.5 L', price: 79, category: 'bebidas', image: 'products/agua-salus-1-5l.svg', saleType: 'unit', featured: true, available: true },
  { id: 'leche-conaprole-1l', name: 'Leche Conaprole entera 1 L', price: 68, category: 'almacen', image: 'products/leche-conaprole-1l.svg', saleType: 'unit', featured: true, available: true },
  { id: 'yerba-canarias-1kg', name: 'Yerba Canarias 1 kg', price: 285, category: 'almacen', image: 'products/yerba-canarias-1kg.svg', saleType: 'unit', featured: true, available: true },
  { id: 'arroz-saman-1kg', name: 'Arroz SAMAN 1 kg', price: 89, category: 'almacen', image: 'products/arroz-saman-1kg.svg', saleType: 'unit', featured: true, available: true },
  { id: 'fideos-adria-500g', name: 'Fideos Adria 500 g', price: 75, category: 'almacen', image: 'products/fideos-adria-500g.svg', saleType: 'unit', featured: true, available: true },
  { id: 'aceite-girasol-900ml', name: 'Aceite de girasol 900 ml', price: 139, category: 'almacen', image: 'products/aceite-girasol-900ml.svg', saleType: 'unit', featured: true, available: true },
  { id: 'azucar-bella-union-1kg', name: 'Azúcar Bella Unión 1 kg', price: 72, category: 'almacen', image: 'products/azucar-bella-union-1kg.svg', saleType: 'unit', featured: true, available: true },
  { id: 'galletitas-maria-400g', name: 'Galletitas María 400 g', price: 92, category: 'snacks', image: 'products/galletitas-maria-400g.svg', saleType: 'unit', featured: true, available: true },
  { id: 'galletitas-oreo', name: 'Galletitas Oreo', price: 85, category: 'snacks', image: 'products/galletitas-oreo.svg', saleType: 'unit', featured: true, available: true },
  { id: 'alfajor-portezuelo', name: 'Alfajor Portezuelo', price: 55, category: 'snacks', image: 'products/alfajor-portezuelo.svg', saleType: 'unit', featured: true, available: true },
  { id: 'papas-chips-120g', name: 'Papas chips 120 g', price: 135, category: 'snacks', image: 'products/papas-chips-120g.svg', saleType: 'unit', featured: true, available: true },
  { id: 'jamon-cocido', name: 'Jamón cocido', price: 89, category: 'fiambres', image: 'products/jamon-cocido.svg', saleType: 'weight', weightStep: 100, featured: true, available: true },
  { id: 'queso-dambo', name: 'Queso dambo', price: 95, category: 'fiambres', image: 'products/queso-dambo.svg', saleType: 'weight', weightStep: 100, featured: true, available: true },
  { id: 'papel-higienico-x4', name: 'Papel higiénico pack x4', price: 145, category: 'hogar', image: 'products/papel-higienico-x4.svg', saleType: 'unit', featured: true, available: true },
]

/** Cuántos productos mostrar como máximo en "Más vendidos". */
export const FEATURED_LIMIT = 30

export type CategoryFilterId = 'featured' | CategoryId

export const CATEGORIES: { id: CategoryFilterId; label: string; emoji: string }[] = [
  { id: 'featured', label: 'Más vendidos', emoji: '🔥' },
  { id: 'bebidas', label: 'Bebidas', emoji: '🥤' },
  { id: 'almacen', label: 'Almacén', emoji: '🧉' },
  { id: 'snacks', label: 'Snacks', emoji: '🍪' },
  { id: 'fiambres', label: 'Fiambres', emoji: '🥪' },
  { id: 'hogar', label: 'Hogar', emoji: '🧼' },
]
