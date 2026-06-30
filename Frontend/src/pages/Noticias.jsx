import { noticias } from '../data/contenido'
import './Noticias.css'

function formatearFecha(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default function Noticias() {
  const [destacada, ...resto] = noticias

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
          {/* Noticia destacada */}
          <article className="noticia-destacada">
            <div className="noticia-destacada__media" aria-hidden="true">
              <span>{destacada.categoria}</span>
            </div>
            <div className="noticia-destacada__cuerpo">
              <span className="noticia-destacada__cat">
                {destacada.categoria}
              </span>
              <h2>{destacada.titulo}</h2>
              <p>{destacada.resumen}</p>
              <time>{formatearFecha(destacada.fecha)}</time>
            </div>
          </article>

          {/* Resto de noticias */}
          <div className="noticias-grid">
            {resto.map((n) => (
              <article className="noticia-card" key={n.id}>
                <div className="noticia-card__media" aria-hidden="true" />
                <div className="noticia-card__cuerpo">
                  <span className="noticia-card__cat">{n.categoria}</span>
                  <h3>{n.titulo}</h3>
                  <p>{n.resumen}</p>
                  <time>{formatearFecha(n.fecha)}</time>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
