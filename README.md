# Ghanina Minimercado

Tienda online mínima para pedir al minimercado desde el celular. El cliente elige productos, completa nombre, dirección y forma de pago, y el pedido se envía por WhatsApp con el mensaje ya escrito.

Sin backend, sin login, sin pagos online. Es un sitio estático (Vite + React + TypeScript) que se publica gratis en GitHub Pages. El carrito se guarda en el navegador del cliente (`localStorage`).

## Ejecutar localmente

Requiere Node 20 o superior.

```bash
npm install
npm run dev
```

Abrí la dirección que muestra la terminal (normalmente http://localhost:5173).

## Tests

```bash
npm run lint          # revisión de código
npm run test          # tests unitarios y de componentes (Vitest)
npx playwright test   # tests end-to-end en el navegador (Playwright)
```

La primera vez que uses Playwright en tu computadora puede pedirte instalar el navegador: `npx playwright install chromium`.

## Build

```bash
npm run build     # genera la carpeta dist/
npm run preview   # sirve dist/ para revisarlo
```

## Configurar WhatsApp

Abrí `src/config/store.ts` y reemplazá `598XXXXXXXX` por el número real del local:

- con código de país (598),
- sin `+`,
- sin espacios ni guiones.

Ejemplo: `59899123456`.

Mientras siga el valor `598XXXXXXXX`, la tienda no deja enviar pedidos y muestra un aviso.

Alternativa sin tocar código: en GitHub → Settings → Secrets and variables → Actions → Variables, creá una variable `WHATSAPP_NUMBER` con el número. El deploy la usa si existe.

En el mismo archivo podés cambiar el nombre del local y los minutos de entrega estimada.

## Cambiar productos y precios

Todo el catálogo está en `src/data/products.ts`. **Los precios actuales son de demostración.**

Cada producto tiene:

| Campo | Qué es |
| --- | --- |
| `id` | Identificador único, sin espacios (ej. `coca-cola-1-5l`) |
| `name` | Nombre que ve el cliente |
| `price` | Precio en pesos. Para fiambres, precio cada 100 g |
| `category` | `bebidas`, `almacen`, `snacks`, `fiambres` o `hogar` |
| `image` | Archivo dentro de `public/` (ej. `products/coca-cola-1-5l.svg`) |
| `saleType` | `unit` (por unidad) o `weight` (por peso) |
| `weightStep` | Sólo para peso: gramos por cada toque de + (normalmente `100`) |
| `featured` | `true` para que aparezca en "Más vendidos" (hasta 30) |
| `available` | `false` muestra "Sin stock" y no deja agregarlo |

## Cambiar fotografías

Las imágenes están en `public/products/`. Hoy son dibujos de ejemplo en SVG.

Para usar fotos reales:

1. Guardá la foto en `public/products/` (cuadrada, fondo blanco, idealmente `.webp` de unos 600 × 600 px).
2. En `src/data/products.ts`, cambiá el campo `image` del producto por el nuevo archivo, por ejemplo `products/coca-cola-1-5l.webp`.

Si reemplazás un archivo manteniendo el mismo nombre y extensión, no hace falta tocar código.

## Deploy en GitHub Pages

1. Subí el proyecto a un repositorio de GitHub (rama `main`).
2. En GitHub → **Settings → Pages**, en **Source** elegí **GitHub Actions**.
3. Cada push a `main` ejecuta lint, tests y build, y publica el sitio en `https://usuario.github.io/nombre-repositorio/`.

El workflow está en `.github/workflows/deploy.yml`. Los tests end-to-end corren en cada pull request (`.github/workflows/e2e.yml`).

## Estructura

```
src/
  config/store.ts       número de WhatsApp, nombre, minutos de entrega
  data/products.ts      catálogo, precios y categorías
  lib/whatsapp.ts       arma el mensaje y el enlace wa.me
  lib/cart.ts           lógica del carrito (agregar, quitar, totales, peso)
  lib/currency.ts       formato de precios ($ 1.245)
  lib/validation.ts     controles antes de enviar el pedido
  components/           piezas de la interfaz
  styles.css            estilos
tests/                  tests unitarios y de componentes
e2e/                    tests end-to-end
public/products/        imágenes de productos
```

## Privacidad

No hay cuentas, cookies de seguimiento ni analytics. El nombre y la dirección sólo viajan en el mensaje de WhatsApp que envía el propio cliente; no se guardan en ningún lado. El carrito queda guardado únicamente en el navegador del cliente.
