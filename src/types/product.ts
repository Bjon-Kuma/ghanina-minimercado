export type SaleType = 'unit' | 'weight'

export type CategoryId = 'bebidas' | 'almacen' | 'snacks' | 'fiambres' | 'hogar'

export type Product = {
  id: string
  name: string
  /** Precio por unidad, o por cada `weightStep` gramos si saleType es "weight". */
  price: number
  category: CategoryId
  /** Ruta dentro de public/, sin barra inicial. Ej: "products/coca-cola.svg" */
  image: string
  saleType: SaleType
  /** Gramos por cada paso de cantidad. Sólo para productos por peso. */
  weightStep?: number
  featured: boolean
  available: boolean
}
