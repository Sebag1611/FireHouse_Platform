import { useState } from 'react'
import { planillasTurno } from '../../../../data/personal'
import { useSesion } from '../../context'
import {
  PERMISOS, TENIENTES, getRango,
} from '../../../../data/roles'
import {
  IconoCalendario, IconoCheck, IconoOjo, IconoCandado,
  IconoLapiz, IconoPersona,
} from '../../../../components/ui/Icono'
import '../../estilos-panel.css'
import './Turnos.css'

/**
 * Vista de Turnos · Planillas de asistencia con cupos y cierre.
 *
 * Comportamiento por bloque (día + horario):
 *  - Tiene un límite de CUPOS. Los bomberos se anotan y los
 *    primeros en llenar el cupo quedan seleccionados.
 *  - Mientras hay cupo: se muestra "anotados / cupos" SIN nombres.
 *  - Al llenarse: el bloque se CIERRA solo y se revelan los
 *    nombres de los seleccionados.
 *
 * Encargado de turno (rota por semana):
 *  - Cada planilla tiene un teniente encargado, visible arriba.
 *  - El encargado (o Directora/Capitán) puede editar los cupos y
 *    horarios de los bloques, y designar al siguiente encargado.
 *
 * Permisos:
 *  - VER_TURNOS: todos ven las planillas.
 *  - MARCAR_ASISTENCIA_TURNO: Bomberos, Ayudantes, Secretaria y
 *    Tesorera se anotan.
 *  - Configurar (cupos/horarios/encargado): Directora, Capitán y
 *    el teniente ENCARGADO de esa planilla.
 */
export default function Turnos() {
  const { rangoId, puede, usuario } = useSesion()
  const puedeMarcar = puede(PERMISOS.MARCAR_ASISTENCIA_TURNO)
  const configuraGlobal = puede(PERMISOS.CONFIGURAR_TURNOS) // Dir/Cap

  const [planillas, setPlanillas] = useState(planillasTurno)
  // Bloque en edición: { planillaId, bloqueId } o null.
  const [editando, setEditando] = useState(null)

  // ¿El usuario actual puede configurar ESTA planilla?
  // Dir/Cap siempre; un teniente solo si es el encargado de ella.
  const puedeConfigurar = (planilla) =>
    configuraGlobal || rangoId === planilla.encargado

  // Anotarse / salir de un bloque (si hay cupo y no está cerrado).
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
              // Salir: quita mi nombre.
              return {
                ...b,
                inscritoYo: false,
                anotados: b.anotados.filter((n) => n !== usuario),
              }
            }
            // Entrar: solo si aún hay cupo.
            if (cerrado) return b
            return { ...b, inscritoYo: true, anotados: [...b.anotados, usuario] }
          }),
        }
      })
    )
  }

  // Cambiar el encargado de una planilla.
  const cambiarEncargado = (idPlanilla, nuevoEncargado) => {
    setPlanillas((prev) =>
      prev.map((pl) =>
        pl.id === idPlanilla ? { ...pl, encargado: nuevoEncargado } : pl
      )
    )
  }

  // Guardar edición de cupos / horario de un bloque.
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

  return (
    <>
      <div className="vista-head">
        <h1>Turnos</h1>
        <p>
          Planillas de asistencia semanal. La asignación de turnos rota cada
          semana entre los tenientes.
        </p>
      </div>

      {/* Aviso según el permiso de asistencia del rol. */}
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

            {pl.plazo && <p className="planilla__plazo">{pl.plazo}</p>}

            {/* Encargado de turno de la semana. */}
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

            <ul className="bloques">
              {pl.bloques.map((b) => {
                const anotados = b.anotados.length
                const cerrado = anotados >= b.cupos
                const porcentaje = Math.round((anotados / b.cupos) * 100)
                const enEdicion =
                  editando &&
                  editando.planillaId === pl.id &&
                  editando.bloqueId === b.id

                // --- Modo edición de cupos/horario ---
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
                    {/* Marcador de selección. */}
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

                      {/* Barra de progreso hacia el cupo. */}
                      <div className="bloque__barra">
                        <div
                          className={`bloque__relleno ${
                            cerrado ? 'bloque__relleno--lleno' : ''
                          }`}
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>

                      {/* Al cerrarse, se revelan los nombres. */}
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

                    {/* Botón de editar cupos/horario (solo config). */}
                    {puedeEditar && (
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
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </>
  )
}

/**
 * Mini formulario para editar los cupos y el horario de un bloque.
 * Solo lo ve quien puede configurar la planilla.
 */
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
