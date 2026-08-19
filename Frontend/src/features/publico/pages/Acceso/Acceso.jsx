import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../../../components/ui/Logo'
import { IconoEscudo } from '../../../../components/ui/Icono'
// 1. Importamos el hook de nuestro nuevo Contexto real
import { useSesion } from '../../../privado/context/SesionContext'
import './Acceso.css'
const apiUrl = import.meta.env.VITE_API_URL;

export default function Acceso() {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [aviso, setAviso] = useState('')
  const navigate = useNavigate()
  
  // 2. Extraemos la función iniciarSesion del contexto
  const { iniciarSesion } = useSesion()

  const limpiarRut = (valor) => {
    let limpio = valor.replace(/[^0-9kK]/g, '')
    limpio = limpio.replace(/[kK]/g, (match, offset) =>
      offset === limpio.length - 1 ? 'K' : ''
    )
    return limpio.toUpperCase()
  }

  const formatearConGuion = (rutLimpio) => {
    if (rutLimpio.length < 2) return rutLimpio
    return `${rutLimpio.slice(0, -1)}-${rutLimpio.slice(-1)}`
  }

  const cambiarRut = (e) => {
    setUsuario(limpiarRut(e.target.value))
    setAviso('')
  }

  const salirRut = () => {
    setUsuario((actual) => formatearConGuion(limpiarRut(actual)))
  }

  const entrar = async (e) => {
    e.preventDefault()
    
    const rut = formatearConGuion(limpiarRut(usuario))
    
    if (!rut.trim() || !clave.trim()) {
      setAviso('Ingresa tu RUT y contraseña.')
      return
    }

    try {
      const respuesta = await fetch(`${apiUrl}/api/Administracion/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rut: rut,
          contraseña: clave 
        })
      })

      const data = await respuesta.json()

      if (!respuesta.ok) {
        setAviso(data.error || 'Error al iniciar sesión.')
        return
      }

      // Guardamos la info de Django en la memoria de React
      iniciarSesion(data)
      
      // ¡SOLUCIÓN DEL 404! 
      // Todos van al panel principal. Tu componente RutaProtegida se encargará 
      // de bloquearles las pantallas internas que no deban ver.
      setTimeout(() => {
        navigate('/panel')
      }, 50)
    } catch (error) {
      console.error(error)
      setAviso('No se pudo conectar con el servidor.')
    }
  }

  return (
    <section className="acceso">
      <div className="acceso__panel">
        <Link to="/" className="acceso__logo">
          <Logo />
        </Link>

        <div className="acceso__head">
          <span className="acceso__candado">
            <IconoEscudo width={24} />
          </span>
          <h1>Acceso interno</h1>
          <p>
            Área privada para personal de la compañía. Inicia sesión con tus
            credenciales institucionales.
          </p>
        </div>

        {aviso && <div className="acceso__aviso">{aviso}</div>}

        <form onSubmit={entrar} className="acceso__form" noValidate>
          <div className="campo">
            <label htmlFor="usuario">RUT</label>
            <input
              id="usuario"
              value={usuario}
              onChange={cambiarRut}
              onBlur={salirRut}
              placeholder="12345678-9 (sin puntos)"
              inputMode="text"
              maxLength={10}
              autoComplete="username"
            />
          </div>
          <div className="campo">
            <label htmlFor="clave">Contraseña</label>
            <input
              id="clave"
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <Link to="#" className="acceso__recuperar">
            ¿Olvidaste tu contraseña?
          </Link>

          <button type="submit" className="btn btn-primario" style={{ width: '100%' }}>
            Iniciar sesión
          </button>
        </form>

        <Link to="/" className="acceso__volver">
          ← Volver al sitio público
        </Link>
      </div>

      <aside className="acceso__lateral" aria-hidden="true">
        <div className="acceso__lateral-contenido">
          <span className="acceso__lema">«Unión es Fuerza»</span>
          <p>
            La gestión interna, los turnos y la pizarra de material mayor en
            tiempo real son parte del área privada de la plataforma.
          </p>
        </div>
      </aside>
    </section>
  )
}