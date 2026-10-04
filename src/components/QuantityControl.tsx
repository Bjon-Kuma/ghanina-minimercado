import { MinusIcon, PlusIcon } from './Icons'

type Props = {
  productName: string
  /** Lo que se muestra entre − y + (ej: "2" o "300 g"). */
  display: string
  onIncrement: () => void
  onDecrement: () => void
  size?: 'md' | 'sm'
}

export function QuantityControl({ productName, display, onIncrement, onDecrement, size = 'md' }: Props) {
  return (
    <div className={`qty qty--${size}`} role="group" aria-label={`Cantidad de ${productName}`}>
      <button type="button" className="qty__btn" onClick={onDecrement} aria-label={`Quitar uno de ${productName}`}>
        <MinusIcon width={20} height={20} />
      </button>
      <output className="qty__value" aria-live="polite">{display}</output>
      <button type="button" className="qty__btn" onClick={onIncrement} aria-label={`Agregar uno más de ${productName}`}>
        <PlusIcon width={20} height={20} />
      </button>
    </div>
  )
}
