import { expect, test } from '@playwright/test'
import { addProduct, card, expectNoHorizontalOverflow, gridColumns, sendOrder, stubWhatsApp } from './helpers'

test.beforeEach(async ({ page }) => {
  await stubWhatsApp(page)
  await page.goto('/')
})

test('1. compra normal con efectivo', async ({ page }) => {
  await expect(page.getByText('Entrega estimada: ~20 minutos')).toBeVisible()
  await expect(page.getByRole('article')).toHaveCount(15)

  await addProduct(page, 'Coca-Cola 1.5 L')
  await addProduct(page, 'Coca-Cola 1.5 L')
  await addProduct(page, 'Galletitas Oreo')

  await page.getByRole('button', { name: /Ver pedido/ }).click()
  await expect(page.getByTestId('cart-total')).toHaveText('$ 383')
  await page.getByRole('button', { name: 'Continuar con el pedido' }).click()

  const { url, text } = await sendOrder(page, 'Juan Pérez', 'Av. Rivera 1234, apto 201', 'Efectivo')
  expect(url).toContain('https://wa.me/')
  expect(text).toBe(
    [
      'Hola, soy Juan Pérez de Av. Rivera 1234, apto 201.',
      '',
      'Necesito que me envíen esto lo antes posible:',
      '',
      '- 2 x Coca-Cola 1.5 L',
      '- 1 x Galletitas Oreo',
      '',
      'Total estimado: $ 383',
      'Forma de pago: Efectivo',
      '',
      'Gracias.',
    ].join('\n'),
  )
  await expect(page.getByText('Abrimos WhatsApp con tu pedido.')).toBeVisible()

  await page.getByRole('button', { name: 'Listo, empezar un pedido nuevo' }).click()
  await expect(page.getByRole('button', { name: /Ver pedido/ })).toHaveCount(0)
})

test('2. fiambre por cada 100 g con tarjeta', async ({ page }) => {
  await addProduct(page, 'Jamón cocido')
  await addProduct(page, 'Jamón cocido')
  await addProduct(page, 'Jamón cocido')
  await expect(card(page, 'Jamón cocido').getByRole('group')).toContainText('300 g')

  await page.getByRole('button', { name: /Ver pedido/ }).click()
  await expect(page.getByTestId('cart-line')).toContainText('Jamón cocido — 300 g')
  await expect(page.getByTestId('cart-total')).toHaveText('$ 267')
  await page.getByRole('button', { name: 'Continuar con el pedido' }).click()

  const { text } = await sendOrder(page, 'Ana Núñez', 'Rivera 1234', 'Tarjeta al recibir')
  expect(text).toContain('- 300 g de Jamón cocido')
  expect(text).not.toContain('3 x Jamón cocido')
  expect(text).toContain('Forma de pago: Tarjeta al recibir')
})

test('3. el carrito se mantiene al recargar', async ({ page }) => {
  await addProduct(page, 'Coca-Cola 1.5 L')
  await addProduct(page, 'Coca-Cola 1.5 L')
  await addProduct(page, 'Queso dambo')
  await addProduct(page, 'Yerba Canarias 1 kg')
  await page.reload()

  await expect(card(page, 'Coca-Cola 1.5 L').getByRole('group')).toContainText('2')
  await expect(card(page, 'Queso dambo').getByRole('group')).toContainText('100 g')
  await page.getByRole('button', { name: /Ver pedido/ }).click()
  await expect(page.getByTestId('cart-line')).toHaveCount(3)
  await expect(page.getByTestId('cart-total')).toHaveText('$ 678')
})

test('4. no deja enviar sin dirección', async ({ page }) => {
  await addProduct(page, 'Agua Salus 1.5 L')
  await page.getByRole('button', { name: /Ver pedido/ }).click()
  await page.getByRole('button', { name: 'Continuar con el pedido' }).click()
  await page.getByLabel('Nombre').fill('Juan Pérez')
  await page.locator('label', { hasText: 'Efectivo' }).click()

  let opened = false
  page.on('popup', () => (opened = true))
  await page.getByRole('button', { name: 'Pedir por WhatsApp' }).click()

  await expect(page.getByText('Agregá tu dirección para poder enviar el pedido.')).toBeVisible()
  await expect(page.getByLabel('Dirección')).toBeFocused()
  await expect(page.getByText('Datos de entrega')).toBeVisible()
  expect(opened).toBe(false)
})

test('5. búsqueda sin tildes ni mayúsculas', async ({ page }) => {
  const search = page.getByPlaceholder('¿Qué necesitás?')
  await search.fill('jamon')
  await expect(page.getByRole('article')).toHaveCount(1)
  await expect(card(page, 'Jamón cocido')).toBeVisible()

  await search.fill('coca')
  await expect(page.getByRole('article')).toHaveCount(1)
  await expect(card(page, 'Coca-Cola 1.5 L')).toBeVisible()

  await search.fill('xyz')
  await expect(page.getByText('No encontramos “xyz”')).toBeVisible()
})

test('6. categoría Fiambres muestra sólo fiambres', async ({ page }) => {
  await page.getByRole('button', { name: /Fiambres/ }).click()
  await expect(page.getByRole('article')).toHaveCount(2)
  await expect(card(page, 'Jamón cocido')).toBeVisible()
  await expect(card(page, 'Queso dambo')).toBeVisible()
  await expect(page.getByRole('button', { name: /Fiambres/ })).toHaveAttribute('aria-pressed', 'true')
})

test('7. mobile 390 × 844: 2 columnas, barra visible, sin overflow y checkout usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  expect(await gridColumns(page)).toBe(2)
  await expectNoHorizontalOverflow(page)

  await addProduct(page, 'Leche Conaprole entera 1 L')
  const bar = page.getByRole('button', { name: /Ver pedido/ })
  await expect(bar).toBeInViewport()
  await expectNoHorizontalOverflow(page)

  await bar.click()
  await page.getByRole('button', { name: 'Continuar con el pedido' }).click()
  const submit = page.getByRole('button', { name: 'Pedir por WhatsApp' })
  await submit.scrollIntoViewIfNeeded()
  await expect(submit).toBeInViewport()
  const box = await submit.boundingBox()
  expect(box!.height).toBeGreaterThanOrEqual(44)
  expect(box!.x + box!.width).toBeLessThanOrEqual(390)
  await expectNoHorizontalOverflow(page)

  const { text } = await sendOrder(page, 'Juan', 'Rivera 1234', 'Efectivo')
  expect(text).toContain('- 1 x Leche Conaprole entera 1 L')
})

test('8. desktop 1440 × 900: 4 columnas sin overflow', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  expect(await gridColumns(page)).toBe(4)
  await expectNoHorizontalOverflow(page)
  await addProduct(page, 'Papas chips 120 g')
  await expect(page.getByRole('button', { name: /Ver pedido/ })).toBeVisible()
  await expectNoHorizontalOverflow(page)
})

test('tablet 768: 3 columnas', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 })
  expect(await gridColumns(page)).toBe(3)
  await expectNoHorizontalOverflow(page)
})
