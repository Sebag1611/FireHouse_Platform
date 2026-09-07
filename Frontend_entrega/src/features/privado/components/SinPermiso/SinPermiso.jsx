import { IconoCandado } from '../../../../components/ui/Icono'

/**
 * Mensaje de bloqueo que se muestra cuando el rol activo NO tiene
 * permiso para ver una sección del panel.
 *
 * @param {string} mensaje - Texto explicativo opcional.
 *
 * Se usa junto con <RutaProtegida>: si el rol no pasa la
 * verificación de permiso, se renderiza este aviso en lugar de
 * la vista. Así, al cambiar de rol en la demo, el cliente ve
 * claramente qué secciones quedan restringidas.
 */
export default function SinPermiso({ mensaje }) {
  return (
    <div className="sin-permiso">
      <IconoCandado width={40} />
      <h2>Acceso restringido</h2>
      <p>{mensaje || 'Tu rango no tiene permisos para ver esta sección.'}</p>
    </div>
  )
}
