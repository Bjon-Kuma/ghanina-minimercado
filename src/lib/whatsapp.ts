import type { CartLine, Customer, PaymentMethod } from '../types/cart'
import { formatWeight, gramsFor } from './cart'
import { formatPrice } from './currency'

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cash: 'Efectivo',
  card: 'Tarjeta al recibir',
}

export type OrderDetails = {
  customer: Customer
  lines: CartLine[]
  total: number
  payment: PaymentMethod
}

/** "2 x Coca-Cola 1.5 L" o "300 g de Jamón cocido" */
export function describeLine({ product, quantity }: Pick<CartLine, 'product' | 'quantity'>): string {
  if (product.saleType === 'weight') {
    return `${formatWeight(gramsFor(product, quantity))} de ${product.name}`
  }
  return `${quantity} x ${product.name}`
}

export function buildWhatsAppMessage({ customer, lines, total, payment }: OrderDetails): string {
  return [
    `Hola, soy ${customer.name.trim()} de ${customer.address.trim()}.`,
    '',
    'Necesito que me envíen esto lo antes posible:',
    '',
    ...lines.map((line) => `- ${describeLine(line)}`),
    '',
    `Total estimado: ${formatPrice(total)}`,
    `Forma de pago: ${PAYMENT_LABELS[payment]}`,
    '',
    'Gracias.',
  ].join('\n')
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
