import { STORE_CONFIG } from '../config/store'

const formatter = new Intl.NumberFormat(STORE_CONFIG.locale, {
  style: 'currency',
  currency: STORE_CONFIG.currency,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

/** 1245 → "$ 1.245" (espacio común, para que se copie bien en WhatsApp). */
export function formatPrice(amount: number): string {
  return formatter.format(amount).replace(/\s/g, ' ')
}
