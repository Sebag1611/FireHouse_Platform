import { useState } from 'react'
import { TENIENTES } from '../../../../data/roles'
import { IconoCerrar, IconoCheck, IconoCalendario } from '../../../../components/ui/Icono'

/**
 * Plantilla para crear una nueva guardia. La rellena el teniente
 * (o Capitán/Directora) al armar el turno de la semana.
 *
 * Incluye:
 *  - Datos de la guardia: título, semana, tipo, encargado.
 *  - Bloques (día + horario + cupos).
 *  - TAREAS correspondientes a la guardia (lista editable).
 *
 * @param {string} rangoActual - Rango del usuario (encargado por defecto).
 * @param {function} onCrear   - Recibe la planilla nueva ya armada.
 * @param {function} onCerrar  - Cierra sin crear.
 *
 * Carcasa: la guardia se agrega en memoria. En producción sería un
 * POST al backend.
 */

// Tareas sugeridas que suelen acompañar una guardia (plantilla base).
const TAREAS_SUGERIDAS = [
  'Revisión de material mayor y menor',
  'Control de equipos de respiración autónoma',
  'Limpieza y orden del cuartel',
  'Verificación de combustible de unidades',
]

export default function FormCrearGuardia({ rangoActual, onCrear, onCerrar }) {
  const [titulo, setTitulo] = useState('')
  const [semana, setSemana] = useState('')
  const [tipo, setTipo] = useState('diurno')
  // Si quien crea es teniente, queda como encargado por defecto.
  const encargadoInicial = TENIENTES.some((t) => t.id === rangoActual)
    ? rangoActual
    : TENIENTES[0].id
  const [encargado, setEncargado] = useState(encargadoInicial)

  // Bloques de la guardia (día + horario + cupos). Empieza con uno.
  const [bloques, setBloques] = useState([
    { dia: '', horario: '09:30 a 13:30', cupos: 4 },
  ])

  // Tareas de la guardia. Arrancamos con las sugeridas marcadas.
  const [tareas, setTareas] = useState(
    TAREAS_SUGERIDAS.map((t) => ({ texto: t, incluida: true }))
  )
  const [tareaNueva, setTareaNueva] = useState('')
  const [error, setError] = useState('')

  // --- Bloques ---
  const cambiarBloque = (i, campo, valor) => {
    setBloques((prev) =>
      prev.map((b, idx) => (idx === i ? { ...b, [campo]: valor } : b))
    )
  }
  const agregarBloque = () =>
    setBloques((prev) => [...prev, { dia: '', horario: '09:30 a 13:30', cupos: 4 }])
  const quitarBloque = (i) =>
    setBloques((prev) => prev.filter((_, idx) => idx !== i))

  // --- Tareas ---
  const alternarTarea = (i) =>
    setTareas((prev) =>
      prev.map((t, idx) => (idx === i ? { ...t, incluida: !t.incluida } : t))
    )
  const agregarTarea = () => {
    const txt = tareaNueva.trim()
    if (!txt) return
    setTareas((prev) => [...prev, { texto: txt, incluida: true }])
    setTareaNueva('')
  }

  const crear = () => {
    if (!titulo.trim() || !semana.trim()) {
      setError('Completa el título y la semana de la guardia.')
      return
    }
    if (bloques.some((b) => !b.dia.trim())) {
      setError('Cada bloque necesita un día.')
      return
    }
    // Arma la planilla en el formato que usa la vista de Turnos.
    const nueva = {
      id: `guardia-${Date.now()}`,
      titulo: titulo.trim(),
      subtitulo: semana.trim(),
      plazo: 'Guardia creada desde plantilla.',
      tipo,
      encargado,
      // Tareas incluidas (solo las marcadas).
      tareas: tareas.filter((t) => t.incluida).map((t) => t.texto),
      bloques: bloques.map((b, i) => ({
        id: `nb-${Date.now()}-${i}`,
        dia: b.dia.trim(),
        horario: b.horario,
        cupos: Number(b.cupos) || 1,
        anotados: [],
        inscritoYo: false,
      })),
    }
    onCrear(nueva)
  }

  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <div
        className="form-guardia"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="form-guardia__head">
          <h2><IconoCalendario width={20} /> Nueva guardia</h2>
          <button className="form-guardia__cerrar" onClick={onCerrar} aria-label="Cerrar">
            <IconoCerrar width={20} />
          </button>
        </div>

        <div className="form-guardia__body">
          {/* Datos generales */}
          <div className="form-guardia__grid">
            <label className="campo-form campo-form--ancho">
              Título de la guardia *
              <input
                value={titulo}
                onChange={(e) => { setTitulo(e.target.value); setError('') }}
                placeholder="Ej: Turno Diurno / Guardia Nocturna"
              />
            </label>
            <label className="campo-form campo-form--ancho">
              Semana / fechas *
              <input
                value={semana}
                onChange={(e) => { setSemana(e.target.value); setError('') }}
                placeholder="Ej: Semana del 1 al 7 de julio"
              />
            </label>
            <label className="campo-form">
              Tipo
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="diurno">Diurno</option>
                <option value="nocturno">Nocturno</option>
              </select>
            </label>
            <label className="campo-form">
              Encargado de turno
              <select value={encargado} onChange={(e) => setEncargado(e.target.value)}>
                {TENIENTES.map((t) => (
                  <option key={t.id} value={t.id}>{t.numero} · {t.persona}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Bloques */}
          <div className="form-guardia__seccion">
            <div className="form-guardia__seccion-head">
              <h3>Bloques de la guardia</h3>
              <button className="btn-mini" onClick={agregarBloque}>+ Agregar bloque</button>
            </div>
            {bloques.map((b, i) => (
              <div className="guardia-bloque" key={i}>
                <input
                  className="guardia-bloque__dia"
                  value={b.dia}
                  onChange={(e) => cambiarBloque(i, 'dia', e.target.value)}
                  placeholder="Día (ej: Miércoles)"
                />
                <input
                  className="guardia-bloque__horario"
                  value={b.horario}
                  onChange={(e) => cambiarBloque(i, 'horario', e.target.value)}
                  placeholder="09:30 a 13:30"
                />
                <input
                  className="guardia-bloque__cupos"
                  type="number"
                  min={1}
                  value={b.cupos}
                  onChange={(e) => cambiarBloque(i, 'cupos', e.target.value)}
                />
                {bloques.length > 1 && (
                  <button
                    className="guardia-bloque__quitar"
                    onClick={() => quitarBloque(i)}
                    aria-label="Quitar bloque"
                  >
                    <IconoCerrar width={15} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Tareas correspondientes */}
          <div className="form-guardia__seccion">
            <div className="form-guardia__seccion-head">
              <h3>Tareas correspondientes</h3>
            </div>
            <ul className="guardia-tareas">
              {tareas.map((t, i) => (
                <li key={i} className={t.incluida ? 'guardia-tarea--on' : ''}>
                  <button
                    className="guardia-tarea__check"
                    onClick={() => alternarTarea(i)}
                    aria-label={t.incluida ? 'Quitar tarea' : 'Incluir tarea'}
                  >
                    {t.incluida ? <IconoCheck width={14} /> : <i />}
                  </button>
                  <span>{t.texto}</span>
                </li>
              ))}
            </ul>
            <div className="guardia-tarea-nueva">
              <input
                value={tareaNueva}
                onChange={(e) => setTareaNueva(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && agregarTarea()}
                placeholder="Agregar otra tarea..."
              />
              <button className="btn-mini" onClick={agregarTarea}>Agregar</button>
            </div>
          </div>

          {error && <p className="form-guardia__error">{error}</p>}
        </div>

        <div className="form-guardia__acciones">
          <button className="btn btn-fantasma" onClick={onCerrar}>Cancelar</button>
          <button className="btn btn-primario" onClick={crear}>
            <IconoCheck width={16} /> Crear guardia
          </button>
        </div>
      </div>
    </div>
  )
}
