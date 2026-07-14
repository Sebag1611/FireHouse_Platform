import { SesionProvider } from './context'
import PanelLayout from './components/PanelLayout'
import RequiereSesion from './components/RequiereSesion'

/**
 * Envoltura del área privada.
 *
 * Combina tres piezas:
 *  1. SesionProvider: pone a disposición el rol activo y sus
 *     permisos para todas las vistas internas (vía Context).
 *  2. RequiereSesion: exige haber iniciado sesión; si no, manda
 *     al login. Así el panel no es accesible sin autenticarse.
 *  3. PanelLayout: la estructura visual (sidebar + topbar).
 *
 * Todas las rutas del panel se envuelven con este layout.
 */
export default function LayoutPrivado({ children }) {
  return (
    <SesionProvider>
      <RequiereSesion>
        <PanelLayout>{children}</PanelLayout>
      </RequiereSesion>
    </SesionProvider>
  )
}
