import { expect, type Page } from '@playwright/test'

export const PHONE = '59899000000'

/** Intercepta wa.me para no abrir WhatsApp de verdad durante los tests. */
export async function stubWhatsApp(page: Page) {
  await page.context().route('https://wa.me/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<p>WhatsApp (simulado)</p>' }),
  )
}

export function card(page: Page, name: string) {
  return page.getByRole('article', { name, exact: true })
}

export async function addProduct(page: Page, name: string) {
  const c = card(page, name)
  const addButton = c.getByRole('button', { name: `Agregar ${name}`, exact: true })
  if (await addButton.isVisible()) await addButton.click()
  else await c.getByRole('button', { name: `Agregar uno más de ${name}` }).click()
}

/** Completa el checkout, toca "Pedir por WhatsApp" y devuelve el texto del mensaje. */
export async function sendOrder(page: Page, name: string, address: string, payment: 'Efectivo' | 'Tarjeta al recibir') {
  await page.getByLabel('Nombre').fill(name)
  await page.getByLabel('Dirección').fill(address)
  await page.locator('label', { hasText: payment }).click()
  await expect(page.getByRole('radio', { name: payment })).toBeChecked()
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('button', { name: 'Pedir por WhatsApp' }).click(),
  ])
  const url = new URL(popup.url())
  expect(url.hostname).toBe('wa.me')
  expect(url.pathname).toBe(`/${PHONE}`)
  return { url: popup.url(), text: url.searchParams.get('text') ?? '' }
}

export async function expectNoHorizontalOverflow(page: Page) {
  // Con isMobile, un contenido demasiado ancho agranda el layout viewport:
  // por eso se compara contra el ancho real de la pantalla emulada.
  const { scrollWidth, innerWidth, viewport } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    viewport: window.visualViewport?.width ?? window.innerWidth,
  }))
  const expected = page.viewportSize()!.width
  expect(innerWidth).toBe(expected)
  expect(viewport).toBe(expected)
  expect(scrollWidth).toBeLessThanOrEqual(expected)
}

export async function gridColumns(page: Page) {
  return page.getByTestId('product-grid').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length)
}
