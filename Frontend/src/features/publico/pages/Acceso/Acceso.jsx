import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../../../components/ui/Logo'
import { IconoEscudo } from '../../../../components/ui/Icono'
import './Acceso.css'

const API_URL = import.meta.env.VITE_API_URL

export default function Acceso() {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [aviso, setAviso] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  const entrar = async (e) => {
    e.preventDefault()
    setAviso('')

    if (!usuario.trim() || !clave.trim()) {
      setAviso('Ingresa tu usuario y contraseña.')
      return
    }

    setCargando(true)

    try {
      const respuesta = await fetch(`${API_URL}/api/Administracion/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rut: usuario,
          'contraseña': clave,
        }),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        // El backend devuelve {"error": "..."} en los distintos casos
        setAviso(datos.error || 'No se pudo iniciar sesión.')
        return
      }

      // Login exitoso: guardamos los datos del usuario
      localStorage.setItem('usuario', JSON.stringify(datos))

      navigate('/panel')
    } catch (error) {
      setAviso('Error de conexión con el servidor. Intenta nuevamente.')
    } finally {
      setCargando(false)
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
            <label htmlFor="usuario">RUT o usuario</label>
            <input
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="12.345.678-9"
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

          <button
            type="submit"
            className="btn btn-primario"
            style={{ width: '100%' }}
            disabled={cargando}
          >
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
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