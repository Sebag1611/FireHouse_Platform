import { SesionProvider } from './context'
import PanelLayout from './components/PanelLayout'

/**
 * Envoltura del área privada.
 *
 * Combina dos piezas:
 *  1. SesionProvider: pone a disposición el rol activo y sus
 *     permisos para todas las vistas internas (vía Context).
 *  2. PanelLayout: la estructura visual (sidebar + topbar).
 *
 * Todas las rutas del panel se envuelven con este layout, de modo
 * que comparten la misma sesión y el mismo marco visual.
 */
export default function LayoutPrivado({ children }) {
  return (
    <SesionProvider>
      <PanelLayout>{children}</PanelLayout>
    </SesionProvider>
  )
}
