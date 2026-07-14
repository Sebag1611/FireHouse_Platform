import { useState } from 'react'
import { IconoCerrar, IconoCheck } from '../../../../components/ui/Icono'
import {
  limpiarRut, formatearRutConGuion, formatearTelefono,
} from '../../../../data/formatoChileno'

/**
 * Formulario completo para dar de alta un Bombero o Aspirante.
 * Se muestra como modal y solo lo abren Capitán y Directora.
 *
 * @param {function} onGuardar - Recibe los datos del nuevo integrante.
 * @param {function} onCerrar  - Cierra el formulario sin guardar.
 *
 * Es carcasa: los datos se agregan a la lista en memoria. En
 * producción, este formulario haría un POST al backend.
 */

const TIPOS_SANGRE = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']

export default function FormCrearPersonal({ onGuardar, onCerrar }) {
  // Un solo objeto de estado con todos los campos del formulario.
  const [form, setForm] = useState({
    nombre: '',
    rut: '',
    rango: 'bombero',
    telefono: '',
    tipoSangre: 'O+',
    direccion: '',
    nacimiento: '',
    ingreso: '',
    contactoEmergencia: '',
    telefonoEmergencia: '',
  })
  const [error, setError] = useState('')

  // Actualiza un campo del formulario por su nombre.
  const cambiar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }))
    setError('')
  }

  // RUT: mientras escribe solo limpia (números + K); al salir del
  // campo agrega el guion (formato 12345678-9).
  const cambiarRut = (valor) => cambiar('rut', limpiarRut(valor))
  const salirRut = () =>
    setForm((prev) => ({ ...prev, rut: formatearRutConGuion(prev.rut) }))

  // Teléfonos: al salir del campo, se formatean a +56 9 XXXX XXXX.
  const salirTelefono = (campo) =>
    setForm((prev) => ({ ...prev, [campo]: formatearTelefono(prev[campo]) }))

  const guardar = () => {
    // Validación mínima de los campos obligatorios.
    if (!form.nombre.trim() || !form.rut.trim() || !form.telefono.trim()) {
      setError('Completa al menos nombre, RUT y teléfono.')
      return
    }
    onGuardar(form)
  }

  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <div
        className="form-personal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="form-personal__head">
          <h2>Nuevo integrante</h2>
          <button
            className="form-personal__cerrar"
            onClick={onCerrar}
            aria-label="Cerrar"
          >
            <IconoCerrar width={20} />
          </button>
        </div>

        <div className="form-personal__grid">
          <label className="campo-form campo-form--ancho">
            Nombre completo *
            <input
              value={form.nombre}
              onChange={(e) => cambiar('nombre', e.target.value)}
              placeholder="Nombre y apellidos"
            />
          </label>

          <label className="campo-form">
            RUT *
            <input
              value={form.rut}
              onChange={(e) => cambiarRut(e.target.value)}
              onBlur={salirRut}
              placeholder="12345678-9"
              maxLength={10}
            />
          </label>

          <label className="campo-form">
            Rango
            <select
              value={form.rango}
              onChange={(e) => cambiar('rango', e.target.value)}
            >
              <option value="bombero">Bombero</option>
              <option value="aspirante">Aspirante</option>
            </select>
          </label>

          <label className="campo-form">
            Teléfono *
            <input
              value={form.telefono}
              onChange={(e) => cambiar('telefono', e.target.value)}
              onBlur={() => salirTelefono('telefono')}
              placeholder="+56 9 XXXX XXXX"
            />
          </label>

          <label className="campo-form">
            Tipo de sangre
            <select
              value={form.tipoSangre}
              onChange={(e) => cambiar('tipoSangre', e.target.value)}
            >
              {TIPOS_SANGRE.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>

          <label className="campo-form campo-form--ancho">
            Dirección
            <input
              value={form.direccion}
              onChange={(e) => cambiar('direccion', e.target.value)}
              placeholder="Calle, número, sector"
            />
          </label>

          <label className="campo-form">
            Fecha de nacimiento
            <input
              type="date"
              value={form.nacimiento}
              onChange={(e) => cambiar('nacimiento', e.target.value)}
            />
          </label>

          <label className="campo-form">
            Fecha de ingreso
            <input
              type="date"
              value={form.ingreso}
              onChange={(e) => cambiar('ingreso', e.target.value)}
            />
          </label>

          <label className="campo-form">
            Contacto de emergencia
            <input
              value={form.contactoEmergencia}
              onChange={(e) => cambiar('contactoEmergencia', e.target.value)}
              placeholder="Nombre"
            />
          </label>

          <label className="campo-form">
            Teléfono de emergencia
            <input
              value={form.telefonoEmergencia}
              onChange={(e) => cambiar('telefonoEmergencia', e.target.value)}
              onBlur={() => salirTelefono('telefonoEmergencia')}
              placeholder="+56 9 XXXX XXXX"
            />
          </label>
        </div>

        {error && <p className="form-personal__error">{error}</p>}

        <div className="form-personal__acciones">
          <button className="btn btn-fantasma" onClick={onCerrar}>
            Cancelar
          </button>
          <button className="btn btn-primario" onClick={guardar}>
            <IconoCheck width={16} /> Registrar integrante
          </button>
        </div>
      </div>
    </div>
  )
}
