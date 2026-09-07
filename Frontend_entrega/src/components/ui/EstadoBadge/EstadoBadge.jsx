import { ESTADOS_OPERATIVOS } from '../../../data/contenidoPublico'
import './EstadoBadge.css'

/**
 * Indicador visual del estado operativo de una unidad (HU-13).
 *
 * @param {string} estado - Clave del estado: 'disponible' |
 *   'emergencia' | 'servicio' | 'taller'.
 *
 * Recibe la clave, busca su etiqueta y color en el catálogo de
 * estados, y pinta un "badge" con un punto que late. Al estar
 * como componente aparte se reutiliza igual en la vista pública
 * y en el panel interno, sin duplicar el markup.
 */
export default function EstadoBadge({ estado }) {
  // Si llega un estado desconocido, cae en 'taller' por seguridad.
  const info = ESTADOS_OPERATIVOS[estado] ?? ESTADOS_OPERATIVOS.taller

  return (
    <span className="estado-badge" style={{ '--c': info.color }}>
      <span className="estado-badge__punto" />
      {info.etiqueta}
    </span>
  )
}
