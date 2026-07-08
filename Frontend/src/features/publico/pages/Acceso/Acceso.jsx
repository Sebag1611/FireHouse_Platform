import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../../../components/ui/Logo'
import { IconoEscudo } from '../../../../components/ui/Icono'
import './Acceso.css'

export default function Acceso() {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [aviso, setAviso] = useState('')
  const navigate = useNavigate()

  const entrar = (e) => {
    e.preventDefault()
    if (!usuario.trim() || !clave.trim()) {
      setAviso('Ingresa tu usuario y contraseña.')
      return
    }
    // Carcasa de demostración: cualquier credencial entra al panel.
    // En producción, la autenticación y los roles se validan en el
    // backend (JWT) antes de dar acceso al área privada.
    navigate('/panel')
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

          <button type="submit" className="btn btn-primario" style={{ width: '100%' }}>
            Iniciar sesión
          </button>
        </form>

        <p className="acceso__roles">
          Demostración: ingresa cualquier usuario y contraseña para entrar al panel.
        </p>
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
