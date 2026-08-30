import { useState } from 'react'
import { useSesion } from '../../context'
import { cursos as cursosData } from '../../../../data/personal'
import { PERMISOS, getRango, nombreConNumero } from '../../../../data/roles'
import {
  IconoCurso, IconoCheck, IconoOjo, IconoCandado,
  IconoLapiz, IconoBasura, IconoPersona, IconoDescargaPDF,
} from '../../../../components/ui/Icono'
import FormCurso from './FormCurso'
import { descargarCursoPDF } from './descargarCursoPDF'
import '../../estilos-panel.css'
import './Cursos.css'

/**
 * Módulo de Cursos / capacitaciones.
 *
 * Los oficiales (tenientes, capitán, directora) abren cursos y los
 * bomberos se inscriben. Funciona como encuesta cerrada:
 *  - Con cupos libres: se ve solo el CONTADOR (ej. 2/4), sin nombres.
 *  - Al llenarse: se cierra y se revela la lista de inscritos.
 *  - Los oficiales SIEMPRE ven la lista (permiso VER_INSCRITOS_CURSO).
 */
export default function Cursos() {
  const { usuario, rangoId, puede } = useSesion()
  const gestiona = puede(PERMISOS.GESTIONAR_CURSOS)      // crear/editar/eliminar
  const puedeInscribirse = puede(PERMISOS.INSCRIBIRSE_CURSO)
  const veInscritos = puede(PERMISOS.VER_INSCRITOS_CURSO) // oficiales

  const [cursos, setCursos] = useState(cursosData)
  // Curso en edición/creación: objeto o 'nuevo' o null.
  const [editando, setEditando] = useState(null)

  // ¿Estoy inscrito en este curso?
  const estoyInscrito = (curso) => curso.inscritos.includes(usuario)

  // Inscribirse / desinscribirse de un curso.
  const alternarInscripcion = (idCurso) => {
    setCursos((prev) =>
      prev.map((c) => {
        if (c.id !== idCurso) return c
        const yaEsta = c.inscritos.includes(usuario)
        // Si ya está lleno y no soy yo, no dejar inscribir.
        if (!yaEsta && c.inscritos.length >= c.cupos) return c
        return {
          ...c,
          inscritos: yaEsta
            ? c.inscritos.filter((n) => n !== usuario)
            : [...c.inscritos, usuario],
        }
      })
    )
  }

  // Guardar (crear o editar) un curso.
  const guardarCurso = (datos) => {
    if (datos.id) {
      // Edición: reemplaza el curso existente.
      setCursos((prev) => prev.map((c) => (c.id === datos.id ? { ...c, ...datos } : c)))
    } else {
      // Creación: el creador es el usuario actual (por sesión).
      setCursos((prev) => [
        {
          ...datos,
          id: `curso-${Date.now()}`,
          creadorRangoId: rangoId,
          inscritos: [],
        },
        ...prev,
      ])
    }
    setEditando(null)
  }

  // Eliminar un curso.
  const eliminarCurso = (idCurso) => {
    if (!window.confirm('¿Eliminar este curso? Esta acción no se puede deshacer.')) return
    setCursos((prev) => prev.filter((c) => c.id !== idCurso))
  }

  // Descargar un curso como PDF para registro físico.
  const descargarPDF = (curso) => {
    const creador = getRango(curso.creadorRangoId)
    descargarCursoPDF(curso, creador)
  }

  return (
    <>
      <div className="vista-head">
        <h1>Cursos</h1>
        <p>Capacitaciones abiertas por la oficialidad para el personal.</p>
      </div>

      {/* Botón crear (solo oficiales que gestionan). */}
      {gestiona && (
        <div className="cursos-acciones">
          <button className="btn btn-primario" onClick={() => setEditando('nuevo')}>
            <IconoCurso width={16} /> Abrir nuevo curso
          </button>
        </div>
      )}

      {/* Aviso según permiso. */}
      {puedeInscribirse ? (
        <div className="nota-info">
          <IconoCheck width={18} />
          Inscríbete en los cursos disponibles. Los nombres se revelan cuando el
          curso completa sus cupos.
        </div>
      ) : (
        <div className="nota-info">
          <IconoOjo width={18} />
          Tu rango puede visualizar los cursos disponibles.
        </div>
      )}

      {cursos.length === 0 && (
        <div className="panel-box cursos-vacio">
          No hay cursos abiertos en este momento.
        </div>
      )}

      <div className="cursos-grid">
        {cursos.map((curso) => {
          const creador = getRango(curso.creadorRangoId)
          const anotados = curso.inscritos.length
          const cerrado = anotados >= curso.cupos
          // ¿Muestro la lista de inscritos?
          // Sí, si el curso está cerrado (todos lo ven) o si soy
          // oficial (los veo siempre).
          const mostrarLista = cerrado || veInscritos
          const inscrito = estoyInscrito(curso)

          return (
            <article className={`curso-card ${cerrado ? 'curso-card--cerrado' : ''}`} key={curso.id}>
              <header className="curso-card__head">
                <div className="curso-card__titulo">
                  <IconoCurso width={20} />
                  <h2>{curso.nombre}</h2>
                </div>
                {cerrado ? (
                  <span className="curso-card__estado curso-card__estado--cerrado">
                    <IconoCandado width={13} /> Cerrado
                  </span>
                ) : (
                  <span className="curso-card__estado curso-card__estado--abierto">
                    Inscripciones abiertas
                  </span>
                )}
              </header>

              {/* Quién lo abrió (detectado por su sesión al crear). */}
              <p className="curso-card__creador">
                {creador.numero ? `${creador.nombre} ${creador.persona}` : creador.persona}
                {' '}abrió este curso
              </p>

              <div className="curso-card__datos">
                <span><b>Fechas:</b> {curso.fechas}</span>
                <span className="curso-card__desc">{curso.descripcion}</span>
              </div>

              {/* Contador de cupos + barra. */}
              <div className="curso-card__cupos">
                <div className="curso-card__cupos-info">
                  <span>{anotados} / {curso.cupos} cupos</span>
                  {cerrado && <span className="curso-card__lleno">Cupos completos</span>}
                </div>
                <div className="curso-barra">
                  <div
                    className="curso-barra__relleno"
                    style={{ width: `${Math.min((anotados / curso.cupos) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Lista de inscritos (solo si corresponde). */}
              {mostrarLista ? (
                <div className="curso-card__inscritos">
                  <span className="curso-card__inscritos-rotulo">
                    <IconoPersona width={13} /> Inscritos
                    {!cerrado && veInscritos && (
                      <em className="curso-card__solo-oficial"> (visible solo para oficiales)</em>
                    )}
                  </span>
                  {curso.inscritos.length > 0 ? (
                    <ul>
                      {curso.inscritos.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="curso-card__sin-inscritos">Aún no hay inscritos.</p>
                  )}
                </div>
              ) : (
                <p className="curso-card__oculto">
                  <IconoCandado width={13} /> Los inscritos se revelarán al completar los cupos.
                </p>
              )}

              {/* Acciones */}
              <footer className="curso-card__acciones">
                <button
                  className="btn-mini"
                  onClick={() => descargarPDF(curso)}
                  title="Descargar curso como PDF"
                >
                  <IconoDescargaPDF width={13} /> PDF
                </button>
                {puedeInscribirse && (!cerrado || inscrito) && (
                  <button
                    className={`btn-mini ${inscrito ? 'btn-mini--peligro' : 'btn-mini--primario'}`}
                    onClick={() => alternarInscripcion(curso.id)}
                  >
                    {inscrito ? 'Anular inscripción' : 'Inscribirme'}
                  </button>
                )}
                {gestiona && (
                  <>
                    <button className="btn-mini" onClick={() => setEditando(curso)}>
                      <IconoLapiz width={13} /> Editar
                    </button>
                    <button className="btn-mini btn-mini--peligro" onClick={() => eliminarCurso(curso.id)}>
                      <IconoBasura width={13} /> Eliminar
                    </button>
                  </>
                )}
              </footer>
            </article>
          )
        })}
      </div>

      {/* Formulario crear/editar. */}
      {editando && (
        <FormCurso
          curso={editando === 'nuevo' ? null : editando}
          onGuardar={guardarCurso}
          onCerrar={() => setEditando(null)}
        />
      )}
    </>
  )
}
