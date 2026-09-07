import { useSesion } from '../../context/SesionContext'
import SinPermiso from '../SinPermiso/SinPermiso'

export default function RutaProtegida({ rolesPermitidos, mensaje, children }) {
  const { autenticado, rango, tipo } = useSesion()

  if (!autenticado) {
    return <SinPermiso mensaje="Debes iniciar sesión para acceder a esta área." />
  }

  if (rolesPermitidos && rolesPermitidos.length > 0) {
    const rangoActual = rango ? rango.toLowerCase() : '';
    const tipoActual = tipo ? tipo.toLowerCase() : '';

    const tienePermiso = rolesPermitidos.includes(rangoActual) || rolesPermitidos.includes(tipoActual);

    if (!tienePermiso) {
      return <SinPermiso mensaje={mensaje || "No tienes los privilegios necesarios para ver esto."} />
    }
  }

  return children
}