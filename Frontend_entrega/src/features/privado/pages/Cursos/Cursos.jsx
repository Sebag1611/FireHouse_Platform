import { useState } from 'react'
import { useSesion } from '../../context/SesionContext' // Ruta nueva
import { cursos as cursosData } from '../../../../data/personal'
import { getRango } from '../../../../data/roles' // Quitamos PERMISOS
import {
  IconoCurso, IconoCheck, IconoOjo, IconoCandado,
  IconoLapiz, IconoBasura, IconoPersona, IconoDescargaPDF,
} from '../../../../components/ui/Icono'
import FormCurso from './FormCurso'
import { descargarCursoPDF } from './descargarCursoPDF'
import '../../estilos-panel.css'
import './Cursos.css'

export default function Cursos() {
  // 1. Traemos tus datos de Django
  const { nombreCompleto, rango, tipo } = useSesion()

  const rangoActual = rango ? rango.toLowerCase() : ''
  const tipoActual = tipo ? tipo.toLowerCase() : ''

  // 2. Definimos quién es oficial (para crear cursos o ver a los inscritos)
  const esOficial = ['capitán', 'capitan', 'director', 'teniente'].includes(rangoActual) || ['capitán', 'capitan', 'director', 'teniente'].includes(tipoActual)

  const gestiona = esOficial      
  const puedeInscribirse = true // Todos los bomberos pueden inscribirse
  const veInscritos = esOficial 

  const [cursos, setCursos] = useState(cursosData)
  const [editando, setEditando] = useState(null)

  // 3. Revisamos si tu nombre real de Django ya está en la lista
  const estoyInscrito = (curso) => curso.inscritos.includes(nombreCompleto)

  const alternarInscripcion = (idCurso) => {
    setCursos((prev) =>
      prev.map((c) => {
        if (c.id !== idCurso) return c
        const yaEsta = c.inscritos.includes(nombreCompleto)
        
        if (!yaEsta && c.inscritos.length >= c.cupos) return c
        return {
          ...c,
          inscritos: yaEsta
            ? c.inscritos.filter((n) => n !== nombreCompleto)
            : [...c.inscritos, nombreCompleto],
        }
      })
    )
  }

  const guardarCurso = (datos) => {
    if (datos.id) {
      setCursos((prev) => prev.map((c) => (c.id === datos.id ? { ...c, ...datos } : c)))
    } else {
      setCursos((prev) => [
        {
          ...datos,
          id: `curso-${Date.now()}`,
          creadorRangoId: rangoActual || 'oficial',
          inscritos: [],
        },
        ...prev,
      ])
    }
    setEditando(null)
  }

  const eliminarCurso = (idCurso) => {
    if (!window.confirm('¿Eliminar este curso? Esta acción no se puede deshacer.')) return
    setCursos((prev) => prev.filter((c) => c.id !== idCurso))
  }

  const descargarPDF = (curso) => {
    const creador = getRango(curso.creadorRangoId) || { numero: '', nombre: 'Oficial', persona: 'Oficial' }
    descargarCursoPDF(curso, creador)
  }

  return (
    <>
      <div className="vista-head">
        <h1>Cursos</h1>
        <p>Capacitaciones abiertas por la oficialidad para el personal.</p>
      </div>

      {gestiona && (
        <div className="cursos-acciones">
          <button className="btn btn-primario" onClick={() => setEditando('nuevo')}>
            <IconoCurso width={16} /> Abrir nuevo curso
          </button>
        </div>
      )}

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
          const creador = getRango(curso.creadorRangoId) || { numero: '', nombre: 'Oficial', persona: 'Oficial' }
          const anotados = curso.inscritos.length
          const cerrado = anotados >= curso.cupos
          
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

              <p className="curso-card__creador">
                {creador.numero ? `${creador.nombre} ${creador.persona}` : creador.persona}
                {' '}abrió este curso
              </p>

              <div className="curso-card__datos">
                <span><b>Fechas:</b> {curso.fechas}</span>
                <span className="curso-card__desc">{curso.descripcion}</span>
              </div>

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

              <footer className="curso-card__acciones">
                {gestiona && (
                  <button
                    className="btn-mini"
                    onClick={() => descargarPDF(curso)}
                    title="Descargar curso como PDF"
                  >
                    <IconoDescargaPDF width={13} /> PDF
                  </button>
                )}
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