import { useState } from 'react'
import { IconoCorreo, IconoUbicacion, IconoReloj } from '../../../../components/ui/Icono'
import '../../../../assets/styles/formularios.css'

// Regex estándar de validación de correo (criterio de aceptación HU-03)
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const vacio = { nombre: '', email: '', asunto: '', mensaje: '' }

export default function Contacto() {
  const [datos, setDatos] = useState(vacio)
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(null) // null | 'exito' | 'error'

  const cambiar = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value })
    setErrores({ ...errores, [e.target.name]: undefined })
  }

  const validar = () => {
    const err = {}
    if (!datos.nombre.trim()) err.nombre = 'Ingresa tu nombre completo.'
    if (!datos.email.trim()) err.email = 'Ingresa tu correo electrónico.'
    else if (!REGEX_EMAIL.test(datos.email))
      err.email = 'El formato del correo no es válido.'
    if (!datos.asunto.trim()) err.asunto = 'Indica el asunto del mensaje.'
    if (!datos.mensaje.trim()) err.mensaje = 'Escribe tu mensaje.'
    return err
  }

  const enviar = (e) => {
    e.preventDefault()
    const err = validar()
    setErrores(err)
    if (Object.keys(err).length > 0) {
      setEnviado('error')
      return
    }
    // En producción: POST a la API → guarda el registro en base de datos.
    setEnviado('exito')
    setDatos(vacio)
  }

  return (
    <>
      <header className="page-head">
        <div className="contenedor">
          <span className="eyebrow">Estamos para ayudarte</span>
          <h1>Contacto</h1>
          <p>
            Realiza consultas o solicitudes administrativas. Tu mensaje será
            revisado por la secretaría de la compañía.
          </p>
        </div>
      </header>

      <section className="seccion">
        <div className="contenedor form-wrap">
          <div className="form-info">
            <h2>Escríbenos</h2>
            <p>
              Completa el formulario y nos pondremos en contacto contigo. Para
              emergencias, llama directamente al número de emergencias.
            </p>
            <div className="form-info__lista">
              <div className="form-info__item">
                <IconoUbicacion width={22} />
                <div>
                  <strong>Ubicación</strong>
                  <span>Calama, Región de Antofagasta, Chile</span>
                </div>
              </div>
              <div className="form-info__item">
                <IconoCorreo width={22} />
                <div>
                  <strong>Correo</strong>
                  <span>contacto@bomberos3calama.cl</span>
                </div>
              </div>
              <div className="form-info__item">
                <IconoReloj width={22} />
                <div>
                  <strong>Emergencias</strong>
                  <span>132 · disponible 24/7</span>
                </div>
              </div>
            </div>
          </div>

          <form className="formulario" onSubmit={enviar} noValidate>
            {enviado === 'exito' && (
              <div className="form-mensaje form-mensaje--exito">
                <strong>Mensaje enviado.</strong> Gracias por escribirnos, te
                responderemos a la brevedad.
              </div>
            )}
            {enviado === 'error' && (
              <div className="form-mensaje form-mensaje--error">
                <strong>Revisa los campos.</strong> Hay información pendiente o
                con formato incorrecto.
              </div>
            )}

            <div className="campo">
              <label htmlFor="nombre">
                Nombre completo <span className="req">*</span>
              </label>
              <input
                id="nombre"
                name="nombre"
                value={datos.nombre}
                onChange={cambiar}
                placeholder="Ej: María González"
                className={errores.nombre ? 'invalido' : ''}
              />
              {errores.nombre && (
                <span className="campo__error">{errores.nombre}</span>
              )}
            </div>

            <div className="campo">
              <label htmlFor="email">
                Correo electrónico <span className="req">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={datos.email}
                onChange={cambiar}
                placeholder="tucorreo@ejemplo.cl"
                className={errores.email ? 'invalido' : ''}
              />
              {errores.email && (
                <span className="campo__error">{errores.email}</span>
              )}
            </div>

            <div className="campo">
              <label htmlFor="asunto">
                Asunto <span className="req">*</span>
              </label>
              <input
                id="asunto"
                name="asunto"
                value={datos.asunto}
                onChange={cambiar}
                placeholder="Motivo de tu consulta"
                className={errores.asunto ? 'invalido' : ''}
              />
              {errores.asunto && (
                <span className="campo__error">{errores.asunto}</span>
              )}
            </div>

            <div className="campo">
              <label htmlFor="mensaje">
                Mensaje <span className="req">*</span>
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={datos.mensaje}
                onChange={cambiar}
                placeholder="Cuéntanos en qué podemos ayudarte"
                className={errores.mensaje ? 'invalido' : ''}
              />
              {errores.mensaje && (
                <span className="campo__error">{errores.mensaje}</span>
              )}
            </div>

            <button type="submit" className="btn btn-primario" style={{ width: '100%' }}>
              Enviar mensaje
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
