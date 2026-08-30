import { useState } from 'react'
import { IconoCerrar, IconoCheck, IconoCurso } from '../../../../components/ui/Icono'

/**
 * Formulario para abrir o editar un curso.
 *
 * @param {object|null} curso - Curso a editar, o null para crear.
 * @param {function} onGuardar - Recibe los datos del curso.
 * @param {function} onCerrar  - Cierra sin guardar.
 *
 * El creador NO se pide aquí: al crear, se toma automáticamente del
 * rango de la sesión (lo resuelve la vista Cursos). Al editar, se
 * conserva el creador original.
 */
export default function FormCurso({ curso, onGuardar, onCerrar }) {
  const esEdicion = Boolean(curso)

  const [form, setForm] = useState({
    nombre: curso?.nombre ?? '',
    fechas: curso?.fechas ?? '',
    cupos: curso?.cupos ?? 4,
    descripcion: curso?.descripcion ?? '',
  })
  const [error, setError] = useState('')

  const cambiar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }))
    setError('')
  }

  const guardar = () => {
    if (!form.nombre.trim() || !form.fechas.trim()) {
      setError('Completa al menos el nombre y las fechas del curso.')
      return
    }
    const cupos = Number(form.cupos) || 1
    // Al editar, no permitir bajar los cupos por debajo de los ya inscritos.
    if (esEdicion && cupos < curso.inscritos.length) {
      setError(`Ya hay ${curso.inscritos.length} inscritos; los cupos no pueden ser menos.`)
      return
    }
    onGuardar({
      ...(esEdicion ? { id: curso.id } : {}),
      nombre: form.nombre.trim(),
      fechas: form.fechas.trim(),
      descripcion: form.descripcion.trim(),
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
            Fechas *
            <input
              value={form.fechas}
              onChange={(e) => cambiar('fechas', e.target.value)}
              placeholder="Ej: 18 al 19 de septiembre"
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

          <label className="campo-form">
            Breve descripción
            <textarea
              rows={3}
              value={form.descripcion}
              onChange={(e) => cambiar('descripcion', e.target.value)}
              placeholder="Ej: Cuartel Segunda Compañía · Se requiere nivel inicial."
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
