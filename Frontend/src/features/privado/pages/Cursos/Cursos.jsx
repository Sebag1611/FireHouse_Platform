import { useState, useEffect } from 'react'
import { useSesion } from '../../context/SesionContext'
import { getRango } from '../../../../data/roles'
import {
  IconoCurso, IconoCheck, IconoOjo, IconoCandado,
  IconoLapiz, IconoBasura, IconoPersona, IconoDescargaPDF,
} from '../../../../components/ui/Icono'
import FormCurso from './FormCurso'
import { descargarCursoPDF } from './descargarCursoPDF'
import '../../estilos-panel.css'
import './Cursos.css'

// ELIMINADO: import { cursos as cursosData } from '../../../../data/personal'

export default function Cursos() {
  // EXTRAEMOS EL RUT (o ID) de la sesión para enviarlo a Django al crear o inscribir
  const { nombreCompleto, rango, tipo, rut } = useSesion() 
  const API_URL = import.meta.env.VITE_API_URL;

  const rangoActual = rango ? rango.toLowerCase() : ''
  const tipoActual = tipo ? tipo.toLowerCase() : ''

  const esOficial = ['capitán', 'capitan', 'director', 'teniente'].includes(rangoActual) || ['capitán', 'capitan', 'director', 'teniente'].includes(tipoActual)

  const gestiona = esOficial      
  const puedeInscribirse = true 
  const veInscritos = esOficial 

  // INICIAMOS VACÍO: La data ahora vendrá del backend
  const [cursos, setCursos] = useState([])
  const [editando, setEditando] = useState(null)

  // ==========================================
  // 1. GET: OBTENER CURSOS AL CARGAR LA VISTA
  // ==========================================
  useEffect(() => {
    const cargarCursos = async () => {
      try {
        const respuesta = await fetch(`${API_URL}/api/Operacion/cursos/`);
        if (respuesta.ok) {
          const data = await respuesta.json();
          setCursos(data);
        }
      } catch (error) {
        console.error("Error al cargar cursos desde el backend:", error);
      }
    };
    cargarCursos();
  }, [API_URL]);


  // ==========================================
  // 2. POST: INSCRIBIR BOMBERO
  // ==========================================
  const estoyInscrito = (curso) => curso.inscritos?.includes(nombreCompleto)

  const alternarInscripcion = async (idCurso) => {
    const cursoActual = cursos.find(c => c.id_curso === idCurso || c.id === idCurso);
    const yaEsta = estoyInscrito(cursoActual);

    // Si ya está inscrito, se requiere un endpoint DELETE en Django para anular (si lo permites)
    if (yaEsta) {
      alert("Ya estás inscrito en este curso."); 
      return; 
    }

    try {
      // Usamos los mismos nombres que definiste en request.data.get() de tu vista Django
      const respuesta = await fetch(`${API_URL}/api/Operacion/cursos/inscribir/`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_curso: idCurso,
          rut_bombero: rut // Pasamos el RUT desde la sesión
        })
      });

      if (respuesta.ok) {
        // Actualizamos React instantáneamente sin tener que recargar la página
        setCursos((prev) =>
          prev.map((c) => {
            const currId = c.id_curso || c.id;
            if (currId !== idCurso) return c;
            
            const nuevosInscritos = [...(c.inscritos || []), nombreCompleto];
            return {
              ...c,
              inscritos: nuevosInscritos,
              // Si se llenó con esta inscripción, lo cerramos visualmente
              estado: nuevosInscritos.length >= c.cupos ? "CERRADO" : c.estado
            }
          })
        )
      } else {
        const errorData = await respuesta.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error al inscribirse:", error);
    }
  }


  // ==========================================
  // 3. POST / PUT: GUARDAR O EDITAR CURSO
  // ==========================================
  const guardarCurso = async (datos) => {
    const esNuevo = !datos.id && !datos.id_curso;
    
    // CORRECCIÓN DE RUTAS: Apuntamos exactamente a las URLs de tu Django
    const url = esNuevo 
      ? `${API_URL}/api/Operacion/Cursos/crear/` 
      : `${API_URL}/api/Operacion/Cursos/editar/${datos.id || datos.id_curso}/`; // Necesitarás crear esta vista en Django luego
      
    const metodo = esNuevo ? 'POST' : 'PUT';

    const payload = {
      nombre: datos.nombre,
      fecha: datos.fecha, 
      cupos: datos.cupos,
      estado: datos.estado || "ABIERTO",
      oficial_a_cargo: rut 
    };

    try {
      const respuesta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (respuesta.ok) {
        const cursoGuardadoInfo = await respuesta.json(); // Esto recibe {"mensaje": "...", "data": {...}}
        const cursoGuardado = cursoGuardadoInfo.data; // Extraemos la data real

        if (esNuevo) {
          setCursos((prev) => [cursoGuardado, ...prev]);
        } else {
          setCursos((prev) => prev.map((c) => (c.id_curso === cursoGuardado.id_curso ? cursoGuardado : c)));
        }
        setEditando(null);
      } else {
        const errorData = await respuesta.json();
        console.error("Error del backend:", errorData);
        alert("Hubo un problema al guardar el curso en la base de datos. Revisa la consola.");
      }
    } catch (error) {
      console.error("Error al guardar el curso:", error);
    }
  }


  // ==========================================
  // 4. DELETE: ELIMINAR CURSO
  // ==========================================
  const eliminarCurso = async (idCurso) => {
    if (!window.confirm('¿Eliminar este curso? Esta acción no se puede deshacer.')) return
    
    try {
      const respuesta = await fetch(`${API_URL}/cursos/${idCurso}/`, {
        method: 'DELETE'
      });

      if (respuesta.ok) {
        setCursos((prev) => prev.filter((c) => c.id_curso !== idCurso && c.id !== idCurso))
      }
    } catch (error) {
      console.error("Error al eliminar el curso:", error);
    }
  }

  const descargarPDF = (curso) => {
    const creador = getRango(curso.oficial_a_cargo) || { numero: '', nombre: 'Oficial', persona: 'Oficial' }
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
          Inscríbete en los cursos disponibles. Los nombres se revelan cuando el curso completa sus cupos.
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
          // Adaptamos los nombres de variables según tu Django backend
          const idActual = curso.id_curso || curso.id;
          const creador = getRango(curso.oficial_a_cargo) || { numero: '', nombre: 'Oficial', persona: 'Oficial' }
          const listaInscritos = curso.inscritos || [];
          const anotados = listaInscritos.length;
          
          // Verificamos el estado contra la BD de Django y los cupos
          const cerrado = curso.estado === "CERRADO" || anotados >= curso.cupos;
          
          const mostrarLista = cerrado || veInscritos
          const inscrito = estoyInscrito(curso)

          return (
            <article className={`curso-card ${cerrado ? 'curso-card--cerrado' : ''}`} key={idActual}>
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
                {creador.numero ? `${creador.nombre} ${creador.persona}` : creador.persona} abrió este curso
              </p>

              <div className="curso-card__datos">
                <span><b>Fechas:</b> {new Date(curso.fecha).toLocaleString()}</span>
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
                  {listaInscritos.length > 0 ? (
                    <ul>
                      {listaInscritos.map((n, i) => (
                        <li key={i}>{n}</li>
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
                  <button className="btn-mini" onClick={() => descargarPDF(curso)} title="Descargar PDF">
                    <IconoDescargaPDF width={13} /> PDF
                  </button>
                )}
                {puedeInscribirse && (!cerrado || inscrito) && (
                  <button
                    className={`btn-mini ${inscrito ? 'btn-mini--peligro' : 'btn-mini--primario'}`}
                    onClick={() => alternarInscripcion(idActual)}
                  >
                    {inscrito ? 'Anular inscripción' : 'Inscribirme'}
                  </button>
                )}
                {gestiona && (
                  <>
                    <button className="btn-mini" onClick={() => setEditando(curso)}>
                      <IconoLapiz width={13} /> Editar
                    </button>
                    <button className="btn-mini btn-mini--peligro" onClick={() => eliminarCurso(idActual)}>
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