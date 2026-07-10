import { createContext, useContext, useState } from 'react'
import {
  getRango, getNivel, puede as puedeRango, nombreConNumero,
} from '../../../data/roles'

/* Contexto de sesión del área privada.
   Guarda el rango con el que se está viendo el panel y permite
   cambiarlo (selector de rol para la demostración al cliente).
   Los nombres reales de cada rango viven en data/roles.js, así
   que aquí solo los leemos desde el rango activo. */

const SesionContext = createContext(null)

export function SesionProvider({ children }) {
  // Al iniciar, toma el rango con el que se autenticó el usuario
  // (guardado por el login en localStorage). Si no hay ninguno
  // —por ejemplo, si se entra directo al panel en la demo—, usa
  // Capitán por defecto.
  const [rangoId, setRangoId] = useState(() => {
    if (typeof window === 'undefined') return 'capitan'
    return localStorage.getItem('firehouse-rango') || 'capitan'
  })

  const rango = getRango(rangoId)
  const nivel = getNivel(rangoId)

  const valor = {
    rangoId,
    setRangoId,
    rango,
    nivel,
    // Atajo para preguntar permisos desde cualquier vista.
    puede: (permiso) => puedeRango(rangoId, permiso),
    // Nombre de la persona del rango (ej. "Omar Cruz").
    usuario: rango.persona,
    // Nombre con su número identificador (ej. "302 · Omar Cruz").
    usuarioConNumero: nombreConNumero(rangoId),
  }

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>
}

// Hook para consumir la sesión
export function useSesion() {
  const ctx = useContext(SesionContext)
  if (!ctx) throw new Error('useSesion debe usarse dentro de <SesionProvider>')
  return ctx
}
