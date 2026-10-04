import { useRef, useState } from 'react'
import { CartBar } from './components/CartBar'
import { CartDrawer } from './components/CartDrawer'
import { CategoryFilter } from './components/CategoryFilter'
import { CheckoutModal } from './components/CheckoutModal'
import { DeliveryBanner } from './components/DeliveryBanner'
import { Header } from './components/Header'
import { ProductGrid } from './components/ProductGrid'
import { SearchBar } from './components/SearchBar'
import { CATEGORIES, PRODUCTS, type CategoryFilterId } from './data/products'
import { useCart } from './hooks/useCart'
import { filterProducts } from './lib/search'

type Panel = 'cart' | 'checkout' | null

export default function App() {
  const cart = useCart()
  const [category, setCategory] = useState<CategoryFilterId>('featured')
  const [query, setQuery] = useState('')
  const [panel, setPanel] = useState<Panel>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const searching = query.trim().length > 0
  const visible = filterProducts(PRODUCTS, category, query)
  const categoryLabel = CATEGORIES.find((c) => c.id === category)?.label

  function selectCategory(id: CategoryFilterId) {
    setCategory(id)
    setQuery('')
  }

  function focusSearch() {
    searchRef.current?.focus()
    searchRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }

  function finishOrder() {
    cart.clear()
    setPanel(null)
  }

  return (
    <>
      <Header cartCount={cart.count} onSearchClick={focusSearch} onCartClick={() => setPanel('cart')} />

      <main id="top" className={`main${cart.count > 0 ? ' main--with-bar' : ''}`}>
        <DeliveryBanner />

        <div className="toolbar">
          <SearchBar value={query} onChange={setQuery} inputRef={searchRef} />
          <CategoryFilter selected={searching ? null : category} onSelect={selectCategory} />
        </div>

        <section className="catalog" aria-labelledby="catalog-title">
          <h2 id="catalog-title" className="catalog__title" aria-live="polite">
            {searching ? `Resultados para “${query.trim()}”` : categoryLabel}
          </h2>
          {visible.length > 0 ? (
            <ProductGrid
              products={visible}
              quantityOf={cart.quantityOf}
              onAdd={cart.add}
              onDecrement={cart.decrement}
            />
          ) : (
            <div className="empty">
              <p className="empty__title">No encontramos “{query.trim()}”</p>
              <p className="empty__text">Probá con otra palabra o mirá los más vendidos.</p>
              <button type="button" className="btn btn--ghost" onClick={() => selectCategory('featured')}>
                Ver más vendidos
              </button>
            </div>
          )}
        </section>

        <footer className="footer">
          <p>Los precios son de referencia y se confirman por WhatsApp al hacer el pedido.</p>
        </footer>
      </main>

      <CartBar count={cart.count} total={cart.total} onOpen={() => setPanel('cart')} />

      {panel === 'cart' && (
        <CartDrawer
          lines={cart.lines}
          total={cart.total}
          onAdd={cart.add}
          onDecrement={cart.decrement}
          onRemove={cart.remove}
          onClear={cart.clear}
          onCheckout={() => setPanel('checkout')}
          onClose={() => setPanel(null)}
        />
      )}
      {panel === 'checkout' && (
        <CheckoutModal
          lines={cart.lines}
          total={cart.total}
          onBack={() => setPanel('cart')}
          onClose={() => setPanel(null)}
          onFinish={finishOrder}
        />
      )}
    </>
  )
}
