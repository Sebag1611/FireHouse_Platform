import { useSesion } from '../../context'
import SinPermiso from '../SinPermiso'

/**
 * Guardia de permisos para las vistas del panel.
 *
 * @param {string} permiso   - Permiso requerido para ver el contenido.
 * @param {string} mensaje   - Texto a mostrar si no tiene acceso.
 * @param {ReactNode} children - La vista a proteger.
 *
 * Consulta el rol actual (vía useSesion) y decide:
 *  - Si tiene el permiso  -> muestra la vista (children).
 *  - Si NO lo tiene        -> muestra el aviso <SinPermiso>.
 *
 * Centralizar aquí la verificación evita repetir el mismo "if de
 * permiso" en cada página, y hace que la lógica de acceso sea
 * consistente en todo el panel.
 */
export default function RutaProtegida({ permiso, mensaje, children }) {
  const { puede } = useSesion()

  if (!puede(permiso)) {
    return <SinPermiso mensaje={mensaje} />
  }

  return children
}
