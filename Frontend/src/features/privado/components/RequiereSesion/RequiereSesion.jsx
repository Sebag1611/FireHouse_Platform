import { Navigate } from 'react-router-dom'
import { useSesion } from '../../context'
import { ROUTES } from '../../../../app/routes'

/**
 * Guardia de sesión del área privada.
 *
 * Si no hay una sesión iniciada (el usuario no pasó por el login),
 * redirige a la pantalla de Acceso. Así, el panel es accesible
 * solo tras autenticarse con un rango válido.
 */
export default function RequiereSesion({ children }) {
  const { autenticado } = useSesion()

  if (!autenticado) {
    return <Navigate to={ROUTES.ACCESO} replace />
  }

  return children
}
