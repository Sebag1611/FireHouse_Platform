import { useState } from 'react'
import { planillasTurno } from '../../../../data/personal'
import { useSesion } from '../../context'
import { PERMISOS } from '../../../../data/roles'
import { IconoCalendario, IconoCheck, IconoOjo } from '../../../../components/ui/Icono'
import '../../estilos-panel.css'
import './Turnos.css'

/**
 * Vista de Turnos · Planillas de asistencia semanal.
 *
 * Reproduce el sistema que la compañía usa por WhatsApp: cada
 * planilla (semana) tiene bloques por día y franja horaria, y
 * cada bombero se anota en los que puede cubrir. Se ve el conteo
 * de anotados por bloque (barra de progreso relativa al más alto).
 *
 * Permisos:
 *  - VER_TURNOS: todos los rangos ven las planillas.
 *  - MARCAR_ASISTENCIA_TURNO: solo Bomberos, Ayudantes, Secretaria
 *    y Tesorera pueden inscribirse. Director, Capitán y Tenientes
 *    la ven en modo consulta (sin botón de inscripción).
 */
export default function Turnos() {
  const { puede } = useSesion()
  const puedeMarcar = puede(PERMISOS.MARCAR_ASISTENCIA_TURNO)

  // Estado local de las planillas (para simular la inscripción).
  const [planillas, setPlanillas] = useState(planillasTurno)

  // Marca / desmarca la asistencia del usuario en un bloque.
  const alternarBloque = (idPlanilla, idBloque) => {
    if (!puedeMarcar) return
    setPlanillas((prev) =>
      prev.map((pl) => {
        if (pl.id !== idPlanilla) return pl
        return {
          ...pl,
          bloques: pl.bloques.map((b) => {
            if (b.id !== idBloque) return b
            const yo = !b.inscritoYo
            return {
              ...b,
              inscritoYo: yo,
              anotados: b.anotados + (yo ? 1 : -1),
            }
          }),
        }
      })
    )
  }

  return (
    <>
      <div className="vista-head">
        <h1>Turnos</h1>
        <p>
          Planillas de asistencia semanal. El cambio de turno se realiza cada
          dos semanas.
        </p>
      </div>

      {/* Aviso según el permiso de asistencia del rol. */}
      {puedeMarcar ? (
        <div className="nota-info">
          <IconoCheck width={18} />
          Marca los bloques en los que puedes asistir. El número indica cuántos
          voluntarios se han anotado en cada uno.
        </div>
      ) : (
        <div className="nota-info">
          <IconoOjo width={18} />
          Tu rango <strong>&nbsp;visualiza&nbsp;</strong> las planillas de turno;
          no requiere marcar asistencia.
        </div>
      )}

      {/* Cada planilla (semana). */}
      {planillas.map((pl) => {
        // El máximo de anotados sirve para escalar las barras.
        const maxAnotados = Math.max(...pl.bloques.map((b) => b.anotados), 1)
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

            <ul className="bloques">
              {pl.bloques.map((b) => {
                const porcentaje = Math.round((b.anotados / maxAnotados) * 100)
                return (
                  <li
                    key={b.id}
                    className={`bloque ${b.inscritoYo ? 'bloque--mio' : ''} ${
                      puedeMarcar ? 'bloque--marcable' : ''
                    }`}
                    onClick={() => alternarBloque(pl.id, b.id)}
                    role={puedeMarcar ? 'button' : undefined}
                    tabIndex={puedeMarcar ? 0 : undefined}
                    onKeyDown={(e) =>
                      puedeMarcar && e.key === 'Enter' && alternarBloque(pl.id, b.id)
                    }
                  >
                    {/* Marcador de selección (círculo / check). */}
                    <span className="bloque__check">
                      {b.inscritoYo ? <IconoCheck width={15} /> : <i />}
                    </span>

                    <div className="bloque__info">
                      <div className="bloque__titulo">
                        <span className="bloque__dia">{b.dia}</span>
                        <span className="bloque__horario">{b.horario}</span>
                      </div>
                      {/* Barra proporcional de anotados. */}
                      <div className="bloque__barra">
                        <div
                          className="bloque__relleno"
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>
                    </div>

                    <span className="bloque__conteo">{b.anotados}</span>
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
