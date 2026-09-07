import { IconoPersona, IconoEscudo } from '../../../../components/ui/Icono'
import './DirectoresHonorarios.css'

/**
 * Página pública: Directores Honorarios de la compañía.
 *
 * Muestra a los directores honorarios con su foto y una breve
 * descripción de su cargo/aporte. Adaptado del sitio oficial de la
 * compañía, con el estilo de la plataforma.
 *
 * NOTA sobre las fotos: mientras no lleguen las imágenes oficiales,
 * cada tarjeta muestra un marco con silueta (placeholder). Cuando se
 * entreguen las fotos, basta con poner su ruta en el campo "foto"
 * de cada director (ver más abajo) y se reemplaza la silueta.
 */

// Datos de los directores honorarios.
// Para colocar una foto real: foto: '/directores/nombre.jpg'
// (dejar la imagen en la carpeta public/directores/ del proyecto).
const directores = [
  {
    nombre: 'Francisco J. Barrios Casas',
    cargo: 'Superintendente',
    descripcion:
      'Máxima autoridad honoraria de la compañía, reconocido por su trayectoria y servicio a la institución.',
    foto: null,
  },
  {
    nombre: 'Juan Henríquez Morales',
    cargo: 'Director Honorario',
    descripcion:
      'Distinguido por su compromiso y aporte al desarrollo de la Tercera Compañía a lo largo de los años.',
    foto: null,
  },
  {
    nombre: 'Iván Villagra Bravo',
    cargo: 'Director Honorario',
    descripcion:
      'Reconocido por su entrega y dedicación al servicio bomberil y a la comunidad calameña.',
    foto: null,
  },
  {
    nombre: 'Rubén Villagra Bravo',
    cargo: 'Director Honorario',
    descripcion:
      'Honrado por su vocación de servicio y su contribución al legado de la compañía.',
    foto: null,
  },
]

export default function DirectoresHonorarios() {
  return (
    <>
      <header className="page-head">
        <div className="contenedor">
          <span className="eyebrow">
            <IconoEscudo width={15} /> Reconocimiento institucional
          </span>
          <h1>Directores Honorarios</h1>
          <p>
            Personas distinguidas por su trayectoria, entrega y aporte al legado
            de la Tercera Compañía de Bomberos de Calama.
          </p>
        </div>
      </header>

      <section className="seccion">
        <div className="contenedor">
          <div className="honorarios-grid">
            {directores.map((d) => (
              <article className="honorario" key={d.nombre}>
                {/* Foto o marco con silueta (placeholder). */}
                <div className="honorario__foto">
                  {d.foto ? (
                    <img src={d.foto} alt={d.nombre} />
                  ) : (
                    <div className="honorario__silueta" aria-label="Foto pendiente">
                      <IconoPersona width={54} />
                      <span>Foto pendiente</span>
                    </div>
                  )}
                </div>

                <div className="honorario__cuerpo">
                  <span className="honorario__cargo">{d.cargo}</span>
                  <h2 className="honorario__nombre">{d.nombre}</h2>
                  <p className="honorario__desc">{d.descripcion}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
