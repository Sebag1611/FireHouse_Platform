import { useState } from 'react'
import { IconoCerrar, IconoCheck } from '../../../../components/ui/Icono'
import {
  limpiarRut, formatearRutConGuion, formatearTelefono,
} from '../../../../data/formatoChileno'
import { rutFormatoValido, telefonoValido, correoValido } from '../../../../data/validaciones'

export default function FormCrearPersonal({ onGuardar, onCerrar }) {
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    rut: '',
    rango: 'bombero',
    nivel: 'Nivel 1',
    telefono: '',
    correo: '',
    contraseña: 'Pass123', // Contraseña temporal por defecto
    direccion: '',
    nacimiento: '',
    ingreso: '',
  })
  const [error, setError] = useState('')

  const cambiar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }))
    setError('')
  }

  const cambiarRut = (valor) => cambiar('rut', limpiarRut(valor))
  const salirRut = () =>
    setForm((prev) => ({ ...prev, rut: formatearRutConGuion(prev.rut) }))

  const salirTelefono = (campo) =>
    setForm((prev) => ({ ...prev, [campo]: formatearTelefono(prev[campo]) }))

  const guardar = () => {
    if (!form.nombres.trim() || !form.apellidos.trim() || !form.rut.trim() || !form.telefono.trim()) {
      setError('Completa al menos nombres, apellidos, RUT y teléfono.')
      return
    }
    if (!rutFormatoValido(form.rut)) {
      setError('El RUT no tiene un formato válido (ej. 12345678-9).')
      return
    }
    if (!telefonoValido(form.telefono)) {
      setError('El teléfono no es válido (ej. +56 9 1234 5678).')
      return
    }
    if (form.correo && !correoValido(form.correo)) {
      setError('El correo no tiene un formato válido.')
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
          <label className="campo-form">
            Nombres *
            <input
              value={form.nombres}
              onChange={(e) => cambiar('nombres', e.target.value)}
              placeholder="Nombres"
              required
            />
          </label>

          <label className="campo-form">
            Apellidos *
            <input
              value={form.apellidos}
              onChange={(e) => cambiar('apellidos', e.target.value)}
              placeholder="Apellidos"
              required
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
              required
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
              <option value="teniente">Teniente</option>
              <option value="capitán">Capitán</option>
              <option value="director">Director</option>
            </select>
          </label>

          <label className="campo-form">
            Nivel
            <select
              value={form.nivel}
              onChange={(e) => cambiar('nivel', e.target.value)}
            >
              <option value="Nivel 1">Nivel 1</option>
              <option value="Nivel 2">Nivel 2</option>
              <option value="Nivel 3">Nivel 3</option>
              <option value="Nivel 4">Nivel 4</option>
              <option value="Nivel 5">Nivel 5</option>
            </select>
          </label>

          <label className="campo-form">
            Teléfono *
            <input
              value={form.telefono}
              onChange={(e) => cambiar('telefono', e.target.value)}
              onBlur={() => salirTelefono('telefono')}
              placeholder="+56 9 XXXX XXXX"
              required
            />
          </label>

          <label className="campo-form">
            Correo electrónico
            <input
              type="email"
              value={form.correo}
              onChange={(e) => cambiar('correo', e.target.value)}
              placeholder="correo@ejemplo.cl"
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