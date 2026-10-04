import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import { CartBar } from '../src/components/CartBar'
import { CartDrawer } from '../src/components/CartDrawer'
import { CheckoutModal } from '../src/components/CheckoutModal'
import { ProductCard } from '../src/components/ProductCard'
import { QuantityControl } from '../src/components/QuantityControl'
import { PRODUCTS } from '../src/data/products'
import { addItem, decrementItem, getCartLines, getCartTotal } from '../src/lib/cart'
import type { Cart } from '../src/types/cart'
import type { Product } from '../src/types/product'
import { coca, jamon, oreo, soldOut } from './helpers'

function StatefulCard({ product }: { product: Product }) {
  const [cart, setCart] = useState<Cart>({})
  return (
    <ProductCard
      product={product}
      quantity={cart[product.id] ?? 0}
      onAdd={(p) => setCart((c) => addItem(c, p))}
      onDecrement={(id) => setCart((c) => decrementItem(c, id))}
    />
  )
}

describe('ProductCard', () => {
  it('muestra Agregar y después el control − 1 +, nunca los dos a la vez', async () => {
    const user = userEvent.setup()
    render(<StatefulCard product={coca} />)
    expect(screen.getByText('Coca-Cola 1.5 L')).toBeInTheDocument()
    expect(screen.getByText('$ 149')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Coca-Cola 1.5 L' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Agregar Coca-Cola 1.5 L' }))
    expect(screen.queryByRole('button', { name: /^Agregar Coca/ })).not.toBeInTheDocument()
    const control = screen.getByRole('group', { name: 'Cantidad de Coca-Cola 1.5 L' })
    expect(within(control).getByText('1')).toBeInTheDocument()

    await user.click(within(control).getByRole('button', { name: /Agregar uno más/ }))
    expect(within(control).getByText('2')).toBeInTheDocument()

    await user.click(within(control).getByRole('button', { name: /Quitar uno/ }))
    await user.click(within(control).getByRole('button', { name: /Quitar uno/ }))
    expect(screen.getByRole('button', { name: 'Agregar Coca-Cola 1.5 L' })).toBeInTheDocument()
  })

  it('producto sin stock: muestra "Sin stock" y el botón está deshabilitado', () => {
    const onAdd = vi.fn()
    render(<ProductCard product={soldOut} quantity={0} onAdd={onAdd} onDecrement={vi.fn()} />)
    const button = screen.getByRole('button', { name: 'Sin stock' })
    expect(button).toBeDisabled()
    expect(screen.getAllByText('Sin stock').length).toBeGreaterThan(0)
  })

  it('producto por peso muestra "/ 100 g" y la cantidad en gramos', async () => {
    const user = userEvent.setup()
    render(<StatefulCard product={jamon} />)
    expect(screen.getByText('/ 100 g', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Precio por 100 g')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Agregar Jamón cocido' }))
    await user.click(screen.getByRole('button', { name: /Agregar uno más/ }))
    await user.click(screen.getByRole('button', { name: /Agregar uno más/ }))
    expect(screen.getByText('300 g')).toBeInTheDocument()
  })
})

describe('QuantityControl', () => {
  it('llama a sumar y restar con botones accesibles', async () => {
    const user = userEvent.setup()
    const inc = vi.fn()
    const dec = vi.fn()
    render(<QuantityControl productName="Oreo" display="3" onIncrement={inc} onDecrement={dec} />)
    await user.click(screen.getByRole('button', { name: 'Agregar uno más de Oreo' }))
    await user.click(screen.getByRole('button', { name: 'Quitar uno de Oreo' }))
    expect(inc).toHaveBeenCalledOnce()
    expect(dec).toHaveBeenCalledOnce()
  })
})

