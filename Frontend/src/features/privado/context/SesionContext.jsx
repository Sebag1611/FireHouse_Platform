import { createContext, useContext, useState } from 'react'

const SesionContext = createContext(null)

export function SesionProvider({ children }) {
  // Solo guardamos en la memoria de React lo que Django nos envíe.
  const [usuarioActual, setUsuarioActual] = useState(null)

  const autenticado = Boolean(usuarioActual)

  const iniciarSesion = (datos) => {
    setUsuarioActual(datos)
  }

  const cerrarSesion = () => {
    setUsuarioActual(null)
  }

  const valor = {
    usuarioActual,
    autenticado,
    iniciarSesion,
    cerrarSesion,
    // Aquí React tomará los datos reales de tu BD de Django
    rango: usuarioActual?.rango || '',
    nivel: usuarioActual?.nivel || '',
    tipo: usuarioActual?.tipo_usuario || '',
    rut: usuarioActual?.rut || '',
    nombreCompleto: usuarioActual ? `${usuarioActual.nombre} ${usuarioActual.apellido}` : ''
  }

  return (
    <SesionContext.Provider value={valor}>
      {children}
    </SesionContext.Provider>
  )
}

export function useSesion() {
  const ctx = useContext(SesionContext)
  if (!ctx) throw new Error('useSesion debe usarse dentro de <SesionProvider>')
  return ctx
}