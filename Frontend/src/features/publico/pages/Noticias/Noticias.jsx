import { useState, useEffect } from 'react'
import './Noticias.css'

function formatearFecha(iso) {
  if (!iso) return ''
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default function Noticias() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  const [noticiasPublicas, setNoticiasPublicas] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarNoticias = async () => {
      try {
        setCargando(true)
        const res = await fetch(`${API_URL}/api/Administracion/noticias/`)
        if (res.ok) {
          const data = await res.json()
          
          // 1. Filtrar solo las noticias de categoría público
          const filtradas = data.filter((n) => {
            const cat = (n.categoria || '').toLowerCase().trim()
            return cat === 'público' || cat === 'publico'
          })

          // 2. Tomar únicamente las 3 más recientes (las demás quedan guardadas en la BD)
          setNoticiasPublicas(filtradas.slice(0, 3))
        }
      } catch (error) {
        console.error('Error al cargar noticias públicas:', error)
      } finally {
        setCargando(false)
      }
    }

    cargarNoticias()
  }, [API_URL])

  // Desestructuración: 1 destacada principal y hasta 2 secundarias
  const [destacada, ...resto] = noticiasPublicas

  return (
    <>
      <header className="page-head">
        <div className="contenedor">
          <span className="eyebrow">Comunidad</span>
          <h1>Noticias</h1>
          <p>
            Actividades, novedades y comunicados de la Tercera Compañía de
            Bomberos de Calama.
          </p>
        </div>
      </header>

      <section className="seccion">
        <div className="contenedor">
          {cargando ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-texto-apagado, #888)' }}>
              Cargando noticias...
            </div>
          ) : !destacada ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-texto-apagado, #888)' }}>
              No hay noticias públicas disponibles en este momento.
            </div>
          ) : (
            <>
              {/* Noticia 1: La más reciente (destacada grande) */}
              <article className="noticia-destacada">
                <div 
                  className="noticia-destacada__media" 
                  aria-hidden="true"
                  style={destacada.foto ? { backgroundImage: `url(${destacada.foto})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                  {!destacada.foto && <span>{destacada.categoria}</span>}
                </div>
                <div className="noticia-destacada__cuerpo">
                  <span className="noticia-destacada__cat">
                    {destacada.categoria}
                  </span>
                  <h2>{destacada.titulo}</h2>
                  <p>{destacada.cuerpo || destacada.resumen}</p>
                  <time>{formatearFecha(destacada.fecha)}</time>
                </div>
              </article>

              {/* Noticias 2 y 3: Las siguientes dos en el grid */}
              {resto.length > 0 && (
                <div className="noticias-grid">
                  {resto.map((n) => (
                    <article className="noticia-card" key={n.id}>
                      <div 
                        className="noticia-card__media" 
                        aria-hidden="true"
                        style={n.foto ? { backgroundImage: `url(${n.foto})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                      />
                      <div className="noticia-card__cuerpo">
                        <span className="noticia-card__cat">{n.categoria}</span>
                        <h3>{n.titulo}</h3>
                        <p>{n.cuerpo || n.resumen}</p>
                        <time>{formatearFecha(n.fecha)}</time>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}