describe('CartBar', () => {
  it('no aparece con el carrito vacío', () => {
    const { container } = render(<CartBar count={0} total={0} onOpen={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('muestra cantidad y total', () => {
    render(<CartBar count={4} total={580} onOpen={vi.fn()} />)
    expect(screen.getByRole('button', { name: /4 productos · \$ 580.*Ver pedido/ })).toBeInTheDocument()
  })
})

describe('CartDrawer', () => {
  it('muestra peso en gramos, unidades con ×, subtotales y total', () => {
    const lines = getCartLines({ [jamon.id]: 3, [coca.id]: 2 }, PRODUCTS)
    render(
      <CartDrawer
        lines={lines}
        total={getCartTotal(lines)}
        onAdd={vi.fn()}
        onDecrement={vi.fn()}
        onRemove={vi.fn()}
        onClear={vi.fn()}
        onCheckout={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    const [jamonLine, cocaLine] = screen.getAllByTestId('cart-line')
    expect(jamonLine).toHaveTextContent('Jamón cocido — 300 g')
    expect(jamonLine).toHaveTextContent('$ 267')
    expect(jamonLine).not.toHaveTextContent('× 3')
    expect(cocaLine).toHaveTextContent('Coca-Cola 1.5 L × 2')
    expect(cocaLine).toHaveTextContent('$ 298')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('$ 565')
  })

  it('carrito vacío muestra un mensaje y no deja continuar', () => {
    render(
      <CartDrawer lines={[]} total={0} onAdd={vi.fn()} onDecrement={vi.fn()} onRemove={vi.fn()} onClear={vi.fn()} onCheckout={vi.fn()} onClose={vi.fn()} />,
    )
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Continuar con el pedido' })).not.toBeInTheDocument()
  })
})

describe('CheckoutModal', () => {
  const lines = getCartLines({ [coca.id]: 2, [oreo.id]: 1 }, PRODUCTS)
  const props = { lines, total: 383, storePhone: '59899123456', onBack: vi.fn(), onClose: vi.fn(), onFinish: vi.fn() }

  it('arma el enlace de WhatsApp con los datos del pedido', async () => {
    const user = userEvent.setup()
    const openUrl = vi.fn()
    render(<CheckoutModal {...props} openUrl={openUrl} />)
    await user.type(screen.getByLabelText('Nombre'), 'Juan Pérez')
    await user.type(screen.getByLabelText('Dirección'), 'Rivera 1234')
    await user.click(screen.getByLabelText(/Tarjeta al recibir/))
    expect(screen.getByTestId('checkout-total')).toHaveTextContent('$ 383')
    await user.click(screen.getByRole('button', { name: /Pedir por WhatsApp/ }))

    expect(openUrl).toHaveBeenCalledOnce()
    const url = new URL(openUrl.mock.calls[0][0])
    expect(url.origin + url.pathname).toBe('https://wa.me/59899123456')
    const text = url.searchParams.get('text')!
    expect(text).toContain('Hola, soy Juan Pérez de Rivera 1234.')
    expect(text).toContain('- 2 x Coca-Cola 1.5 L')
    expect(text).toContain('Total estimado: $ 383')
    expect(text).toContain('Forma de pago: Tarjeta al recibir')
    expect(screen.getByText('Abrimos WhatsApp con tu pedido.')).toBeInTheDocument()
  })

  it('no envía sin dirección y lo explica', async () => {
    const user = userEvent.setup()
    const openUrl = vi.fn()
    render(<CheckoutModal {...props} openUrl={openUrl} />)
    await user.type(screen.getByLabelText('Nombre'), 'Juan')
    await user.click(screen.getByLabelText(/Efectivo/))
    await user.click(screen.getByRole('button', { name: /Pedir por WhatsApp/ }))
    expect(openUrl).not.toHaveBeenCalled()
    expect(screen.getByText('Agregá tu dirección para poder enviar el pedido.')).toBeInTheDocument()
    expect(screen.getByLabelText('Dirección')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Dirección')).toHaveFocus()
  })

  it('15. no envía con el carrito vacío', async () => {
    const user = userEvent.setup()
    const openUrl = vi.fn()
    render(<CheckoutModal {...props} lines={[]} total={0} openUrl={openUrl} />)
    await user.type(screen.getByLabelText('Nombre'), 'Juan')
    await user.type(screen.getByLabelText('Dirección'), 'Rivera 1234')
    await user.click(screen.getByLabelText(/Efectivo/))
    await user.click(screen.getByRole('button', { name: /Pedir por WhatsApp/ }))
    expect(openUrl).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent('Tu carrito está vacío')
  })

  it('no envía si el número del comercio no está configurado', async () => {
    const user = userEvent.setup()
    const openUrl = vi.fn()
    render(<CheckoutModal {...props} storePhone="598XXXXXXXX" openUrl={openUrl} />)
    await user.type(screen.getByLabelText('Nombre'), 'Juan')
    await user.type(screen.getByLabelText('Dirección'), 'Rivera 1234')
    await user.click(screen.getByLabelText(/Efectivo/))
    await user.click(screen.getByRole('button', { name: /Pedir por WhatsApp/ }))
    expect(openUrl).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent('no configuró su número de WhatsApp')
  })
})

describe('App', () => {
  it('muestra los 15 productos, la promesa de ~20 minutos y actualiza el total', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Pedí desde casa. Te lo llevamos.' })).toBeInTheDocument()
    expect(screen.getByText(/Entrega estimada: ~20 minutos/)).toBeInTheDocument()
    expect(screen.getByText('Pagás al recibir')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(15)

    await user.click(screen.getByRole('button', { name: 'Agregar Coca-Cola 1.5 L' }))
    await user.click(screen.getByRole('button', { name: 'Agregar uno más de Coca-Cola 1.5 L' }))
    expect(screen.getByRole('button', { name: /2 productos · \$ 298/ })).toBeInTheDocument()
  })
})
