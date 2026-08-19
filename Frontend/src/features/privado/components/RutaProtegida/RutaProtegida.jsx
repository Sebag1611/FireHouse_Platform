import { useSesion } from '../../context/SesionContext' // Ajusta la ruta si es necesario
import SinPermiso from '../SinPermiso'

/**
 * Guardia de permisos conectado a la Base de Datos (Django).
 *
 * @param {Array} rolesPermitidos - Lista de rangos que pueden entrar (ej. ['capitán', 'director']).
 * @param {string} mensaje        - Texto a mostrar si no tiene acceso.
 * @param {ReactNode} children    - La vista a proteger.
 */
export default function RutaProtegida({ rolesPermitidos, mensaje, children }) {
  // Extraemos los datos reales que llegaron del backend
  const { autenticado, rango, tipo } = useSesion()

  // 1. Si no hay sesión iniciada, ni siquiera debería intentar entrar
  if (!autenticado) {
    return <SinPermiso mensaje="Debes iniciar sesión para acceder a esta área." />
  }

  // 2. Si la página requiere roles específicos, validamos contra la BD
  if (rolesPermitidos && rolesPermitidos.length > 0) {
    // Pasamos el rango a minúsculas para evitar problemas (ej. "Capitán" vs "capitán")
    const rangoActual = rango ? rango.toLowerCase() : '';
    const tipoActual = tipo ? tipo.toLowerCase() : '';

    // Verificamos si el rango o tipo del usuario está en la lista de permitidos
    const tienePermiso = rolesPermitidos.includes(rangoActual) || rolesPermitidos.includes(tipoActual);

    if (!tienePermiso) {
      // Si el backend dice que es Teniente, pero la lista solo dice ['director'], se le bloquea
      return <SinPermiso mensaje={mensaje || "No tienes los privilegios necesarios."} />
    }
  }

  // 3. Si pasa las validaciones, renderiza la vista solicitada
  return children
}