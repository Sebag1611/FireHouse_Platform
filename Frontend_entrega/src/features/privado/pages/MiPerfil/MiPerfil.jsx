import { useState } from 'react'
import { useSesion } from '../../context/SesionContext'
import { regimenesLaborales } from '../../../../data/personal'
import { formatearTelefono } from '../../../../data/formatoChileno'
import { correoValido, edadValida } from '../../../../data/validaciones'
import {
  IconoPersona, IconoCorreo, IconoUbicacion, IconoReloj, IconoCheck,
} from '../../../../components/ui/Icono'
import '../../estilos-panel.css'
import './MiPerfil.css'

/**
 * Mi Perfil — el usuario edita SUS PROPIOS datos personales.
 *
 * Campos editables: nombre, edad, turno (régimen laboral), correo,
 * dirección, teléfono y tallas de ropa (polera, pantalón, calzado).
 *
 * Los datos se inicializan con lo que venga de la sesión (login) y,
 * donde no haya, con valores vacíos para que la persona los complete.
 *
 * Maqueta: al guardar, los cambios quedan en memoria y se muestra una
 * confirmación. Con backend, aquí se haría un PUT/PATCH del perfil.
 */

// Tallas disponibles para los selectores de ropa.
const TALLAS_ROPA = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
// Tallas de calzado (rango típico chileno).
const TALLAS_CALZADO = ['37', '38', '39', '40', '41', '42', '43', '44', '45', '46']

export default function MiPerfil() {
  const { nombreCompleto, correo, rut } = useSesion()

  // Estado del formulario. Se rellena con lo que haya en la sesión.
  const [form, setForm] = useState({
    nombre: nombreCompleto || '',
    edad: '',
    turno: '5x2',
    correo: correo || '',
    direccion: '',
    telefono: '',
    tallaPolera: 'M',
    tallaPantalon: 'M',
    tallaCalzado: '42',
  })
  const [guardado, setGuardado] = useState(false)
  const [error, setError] = useState('')

  const cambiar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }))
    setGuardado(false)
    setError('')
  }

  const guardar = (e) => {
    e.preventDefault()
    // Validaciones: correo y edad, si se ingresaron.
    if (form.correo && !correoValido(form.correo)) {
      setError('El correo no tiene un formato válido.')
      return
    }
    if (form.edad && !edadValida(form.edad)) {
      setError('La edad debe estar entre 18 y 99 años.')
      return
    }
    setError('')
    // Maqueta: aquí iría el PUT al backend con los datos del perfil.
    setGuardado(true)
  }

  return (
    <>
      <div className="vista-head">
        <h1>Mis datos personales</h1>
        <p>Revisa y actualiza tu información. {rut && <>RUT: <b>{rut}</b></>}</p>
      </div>

      <form className="perfil" onSubmit={guardar}>
        {/* Datos personales */}
        <div className="panel-box">
          <div className="panel-box__titulo">
            <IconoPersona width={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Datos personales
          </div>
          <div className="perfil__grid">
            <label className="campo-form campo-form--ancho">
              Nombre completo
              <input value={form.nombre} onChange={(e) => cambiar('nombre', e.target.value)} placeholder="Nombre y apellidos" />
            </label>
            <label className="campo-form">
              Edad
              <input type="number" min={18} max={99} value={form.edad} onChange={(e) => cambiar('edad', e.target.value)} placeholder="Edad" />
            </label>
            <label className="campo-form">
              Turno (régimen laboral)
              <select value={form.turno} onChange={(e) => cambiar('turno', e.target.value)}>
                {Object.keys(regimenesLaborales).map((clave) => (
                  <option key={clave} value={clave}>
                    {regimenesLaborales[clave].etiqueta} — {regimenesLaborales[clave].descripcion}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Contacto */}
        <div className="panel-box">
          <div className="panel-box__titulo">
            <IconoCorreo width={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Contacto
          </div>
          <div className="perfil__grid">
            <label className="campo-form">
              Correo
              <input type="email" value={form.correo} onChange={(e) => cambiar('correo', e.target.value)} placeholder="correo@ejemplo.cl" />
            </label>
            <label className="campo-form">
              Teléfono
              <input
                value={form.telefono}
                onChange={(e) => cambiar('telefono', e.target.value)}
                onBlur={() => cambiar('telefono', formatearTelefono(form.telefono))}
                placeholder="+56 9 XXXX XXXX"
              />
            </label>
            <label className="campo-form campo-form--ancho">
              Dirección
              <input value={form.direccion} onChange={(e) => cambiar('direccion', e.target.value)} placeholder="Calle, número, sector, ciudad" />
            </label>
          </div>
        </div>

        {/* Tallas de ropa */}
        <div className="panel-box">
          <div className="panel-box__titulo">
            <IconoReloj width={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Tallas de ropa (uniforme y equipo)
          </div>
          <div className="perfil__grid">
            <label className="campo-form">
              Polera / chaqueta
              <select value={form.tallaPolera} onChange={(e) => cambiar('tallaPolera', e.target.value)}>
                {TALLAS_ROPA.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label className="campo-form">
              Pantalón
              <select value={form.tallaPantalon} onChange={(e) => cambiar('tallaPantalon', e.target.value)}>
                {TALLAS_ROPA.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label className="campo-form">
              Calzado
              <select value={form.tallaCalzado} onChange={(e) => cambiar('tallaCalzado', e.target.value)}>
                {TALLAS_CALZADO.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
          </div>
        </div>

        {/* Guardar */}
        <div className="perfil__acciones">
          {error && <span className="perfil__error">{error}</span>}
          {guardado && !error && (
            <span className="perfil__ok">
              <IconoCheck width={16} /> Cambios guardados.
            </span>
          )}
          <button type="submit" className="btn btn-primario">
            <IconoCheck width={16} /> Guardar cambios
          </button>
        </div>
      </form>
    </>
  )
}
