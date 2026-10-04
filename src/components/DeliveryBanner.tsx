import { STORE_CONFIG } from '../config/store'
import { ScooterIcon } from './Icons'

export function DeliveryBanner() {
  return (
    <section className="banner" aria-labelledby="banner-title">
      <h1 id="banner-title" className="banner__title">Pedí desde casa. Te lo llevamos.</h1>
      <ul className="banner__facts">
        <li className="tag tag--strong">
          <ScooterIcon width={20} height={20} />
          Entrega estimada: ~{STORE_CONFIG.deliveryEstimateMinutes} minutos
        </li>
        <li className="tag">Pagás al recibir</li>
      </ul>
    </section>
  )
}
