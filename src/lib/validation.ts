import type { CartLine, Customer, PaymentMethod } from '../types/cart'

export type CheckoutField = 'cart' | 'name' | 'address' | 'payment' | 'store'
export type CheckoutErrors = Partial<Record<CheckoutField, string>>

export type CheckoutInput = {
  lines: CartLine[]
  customer: Customer
  payment: PaymentMethod | null
  storePhone: string
}

/** Número con código de país, sólo dígitos. "598XXXXXXXX" no es válido. */
export function isValidStorePhone(phone: string): boolean {
  return /^\d{8,15}$/.test(phone)
}

export function validateCheckout({ lines, customer, payment, storePhone }: CheckoutInput): CheckoutErrors {
  const errors: CheckoutErrors = {}
  if (lines.length === 0) errors.cart = 'Tu carrito está vacío. Agregá algún producto para hacer el pedido.'
  if (!customer.name.trim()) errors.name = 'Escribí tu nombre para que sepamos quién pide.'
  if (!customer.address.trim()) errors.address = 'Agregá tu dirección para poder enviar el pedido.'
  if (!payment) errors.payment = 'Elegí cómo vas a pagar al recibir.'
  if (!isValidStorePhone(storePhone)) {
    errors.store = 'El comercio todavía no configuró su número de WhatsApp. Avisale al local.'
  }
  return errors
}
