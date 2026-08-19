import { useState } from 'react'
import { planillasTurno } from '../../../../data/personal'
import { useSesion } from '../../context/SesionContext' // Ruta del contexto corregida
import { TENIENTES, getRango } from '../../../../data/roles' // Eliminamos PERMISOS y esTeniente
import {
  IconoCalendario, IconoCheck, IconoOjo, IconoCandado,
  IconoLapiz, IconoPersona, IconoBasura, IconoDescargaPDF,
} from '../../../../components/ui/Icono'
import FormCrearGuardia from './FormCrearGuardia'
import { descargarTurnoPDF } from './descargarTurnoPDF'
import '../../estilos-panel.css'
import './Turnos.css'

export default function Turnos() {
  // 1. Extraemos los datos reales de Django
  const { rango, tipo, nombreCompleto } = useSesion()

  const rangoActual = rango ? rango.toLowerCase() : ''
  const tipoActual = tipo ? tipo.toLowerCase() : ''

  // 2. Traducimos los permisos basados en los rangos reales
  const configuraGlobal = ['capitán', 'capitan', 'director'].includes(rangoActual) || ['capitán', 'capitan', 'director'].includes(tipoActual)
  const puedeCrearGuardia = ['capitán', 'capitan', 'director', 'teniente'].includes(rangoActual) || ['capitán', 'capitan', 'director', 'teniente'].includes(tipoActual)
  
  // Todos los bomberos activos pueden marcar asistencia
  const puedeMarcar = true 

  const [planillas, setPlanillas] = useState(planillasTurno)
  const [editando, setEditando] = useState(null)
  const [creandoGuardia, setCreandoGuardia] = useState(false)

  // 3. ¿Puede configurar esta planilla? 
  // Director y Capitán pueden siempre. Para simplificar, habilitamos a los Tenientes a editar.
  const puedeConfigurar = (planilla) => configuraGlobal || rangoActual === 'teniente'

  const crearGuardia = (nuevaPlanilla) => {
    setPlanillas((prev) => [nuevaPlanilla, ...prev])
    setCreandoGuardia(false)
  }

  const alternarBloque = (idPlanilla, idBloque) => {
    if (!puedeMarcar) return
    setPlanillas((prev) =>
      prev.map((pl) => {
        if (pl.id !== idPlanilla) return pl
        return {
          ...pl,
          bloques: pl.bloques.map((b) => {
            if (b.id !== idBloque) return b
            const cerrado = b.anotados.length >= b.cupos
            if (b.inscritoYo) {
              // 4. Salir: quita tu nombre (ahora usamos nombreCompleto)
              return {
                ...b,
                inscritoYo: false,
                anotados: b.anotados.filter((n) => n !== nombreCompleto),
              }
            }
            // 5. Entrar: Agrega tu nombre real de la BD
            if (cerrado) return b
            return { ...b, inscritoYo: true, anotados: [...b.anotados, nombreCompleto] }
          }),
        }
      })
    )
  }

  const cambiarEncargado = (idPlanilla, nuevoEncargado) => {
    setPlanillas((prev) =>
      prev.map((pl) =>
        pl.id === idPlanilla ? { ...pl, encargado: nuevoEncargado } : pl
      )
    )
  }

  const guardarBloque = (idPlanilla, idBloque, cambios) => {
    setPlanillas((prev) =>
      prev.map((pl) => {
        if (pl.id !== idPlanilla) return pl
        return {
          ...pl,
          bloques: pl.bloques.map((b) =>
            b.id === idBloque ? { ...b, ...cambios } : b
          ),
        }
      })
    )
    setEditando(null)
  }

  const eliminarPlanilla = (idPlanilla) => {
    if (!window.confirm('¿Eliminar este turno completo? Esta acción no se puede deshacer.')) return
    setPlanillas((prev) => prev.filter((pl) => pl.id !== idPlanilla))
  }

  const eliminarBloque = (idPlanilla, idBloque) => {
    setPlanillas((prev) =>
      prev.map((pl) =>
        pl.id === idPlanilla
          ? { ...pl, bloques: pl.bloques.filter((b) => b.id !== idBloque) }
          : pl
      )
    )
  }

  const eliminarTarea = (idPlanilla, indiceTarea) => {
    setPlanillas((prev) =>
      prev.map((pl) =>
        pl.id === idPlanilla
          ? { ...pl, tareas: pl.tareas.filter((_, i) => i !== indiceTarea) }
          : pl
      )
    )
  }

  const descargarPDF = (planilla) => {
    const encargado = getRango(planilla.encargado)
    descargarTurnoPDF(planilla, encargado)
  }

  return (
    <>
      <div className="vista-head">
        <h1>Turnos</h1>
        <p>
          Planillas de asistencia semanal. La asignación de turnos rota cada
          semana entre los tenientes.
        </p>
      </div>

      {puedeCrearGuardia && (
        <div className="turnos-acciones">
          <button
            className="btn btn-primario"
            onClick={() => setCreandoGuardia(true)}
          >
            <IconoCalendario width={16} /> Crear nueva guardia
          </button>
        </div>
      )}

      {puedeMarcar ? (
        <div className="nota-info">
          <IconoCheck width={18} />
          Anótate en los bloques que puedas cubrir. Al completarse los cupos, el
          bloque se cierra y se muestran los seleccionados.
        </div>
      ) : (
        <div className="nota-info">
          <IconoOjo width={18} />
          Tu rango <strong>&nbsp;visualiza&nbsp;</strong> las planillas; no
          requiere marcar asistencia.
        </div>
      )}

      {planillas.map((pl) => {
        const encargado = getRango(pl.encargado)
        const puedeEditar = puedeConfigurar(pl)
        return (
          <section className="planilla" key={pl.id}>
            <header className="planilla__head">
              <div>
                <h2>{pl.titulo}</h2>
                <span className="planilla__sub">
                  <IconoCalendario width={14} /> {pl.subtitulo}
                </span>
              </div>
              <span className={`planilla__tag planilla__tag--${pl.tipo}`}>
                {pl.tipo === 'nocturno' ? 'Nocturno' : 'Diurno'}
              </span>
            </header>

            <div className="planilla__acciones">
              <button
                className="btn-mini"
                onClick={() => descargarPDF(pl)}
                title="Descargar turno como PDF"
              >
                <IconoDescargaPDF width={14} /> Descargar PDF
              </button>
              {puedeEditar && (
                <button
                  className="btn-mini btn-mini--peligro"
                  onClick={() => eliminarPlanilla(pl.id)}
                  title="Eliminar turno"
                >
                  <IconoBasura width={14} /> Eliminar turno
                </button>
              )}
            </div>

            {pl.plazo && <p className="planilla__plazo">{pl.plazo}</p>}

            <div className="planilla__encargado">
              <span className="planilla__encargado-rotulo">
                <IconoPersona width={15} /> Encargado de turno
              </span>
              {puedeEditar ? (
                <select
                  value={pl.encargado}
                  onChange={(e) => cambiarEncargado(pl.id, e.target.value)}
                  className="planilla__encargado-select"
                >
                  {TENIENTES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.numero} · {t.persona}
                    </option>
                  ))}
                </select>
              ) : (
                <strong className="planilla__encargado-nombre">
                  {encargado.numero} · {encargado.persona}
                </strong>
              )}
            </div>

            {pl.tareas && pl.tareas.length > 0 && (
              <div className="planilla__tareas">
                <span className="planilla__tareas-rotulo">
                  <IconoCheck width={14} /> Tareas de la guardia
                </span>
                <ul>
                  {pl.tareas.map((t, i) => (
                    <li key={i}>
                      <span>{t}</span>
                      {puedeEditar && (
                        <button
                          className="planilla__tarea-quitar"
                          onClick={() => eliminarTarea(pl.id, i)}
                          aria-label="Eliminar tarea"
                        >
                          <IconoBasura width={13} />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ul className="bloques">
              {pl.bloques.map((b) => {
                const anotados = b.anotados.length
                const cerrado = anotados >= b.cupos
                const porcentaje = Math.round((anotados / b.cupos) * 100)
                const enEdicion =
                  editando &&
                  editando.planillaId === pl.id &&
                  editando.bloqueId === b.id

                if (enEdicion) {
                  return (
                    <li key={b.id} className="bloque bloque--editando">
                      <FormEdicionBloque
                        bloque={b}
                        onGuardar={(cambios) =>
                          guardarBloque(pl.id, b.id, cambios)
                        }
                        onCancelar={() => setEditando(null)}
                      />
                    </li>
                  )
                }

                return (
                  <li
                    key={b.id}
                    className={`bloque ${b.inscritoYo ? 'bloque--mio' : ''} ${
                      cerrado ? 'bloque--cerrado' : ''
                    } ${puedeMarcar && !cerrado ? 'bloque--marcable' : ''}`}
                    onClick={() =>
                      !cerrado && alternarBloque(pl.id, b.id)
                    }
                    role={puedeMarcar && !cerrado ? 'button' : undefined}
                    tabIndex={puedeMarcar && !cerrado ? 0 : undefined}
                    onKeyDown={(e) =>
                      puedeMarcar &&
                      !cerrado &&
                      e.key === 'Enter' &&
                      alternarBloque(pl.id, b.id)
                    }
                  >
                    <span className="bloque__check">
                      {cerrado ? (
                        <IconoCandado width={14} />
                      ) : b.inscritoYo ? (
                        <IconoCheck width={15} />
                      ) : (
                        <i />
                      )}
                    </span>

                    <div className="bloque__info">
                      <div className="bloque__titulo">
                        <span className="bloque__dia">{b.dia}</span>
                        <span className="bloque__horario">{b.horario}</span>
                        {cerrado && (
                          <span className="bloque__cerrado-tag">Completo</span>
                        )}
                      </div>

                      <div className="bloque__barra">
                        <div
                          className={`bloque__relleno ${
                            cerrado ? 'bloque__relleno--lleno' : ''
                          }`}
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>

                      {cerrado && (
                        <ul className="bloque__seleccionados">
                          {b.anotados.slice(0, b.cupos).map((n, idx) => (
                            <li key={idx}>
                              <IconoCheck width={12} /> {n}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <span className="bloque__conteo">
                      {anotados}/{b.cupos}
                    </span>

                    {puedeEditar && (
                      <span className="bloque__acciones">
                        <button
                          className="bloque__editar"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditando({ planillaId: pl.id, bloqueId: b.id })
                          }}
                          aria-label="Editar bloque"
                          title="Editar cupos y horario"
                        >
                          <IconoLapiz width={15} />
                        </button>
                        <button
                          className="bloque__eliminar"
                          onClick={(e) => {
                            e.stopPropagation()
                            eliminarBloque(pl.id, b.id)
                          }}
                          aria-label="Eliminar bloque"
                          title="Eliminar este bloque"
                        >
                          <IconoBasura width={15} />
                        </button>
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}

      {creandoGuardia && (
        <FormCrearGuardia
          rangoActual={rangoActual}
          onCrear={crearGuardia}
          onCerrar={() => setCreandoGuardia(false)}
        />
      )}
    </>
  )
}

function FormEdicionBloque({ bloque, onGuardar, onCancelar }) {
  const [cupos, setCupos] = useState(bloque.cupos)
  const [horario, setHorario] = useState(bloque.horario)

  return (
    <div className="edicion-bloque">
      <div className="edicion-bloque__campos">
        <label>
          Día
          <input value={bloque.dia} disabled />
        </label>
        <label>
          Horario
          <input
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            placeholder="09:30 a 13:30"
          />
        </label>
        <label>
          Cupos
          <input
            type="number"
            min={bloque.anotados.length}
            value={cupos}
            onChange={(e) => setCupos(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="edicion-bloque__acciones">
        <button className="btn-mini" onClick={onCancelar}>
          Cancelar
        </button>
        <button
          className="btn-mini btn-mini--primario"
          onClick={() => onGuardar({ cupos, horario })}
        >
          Guardar
        </button>
      </div>
    </div>
  )
}