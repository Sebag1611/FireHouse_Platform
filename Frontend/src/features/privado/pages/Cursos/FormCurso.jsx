import { useState } from 'react'
import { IconoCerrar, IconoCheck, IconoCurso } from '../../../../components/ui/Icono'

export default function FormCurso({ curso, onGuardar, onCerrar }) {
  const esEdicion = Boolean(curso)

  const [form, setForm] = useState({
    nombre: curso?.nombre ?? '',
    fecha: curso?.fecha ? curso.fecha.substring(0, 16) : '', // Formato YYYY-MM-DDTHH:mm para datetime-local
    cupos: curso?.cupos ?? 4,
  })
  const [error, setError] = useState('')

  const cambiar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }))
    setError('')
  }

  const guardar = () => {
    if (!form.nombre.trim() || !form.fecha) {
      setError('Completa el nombre y la fecha/hora del curso.')
      return
    }
    const cupos = Number(form.cupos) || 1
    // Al editar, no permitir bajar los cupos por debajo de los ya inscritos.
    if (esEdicion && curso.inscritos && cupos < curso.inscritos.length) {
      setError(`Ya hay ${curso.inscritos.length} inscritos; los cupos no pueden ser menos.`)
      return
    }
    onGuardar({
      ...(esEdicion ? { id_curso: curso.id_curso || curso.id } : {}),
      nombre: form.nombre.trim(),
      fecha: form.fecha,
      cupos,
    })
  }

  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <div className="form-curso" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="form-curso__head">
          <h2><IconoCurso width={20} /> {esEdicion ? 'Editar curso' : 'Abrir nuevo curso'}</h2>
          <button className="form-curso__cerrar" onClick={onCerrar} aria-label="Cerrar">
            <IconoCerrar width={20} />
          </button>
        </div>

        <div className="form-curso__body">
          <label className="campo-form">
            Nombre del curso *
            <input
              value={form.nombre}
              onChange={(e) => cambiar('nombre', e.target.value)}
              placeholder="Ej: Escala y Cuerdas"
            />
          </label>

          <label className="campo-form">
            Fecha y Hora *
            <input
              type="datetime-local"
              value={form.fecha}
              onChange={(e) => cambiar('fecha', e.target.value)}
            />
          </label>

          <label className="campo-form">
            Cupos
            <input
              type="number"
              min={1}
              value={form.cupos}
              onChange={(e) => cambiar('cupos', e.target.value)}
            />
          </label>

          {error && <p className="form-curso__error">{error}</p>}
        </div>

        <div className="form-curso__acciones">
          <button className="btn btn-fantasma" onClick={onCerrar}>Cancelar</button>
          <button className="btn btn-primario" onClick={guardar}>
            <IconoCheck width={16} /> {esEdicion ? 'Guardar cambios' : 'Abrir curso'}
          </button>
        </div>
      </div>
    </div>
  )
}