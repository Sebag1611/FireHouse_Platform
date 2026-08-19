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

export default function FormCrearPersonal({ onGuardar, onCerrar, rutCreador }) {
  // Un solo objeto de estado con todos los campos del formulario.
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    rut: '',
    rango: 'bombero',
    nivel: '',
    telefono: '',
    correo: '',
    contraseña: '',
    tipoSangre: 'O+',
    direccion: '',
    nacimiento: '',
    ingreso: '',
    contactoEmergencia: '',
    telefonoEmergencia: '',
  })
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

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

  const guardar = async () => {
    // Validación mínima de los campos obligatorios.
    if (!form.nombres.trim() || !form.apellidos.trim() || !form.rut.trim() || !form.telefono.trim()) {
      setError('Completa al menos nombres, apellidos, RUT y teléfono.')
      return
    }

    setEnviando(true)
    setError('')

    try {
      const res = await fetch('/api/Administracion/crear-bombero/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rut_creador: rutCreador,
          rut: form.rut,
          nombres: form.nombres,
          apellidos: form.apellidos,
          telefono: form.telefono,
          correo: form.correo,
          contraseña: form.contraseña,
          direccion: form.direccion,
          fecha_ingreso: form.ingreso,
          rango: form.rango,
          nivel: form.nivel,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al crear el bombero.')
        return
      }

      onGuardar(data)
      onCerrar()
    } catch (e) {
      setError('No se pudo conectar con el servidor.')
    } finally {
      setEnviando(false)
    }
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
          <label className="campo-form">
            Nombres *
            <input
              value={form.nombres}
              onChange={(e) => cambiar('nombres', e.target.value)}
              placeholder="Nombres"
            />
          </label>

          <label className="campo-form">
            Apellidos *
            <input
              value={form.apellidos}
              onChange={(e) => cambiar('apellidos', e.target.value)}
              placeholder="Apellidos"
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
            Correo *
            <input
              type="email"
              value={form.correo}
              onChange={(e) => cambiar('correo', e.target.value)}
              placeholder="correo@ejemplo.cl"
            />
          </label>
          <label className="campo-form">
            Contraseña *
            <input
              type="password"
              value={form.contraseña}
              onChange={(e) => cambiar('contraseña', e.target.value)}
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

          <label className="campo-form campo-form--ancho">
            Dirección
            <input
              value={form.direccion}
              onChange={(e) => cambiar('direccion', e.target.value)}
              placeholder="Calle, número, sector"
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
            Nivel
            <input
              value={form.nivel}
              onChange={(e) => cambiar('nivel', e.target.value)}
              placeholder="Ej: 1, 2, 3..."
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
