import { useEffect, useState } from 'react'

/**
 * Estado de React guardado en localStorage. Si el navegador bloquea el acceso
 * (modo privado, cookies deshabilitadas) la app sigue funcionando sin guardar.
 */
export function useLocalStorage<T>(key: string, deserialize: (raw: string | null) => T) {
  const [value, setValue] = useState<T>(() => {
    try {
      return deserialize(window.localStorage.getItem(key))
    } catch {
      return deserialize(null)
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Sin almacenamiento disponible: el carrito vive sólo en esta pestaña.
    }
  }, [key, value])

  return [value, setValue] as const
}
