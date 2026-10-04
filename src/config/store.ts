/**
 * Configuración central del comercio.
 *
 * Para poner el número real de WhatsApp, reemplazá "598XXXXXXXX" por el
 * número completo con código de país, sin "+" ni espacios (ej: "59899123456").
 * VITE_WHATSAPP_NUMBER sólo se usa para pruebas automáticas o para definirlo
 * desde GitHub sin tocar el código; si no existe, se usa el valor de abajo.
 */
export const STORE_CONFIG = {
  name: 'Ghanina Minimercado',
  deliveryEstimateMinutes: 20,
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '598XXXXXXXX',
  currency: 'UYU',
  locale: 'es-UY',
} as const
