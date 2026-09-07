import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import './LayoutPublico.css'

/**
 * Estructura común de todas las páginas públicas.
 *
 * Envuelve el contenido con la barra de navegación (arriba) y el
 * pie de página (abajo), que se repiten en todo el sitio público.
 * Cada página solo aporta su contenido central mediante `children`.
 *
 * El área privada usa su propio layout (con sidebar), por eso este
 * layout es exclusivo de la cara pública.
 */
export default function LayoutPublico({ children }) {
  return (
    <div className="layout-publico">
      <Navbar />
      <main className="layout-publico__main">{children}</main>
      <Footer />
    </div>
  )
}
