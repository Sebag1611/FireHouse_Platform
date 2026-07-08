import { Link } from 'react-router-dom'
import {
  turnoActual,
  emergencias,
  unidades,
  noticias,
} from '../../../../data/contenidoPublico'
import EstadoBadge from '../../../../components/ui/EstadoBadge'
import {
  IconoFlecha,
  IconoReloj,
  IconoCamion,
  IconoPersona,
  IconoCorreo,
  IconoCasco,
  IconoFuego,
} from '../../../../components/ui/Icono'
import './Inicio.css'

export default function Inicio() {
  const disponibles = unidades.filter((u) => u.estado === 'disponible').length

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="hero__fondo" aria-hidden="true" />
        <div className="contenedor hero__contenido">
          <span className="hero__eyebrow">
            3ra Compañía de Bomberos de Calama · Fundada 1958
          </span>
          <h1 className="hero__titulo">
            Unión es <span>Fuerza</span>
          </h1>
          <p className="hero__bajada">
            Plataforma oficial de la Tercera Compañía. Conoce nuestra historia,
            revisa el material mayor, mantente al tanto de las emergencias y
            únete como voluntario al servicio de la comunidad.
          </p>
          <div className="hero__acciones">
            <Link to="/postular" className="btn btn-primario">
              Quiero ser voluntario <IconoFlecha width={18} />
            </Link>
            <Link to="/unidades" className="btn btn-fantasma">
              Ver material mayor
            </Link>
          </div>

          <dl className="hero__stats">
            <div>
              <dt>68</dt>
              <dd>Años de servicio</dd>
            </div>
            <div>
              <dt>4</dt>
              <dd>Especialidades operativas</dd>
            </div>
            <div>
              <dt>{disponibles}</dt>
              <dd>Unidades disponibles ahora</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ---------- BANNER DE TURNO (HU-08) ---------- */}
      <section className="contenedor">
        <div className="turno-banner" role="status">
          <div className="turno-banner__izq">
            <IconoReloj width={20} />
            <span className="turno-banner__rotulo">Turno activo</span>
          </div>
          <div className="turno-banner__centro">
            <strong>{turnoActual.tipo}</strong>
            <span>{turnoActual.horario}</span>
          </div>
          <span className="turno-banner__pulso">EN SERVICIO</span>
        </div>
      </section>

      {/* ---------- ACCESOS / MÓDULOS PÚBLICOS ---------- */}
      <section className="seccion">
        <div className="contenedor">
          <span className="eyebrow">Portal público</span>
          <h2 className="titulo-seccion">Todo en un solo lugar</h2>
          <p className="subtitulo-seccion">
            Acceso directo a la información institucional de la compañía y a los
            canales de participación ciudadana.
          </p>

          <div className="accesos-grid">
            {[
              {
                icono: <IconoCasco width={26} />,
                titulo: 'Nuestra historia',
                texto:
                  'Trayectoria, valores y especialidades de la 3ra Compañía.',
                a: '/nosotros',
                cta: 'Conocer la compañía',
              },
              {
                icono: <IconoCamion width={26} />,
                titulo: 'Catálogo de material mayor',
                texto:
                  'Unidades operativas, características técnicas y disponibilidad.',
                a: '/unidades',
                cta: 'Ver unidades',
              },
              {
                icono: <IconoPersona width={26} />,
                titulo: 'Postulación de voluntarios',
                texto:
                  'Envía tu solicitud de ingreso y antecedentes en línea.',
                a: '/postular',
                cta: 'Postular ahora',
                destacado: true,
              },
              {
                icono: <IconoCorreo width={26} />,
                titulo: 'Formulario de contacto',
                texto:
                  'Realiza consultas o solicitudes administrativas a la institución.',
                a: '/contacto',
                cta: 'Escribir mensaje',
              },
            ].map((c) => (
              <Link
                to={c.a}
                key={c.titulo}
                className={`acceso-card ${
                  c.destacado ? 'acceso-card--destacado' : ''
                }`}
              >
                <span className="acceso-card__icono">{c.icono}</span>
                <h3>{c.titulo}</h3>
                <p>{c.texto}</p>
                <span className="acceso-card__cta">
                  {c.cta} <IconoFlecha width={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- EMERGENCIAS RECIENTES (HU-06) ---------- */}
      <section className="seccion seccion--alt" id="emergencias">
        <div className="contenedor emergencias">
          <div className="emergencias__head">
            <div>
              <span className="eyebrow">
                <IconoFuego width={15} /> Transparencia operativa
              </span>
              <h2 className="titulo-seccion">Emergencias recientes</h2>
              <p className="subtitulo-seccion">
                Últimos llamados atendidos por la compañía. Por seguridad, no se
                publican direcciones exactas.
              </p>
            </div>
          </div>

          <div className="emergencias__tabla" role="table">
            <div className="emergencias__fila emergencias__fila--head" role="row">
              <span>Clave</span>
              <span>Sector</span>
              <span>Fecha</span>
              <span>Hora</span>
            </div>
            {emergencias.map((e) => (
              <div className="emergencias__fila" role="row" key={e.id}>
                <span className="emergencias__clave">
                  <i aria-hidden="true" /> {e.clave}
                </span>
                <span>{e.sector}</span>
                <span>{formatearFecha(e.fecha)}</span>
                <span className="emergencias__hora">{e.hora}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- VISTA RÁPIDA DE UNIDADES ---------- */}
      <section className="seccion">
        <div className="contenedor">
          <span className="eyebrow">Material mayor</span>
          <h2 className="titulo-seccion">Nuestras unidades</h2>
          <div className="unidades-preview">
            {unidades.slice(0, 3).map((u) => (
              <article className="unidad-mini" key={u.id}>
                <div className="unidad-mini__id">{u.id}</div>
                <h3>{u.nombre}</h3>
                <p>{u.tipo}</p>
                <EstadoBadge estado={u.estado} />
              </article>
            ))}
          </div>
          <Link to="/unidades" className="btn btn-fantasma" style={{ marginTop: 28 }}>
            Ver catálogo completo <IconoFlecha width={16} />
          </Link>
        </div>
      </section>

      {/* ---------- NOTICIAS DESTACADAS ---------- */}
      <section className="seccion seccion--alt">
        <div className="contenedor">
          <span className="eyebrow">Comunidad</span>
          <h2 className="titulo-seccion">Últimas noticias</h2>
          <div className="noticias-preview">
            {noticias.slice(0, 2).map((n) => (
              <article className="noticia-mini" key={n.id}>
                <span className="noticia-mini__cat">{n.categoria}</span>
                <h3>{n.titulo}</h3>
                <p>{n.resumen}</p>
                <time>{formatearFecha(n.fecha)}</time>
              </article>
            ))}
          </div>
          <Link to="/noticias" className="btn btn-fantasma" style={{ marginTop: 28 }}>
            Ver todas las noticias <IconoFlecha width={16} />
          </Link>
        </div>
      </section>

      {/* ---------- CTA FINAL ---------- */}
      <section className="cta-final">
        <div className="contenedor cta-final__caja">
          <h2>¿Listo para servir a tu comunidad?</h2>
          <p>
            Postular es el primer paso. Únete a una compañía con vocación,
            disciplina y más de seis décadas protegiendo Calama.
          </p>
          <Link to="/postular" className="btn btn-primario">
            Iniciar postulación <IconoFlecha width={18} />
          </Link>
        </div>
      </section>
    </>
  )
}

function formatearFecha(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
