import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconoArchivo, IconoCheck } from '../components/Iconos'
import '../styles/formularios.css'
import './Postular.css'

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const FORMATOS = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
const MAX_MB = 5

// Los tres documentos obligatorios para postular (criterio HU-04)
const DOCUMENTOS = [
  {
    clave: 'cedula',
    titulo: 'Cédula de Identidad',
    ayuda: 'Ambos lados, en un solo archivo PDF o imagen.',
  },
  {
    clave: 'antecedentes',
    titulo: 'Certificado de Antecedentes',
    ayuda: 'Documento vigente emitido por el Registro Civil.',
  },
  {
    clave: 'salud',
    titulo: 'Examen de Salud',
    ayuda: 'Certificado médico que acredite aptitud física.',
  },
]

const vacio = {
  nombre: '',
  rut: '',
  email: '',
  telefono: '',
  motivacion: '',
}

// Genera un código de postulación único (HU-04)
function generarCodigo() {
  const t = Date.now().toString(36).toUpperCase().slice(-4)
  const r = Math.random().toString(36).toUpperCase().slice(2, 5)
  return `POST-2026-${t}${r}`
}

export default function Postular() {
  const [datos, setDatos] = useState(vacio)
  const [archivos, setArchivos] = useState({}) // { cedula: File, antecedentes: File, salud: File }
  const [errores, setErrores] = useState({})
  const [codigo, setCodigo] = useState(null) // controla el modal de éxito
  const inputs = useRef({})
  const navigate = useNavigate()

  const cambiar = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value })
    setErrores({ ...errores, [e.target.name]: undefined })
  }

  const elegirArchivo = (clave, e) => {
    const f = e.target.files[0]
    if (!f) return
    if (!FORMATOS.includes(f.type)) {
      setErrores({ ...errores, [clave]: 'Solo se permite PDF, JPG o PNG.' })
      return
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setErrores({ ...errores, [clave]: `El archivo supera los ${MAX_MB} MB.` })
      return
    }
    setErrores({ ...errores, [clave]: undefined })
    setArchivos({ ...archivos, [clave]: f })
  }

  const validar = () => {
    const err = {}
    if (!datos.nombre.trim()) err.nombre = 'Ingresa tu nombre completo.'
    if (!datos.rut.trim()) err.rut = 'Ingresa tu RUT.'
    if (!datos.email.trim()) err.email = 'Ingresa tu correo.'
    else if (!REGEX_EMAIL.test(datos.email))
      err.email = 'El formato del correo no es válido.'
    if (!datos.telefono.trim()) err.telefono = 'Ingresa un teléfono de contacto.'
    if (!datos.motivacion.trim())
      err.motivacion = 'Cuéntanos por qué quieres postular.'
    // Cada documento es obligatorio
    DOCUMENTOS.forEach((d) => {
      if (!archivos[d.clave]) err[d.clave] = 'Este documento es obligatorio.'
    })
    return err
  }

  const enviar = (e) => {
    e.preventDefault()
    const err = validar()
    setErrores(err)
    if (Object.keys(err).length > 0) {
      // Lleva la vista al primer error
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    // En producción: POST con FormData (datos + 3 archivos) a la API.
    setCodigo(generarCodigo())
  }

  const nuevaPostulacion = () => {
    setDatos(vacio)
    setArchivos({})
    setErrores({})
    setCodigo(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <header className="page-head">
        <div className="contenedor">
          <span className="eyebrow">Únete a la compañía</span>
          <h1>Postulación de voluntarios</h1>
          <p>
            Da el primer paso para servir a la comunidad de Calama. Envía tu
            solicitud y documentos de forma 100% digital.
          </p>
        </div>
      </header>

      <section className="seccion">
        <div className="contenedor form-wrap">
          <div className="form-info">
            <h2>Antes de postular</h2>
            <p>
              Ten a mano los tres documentos requeridos en formato PDF, JPG o
              PNG (máximo {MAX_MB} MB cada uno). Al finalizar recibirás la
              confirmación de tu postulación.
            </p>
            <div className="form-info__lista">
              {[
                ['Ser mayor de 18 años', 'Requisito para el voluntariado.'],
                ['Residir en Calama', 'Disponibilidad para acudir al cuartel.'],
                ['Vocación de servicio', 'Compromiso, disciplina y trabajo en equipo.'],
              ].map(([t, s]) => (
                <div className="form-info__item" key={t}>
                  <IconoCheck width={22} />
                  <div>
                    <strong>{t}</strong>
                    <span>{s}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form className="formulario" onSubmit={enviar} noValidate>
            <h3 className="form-bloque-titulo">Datos personales</h3>

            <div className="campo">
              <label htmlFor="nombre">
                Nombre completo <span className="req">*</span>
              </label>
              <input
                id="nombre"
                name="nombre"
                value={datos.nombre}
                onChange={cambiar}
                placeholder="Nombre y apellidos"
                className={errores.nombre ? 'invalido' : ''}
              />
              {errores.nombre && (
                <span className="campo__error">{errores.nombre}</span>
              )}
            </div>

            <div className="campo campo--fila">
              <div>
                <label htmlFor="rut">
                  RUT <span className="req">*</span>
                </label>
                <input
                  id="rut"
                  name="rut"
                  value={datos.rut}
                  onChange={cambiar}
                  placeholder="12.345.678-9"
                  className={errores.rut ? 'invalido' : ''}
                />
                {errores.rut && (
                  <span className="campo__error">{errores.rut}</span>
                )}
              </div>
              <div>
                <label htmlFor="telefono">
                  Teléfono <span className="req">*</span>
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  value={datos.telefono}
                  onChange={cambiar}
                  placeholder="+56 9 ..."
                  className={errores.telefono ? 'invalido' : ''}
                />
                {errores.telefono && (
                  <span className="campo__error">{errores.telefono}</span>
                )}
              </div>
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
              <label htmlFor="motivacion">
                Motivación <span className="req">*</span>
              </label>
              <textarea
                id="motivacion"
                name="motivacion"
                value={datos.motivacion}
                onChange={cambiar}
                placeholder="¿Por qué quieres ser voluntario de la 3ra Compañía?"
                className={errores.motivacion ? 'invalido' : ''}
              />
              {errores.motivacion && (
                <span className="campo__error">{errores.motivacion}</span>
              )}
            </div>

            <h3 className="form-bloque-titulo">Documentos requeridos</h3>

            {DOCUMENTOS.map((d) => (
              <div className="campo" key={d.clave}>
                <label>
                  {d.titulo} <span className="req">*</span>
                </label>
                <div
                  className={`dropzone ${archivos[d.clave] ? 'dropzone--ok' : ''} ${
                    errores[d.clave] ? 'dropzone--error' : ''
                  }`}
                  onClick={() => inputs.current[d.clave]?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && inputs.current[d.clave]?.click()
                  }
                >
                  <IconoArchivo width={26} />
                  <p className="dropzone__titulo">
                    {archivos[d.clave]
                      ? 'Cambiar archivo'
                      : 'Haz clic para adjuntar'}
                  </p>
                  <span className="dropzone__ayuda">{d.ayuda}</span>
                  <input
                    ref={(el) => (inputs.current[d.clave] = el)}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => elegirArchivo(d.clave, e)}
                  />
                  {archivos[d.clave] && (
                    <span className="dropzone__archivo">
                      <IconoCheck width={15} /> {archivos[d.clave].name}
                    </span>
                  )}
                </div>
                {errores[d.clave] && (
                  <span className="campo__error">{errores[d.clave]}</span>
                )}
              </div>
            ))}

            <button
              type="submit"
              className="btn btn-primario"
              style={{ width: '100%', marginTop: 8 }}
            >
              Enviar postulación
            </button>
          </form>
        </div>
      </section>

      {/* ---------- MODAL DE CONFIRMACIÓN ---------- */}
      {codigo && (
        <div className="modal-fondo" role="dialog" aria-modal="true">
          <div className="modal">
            <span className="modal__icono">
              <IconoCheck width={32} />
            </span>
            <h2 className="modal__titulo">Postulación enviada</h2>
            <p className="modal__texto">
              Gracias por su postulación. Nos pondremos en contacto con usted por
              medio de WhatsApp una vez sus documentos sean revisados y aprobados.
            </p>
            <div className="modal__codigo">
              <span>Código de postulación</span>
              <strong>{codigo}</strong>
            </div>
            <div className="modal__acciones">
              <button className="btn btn-fantasma" onClick={() => navigate('/')}>
                Volver al inicio
              </button>
              <button className="btn btn-primario" onClick={nuevaPostulacion}>
                Realizar nueva postulación
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
