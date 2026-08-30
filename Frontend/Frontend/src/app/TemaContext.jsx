import { createContext, useContext, useState, useEffect } from 'react'

/**
 * ============================================================
 *  TemaContext · Modo día / modo noche
 * ============================================================
 *  Maneja el tema visual de toda la aplicación (claro u oscuro).
 *
 *  Cómo funciona:
 *  - Guarda el tema actual ('oscuro' | 'claro') en el estado.
 *  - Refleja ese valor en el atributo data-theme del <html>.
 *    El CSS (variables.css) hace el resto: al ver data-theme,
 *    cambia los colores de fondo y texto automáticamente.
 *  - Recuerda la preferencia en localStorage para que el modo
 *    elegido se mantenga la próxima vez que se abra la web.
 *
 *  Al vivir en app/ (nivel raíz), tanto la cara pública como el
 *  panel privado comparten el mismo tema.
 * ============================================================
 */

const TemaContext = createContext(null)

// Clave con la que se guarda la preferencia en el navegador.
const CLAVE_TEMA = 'firehouse-tema'

export function TemaProvider({ children }) {
  // Estado inicial: lo guardado antes o, si no hay nada, 'oscuro'
  // (el modo noche es el diseño original de la plataforma).
  const [tema, setTema] = useState(() => {
    if (typeof window === 'undefined') return 'oscuro'
    return localStorage.getItem(CLAVE_TEMA) || 'oscuro'
  })

  // Cada vez que cambia el tema: lo aplicamos al <html> y lo
  // guardamos para recordarlo en futuras visitas.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema)
    localStorage.setItem(CLAVE_TEMA, tema)
  }, [tema])

  // Alterna entre los dos modos.
  const alternarTema = () =>
    setTema((actual) => (actual === 'oscuro' ? 'claro' : 'oscuro'))

  return (
    <TemaContext.Provider value={{ tema, alternarTema }}>
      {children}
    </TemaContext.Provider>
  )
}

// Hook para consumir el tema desde cualquier componente.
export function useTema() {
  const ctx = useContext(TemaContext)
  if (!ctx) throw new Error('useTema debe usarse dentro de <TemaProvider>')
  return ctx
}
