import { useState, type FormEvent } from 'react'
import { STORE_CONFIG } from '../config/store'
import { formatPrice } from '../lib/currency'
import { validateCheckout, type CheckoutErrors } from '../lib/validation'
import { buildWhatsAppMessage, buildWhatsAppUrl, describeLine, PAYMENT_LABELS } from '../lib/whatsapp'
import type { CartLine, PaymentMethod } from '../types/cart'
import { BackIcon, WhatsAppIcon } from './Icons'
import { Sheet } from './Sheet'

type Props = {
  lines: CartLine[]
  total: number
  storePhone?: string
  onBack: () => void
  onClose: () => void
  onFinish: () => void
  openUrl?: (url: string) => void
}

function openInNewTab(url: string) {
  const win = window.open(url, '_blank')
  if (win) win.opener = null
  else window.location.href = url
}

const PAYMENT_OPTIONS: { id: PaymentMethod; emoji: string }[] = [
  { id: 'cash', emoji: '💵' },
  { id: 'card', emoji: '💳' },
]

export function CheckoutModal({
  lines,
  total,
  storePhone = STORE_CONFIG.whatsappNumber,
  onBack,
  onClose,
  onFinish,
  openUrl = openInNewTab,
}: Props) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [payment, setPayment] = useState<PaymentMethod | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [sentUrl, setSentUrl] = useState<string | null>(null)

  const input = { lines, customer: { name, address }, payment, storePhone }
  const errors: CheckoutErrors = attempted ? validateCheckout(input) : {}
  const minutes = STORE_CONFIG.deliveryEstimateMinutes

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setAttempted(true)
    const found = validateCheckout(input)
    if (Object.keys(found).length > 0 || !payment) {
      const firstField = (['name', 'address'] as const).find((f) => found[f])
      if (firstField) document.getElementById(`checkout-${firstField}`)?.focus()
      return
    }
    const message = buildWhatsAppMessage({ customer: { name, address }, lines, total, payment })
    const url = buildWhatsAppUrl(storePhone, message)
    setSentUrl(url)
    openUrl(url)
  }

  if (sentUrl) {
    return (
      <Sheet title="¡Pedido listo!" onClose={onClose}>
        <div className="sent">
          <span className="sent__icon" aria-hidden="true"><WhatsAppIcon width={40} height={40} /></span>
          <p className="sent__title">Abrimos WhatsApp con tu pedido.</p>
          <p className="sent__text">
            Tocá enviar en WhatsApp para confirmarlo. Te lo llevamos en ~{minutes} minutos.
          </p>
          <a className="btn btn--whatsapp btn--block" href={sentUrl} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon /> Abrir WhatsApp de nuevo
          </a>
          <button type="button" className="btn btn--ghost btn--block" onClick={onFinish}>
            Listo, empezar un pedido nuevo
          </button>
        </div>
      </Sheet>
    )
  }

  const hasFieldErrors = Boolean(errors.name || errors.address || errors.payment)
  const hasErrors = hasFieldErrors || Boolean(errors.cart || errors.store)

  return (
    <Sheet
      title="Datos de entrega"
      onClose={onClose}
      leading={
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Volver al carrito">
          <BackIcon />
        </button>
      }
      footer={
        <>
          {hasErrors && (
            <div className="alert" role="alert">
              {errors.cart && <p>{errors.cart}</p>}
              {errors.store && <p>{errors.store}</p>}
              {hasFieldErrors && <p>Completá los datos marcados en rojo para enviar el pedido.</p>}
            </div>
          )}
          <button type="submit" form="checkout-form" className="btn btn--whatsapp btn--block btn--lg">
            <WhatsAppIcon /> Pedir por WhatsApp
          </button>
          <p className="checkout__note">Se abre WhatsApp con el mensaje listo. Pagás al recibir.</p>
        </>
      }
    >
      <form id="checkout-form" className="checkout" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="checkout-name" className="field__label">Nombre</label>
          <input
            id="checkout-name"
            className="field__input"
            type="text"
            autoComplete="name"
            placeholder="Juan Pérez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'error-name' : undefined}
          />
          {errors.name && <p id="error-name" className="field__error">{errors.name}</p>}
        </div>

        <div className="field">
          <label htmlFor="checkout-address" className="field__label">Dirección</label>
          <input
            id="checkout-address"
            className="field__input"
            type="text"
            autoComplete="street-address"
            placeholder="Av. Rivera 1234, apto 201"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            aria-invalid={Boolean(errors.address)}
            aria-describedby={errors.address ? 'error-address' : undefined}
          />
          {errors.address && <p id="error-address" className="field__error">{errors.address}</p>}
        </div>

        <fieldset className="field">
          <legend className="field__label">Forma de pago</legend>
          <div className="pay">
            {PAYMENT_OPTIONS.map((opt) => (
              <label key={opt.id} className="pay__option">
                <input
                  type="radio"
                  name="payment"
                  value={opt.id}
                  checked={payment === opt.id}
                  onChange={() => setPayment(opt.id)}
                />
                <span className="pay__box">
                  <span aria-hidden="true" className="pay__emoji">{opt.emoji}</span>
                  {PAYMENT_LABELS[opt.id]}
                </span>
              </label>
            ))}
          </div>
          {errors.payment && <p className="field__error">{errors.payment}</p>}
        </fieldset>

        <section className="review" aria-labelledby="review-title">
          <h3 id="review-title" className="review__title">Revisá tu pedido</h3>
          <dl className="review__data">
            <div><dt>Nombre</dt><dd>{name.trim() || '—'}</dd></div>
            <div><dt>Dirección</dt><dd>{address.trim() || '—'}</dd></div>
            <div><dt>Forma de pago</dt><dd>{payment ? PAYMENT_LABELS[payment] : '—'}</dd></div>
            <div><dt>Entrega estimada</dt><dd>~{minutes} minutos</dd></div>
          </dl>
          <ul className="review__lines">
            {lines.map((line) => (
              <li key={line.product.id}>
                <span>{describeLine(line)}</span>
                <span>{formatPrice(line.subtotal)}</span>
              </li>
            ))}
          </ul>
          <div className="total-row">
            <span>Total estimado</span>
            <strong data-testid="checkout-total">{formatPrice(total)}</strong>
          </div>
        </section>

      </form>
    </Sheet>
  )
}
