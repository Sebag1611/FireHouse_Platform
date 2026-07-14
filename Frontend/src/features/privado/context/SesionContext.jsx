import { createContext, useContext, useState } from 'react'
import {
  getRango, getNivel, puede as puedeRango, nombreConNumero,
} from '../../../data/roles'

/* ============================================================
   Contexto de sesión del área privada.
   ------------------------------------------------------------
   Guarda el rango del usuario autenticado. El rango lo escribe
   el login en localStorage al validar las credenciales; aquí lo
   leemos al iniciar. Si no hay sesión, rangoId es null y la
   guardia de acceso (RequiereSesion) redirige al login.
   ============================================================ */

const SesionContext = createContext(null)

// Clave donde el login guarda el rango del usuario autenticado.
const CLAVE_RANGO = 'firehouse-rango'

export function SesionProvider({ children }) {
  // Lee el rango guardado por el login. Si no hay, queda null
  // (sesión no iniciada).
  const [rangoId, setRangoId] = useState(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(CLAVE_RANGO) || null
  })

  // ¿Hay una sesión válida iniciada?
  const autenticado = Boolean(rangoId)

  // Cierra la sesión (borra el rango guardado).
  const cerrarSesion = () => {
    localStorage.removeItem(CLAVE_RANGO)
    setRangoId(null)
  }

  // Datos derivados del rango (solo si hay sesión).
  const rango = autenticado ? getRango(rangoId) : null
  const nivel = autenticado ? getNivel(rangoId) : null

  const valor = {
    rangoId,
    setRangoId,
    autenticado,
    cerrarSesion,
    rango,
    nivel,
    // Atajo para preguntar permisos desde cualquier vista.
    puede: (permiso) => (autenticado ? puedeRango(rangoId, permiso) : false),
    // Nombre de la persona del rango (ej. "Omar Cruz").
    usuario: rango ? rango.persona : '',
    // Nombre con su número identificador (ej. "302 · Omar Cruz").
    usuarioConNumero: autenticado ? nombreConNumero(rangoId) : '',
  }

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>
}

// Hook para consumir la sesión
export function useSesion() {
  const ctx = useContext(SesionContext)
  if (!ctx) throw new Error('useSesion debe usarse dentro de <SesionProvider>')
  return ctx
}
