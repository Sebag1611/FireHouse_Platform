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

  /**
   * Limpia lo que el usuario escribe en el campo RUT, permitiendo
   * SOLO dígitos (0-9) y la letra K como dígito verificador final.
   * NO inserta el guion aquí: mientras se escribe, el guion saltaría
   * de posición y molestaría. El guion se agrega al enviar (ver
   * formatearConGuion), que es cuando el dato viaja a la BD.
   */
  const limpiarRut = (valor) => {
    // Deja solo dígitos y la letra k/K.
    let limpio = valor.replace(/[^0-9kK]/g, '')
    // La 'k' solo vale como último carácter; si va en medio, se quita.
    limpio = limpio.replace(/[kK]/g, (match, offset) =>
      offset === limpio.length - 1 ? 'K' : ''
    )
    return limpio.toUpperCase()
  }

  /**
   * Formatea el RUT al formato de la base de datos: cuerpo + guion +
   * dígito verificador (ej. "12345678-9"). Se usa al enviar.
   */
  const formatearConGuion = (rutLimpio) => {
    if (rutLimpio.length < 2) return rutLimpio
    return `${rutLimpio.slice(0, -1)}-${rutLimpio.slice(-1)}`
  }

  const cambiarRut = (e) => {
    // Mientras escribe: solo limpia (números + K), sin guion, para
    // que el tecleo sea natural y el guion no salte de posición.
    setUsuario(limpiarRut(e.target.value))
    setAviso('')
  }

  const salirRut = () => {
    // Al salir del campo (onBlur): agrega el guion antes del dígito
    // verificador, dejándolo en el formato de la BD (12345678-9).
    setUsuario((actual) => formatearConGuion(limpiarRut(actual)))
  }

  const entrar = (e) => {
    e.preventDefault()
    // Nos aseguramos de tener el RUT con guion aunque no se haya
    // disparado el onBlur (ej. si envían con Enter directo).
    const rut = formatearConGuion(limpiarRut(usuario))
    if (!rut.trim() || !clave.trim()) {
      setAviso('Ingresa tu RUT y contraseña.')
      return
    }
    // Al menos 8 caracteres con el guion incluido (ej. 1234567-8).
    if (rut.length < 8) {
      setAviso('Ingresa un RUT válido (ej. 12345678-9).')
      return
    }
    // "rut" ya viaja en el formato que espera la base de datos.
    // Carcasa de demostración: cualquier credencial válida entra.
    // En producción, este RUT se envía al backend (JWT) para
    // autenticar y resolver el rol antes de dar acceso al panel.
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
