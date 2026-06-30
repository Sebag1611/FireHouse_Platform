import { IconoEscudo, IconoFuego, IconoCheck } from '../components/Iconos'
import './Nosotros.css'

const especialidades = [
  {
    titulo: 'Materiales Peligrosos (HazMat)',
    texto: 'Respuesta especializada ante incidentes con sustancias peligrosas.',
  },
  {
    titulo: 'Rescate Vehicular Ligero',
    texto: 'Extricación de víctimas en accidentes de tránsito con equipo hidráulico.',
  },
  {
    titulo: 'Búsqueda y Rescate USAR K9',
    texto: 'Búsqueda de personas vivas mediante unidad canina certificada.',
  },
  {
    titulo: 'Combate de Incendios y Abastecimiento',
    texto: 'Control de incendios estructurales y soporte de agua en gran magnitud.',
  },
]

const hitos = [
  { anio: '1957', texto: 'Primera reunión impulsada por Juan Ardiles, Juan Ciglic y Pedro Vergara para proteger el sector norte de Calama.' },
  { anio: '1958', texto: 'Fundación oficial el 18 de mayo, en el sector donde funcionaba Radio Calama.' },
  { anio: 'Hoy', texto: 'Compañía con cuatro especialidades operativas y vocación de servicio a la comunidad.' },
]

export default function Nosotros() {
  return (
    <>
      <header className="page-head">
        <div className="contenedor">
          <span className="eyebrow">Identidad institucional</span>
          <h1>Nosotros</h1>
          <p>
            La Tercera Compañía de Bomberos de Calama: más de seis décadas de
            servicio, disciplina y compromiso con la comunidad.
          </p>
        </div>
      </header>

      <section className="seccion">
        <div className="contenedor nosotros__intro">
          <div className="nosotros__texto">
            <h2 className="titulo-seccion">Unión es Fuerza</h2>
            <p>
              La Tercera Compañía de Bomberos de Calama tuvo sus orígenes el 20
              de agosto de 1957, fecha de la primera reunión destinada a
              concretar su creación. La iniciativa fue impulsada por Juan
              Ardiles Carrasco, Juan Ciglic y Pedro Vergara Keller, quienes
              identificaron la necesidad de fortalecer la protección del sector
              norte de la ciudad.
            </p>
            <p>
              Fundada oficialmente el 18 de mayo de 1958, la compañía se
              consolidó como una organización comprometida con el servicio a la
              comunidad y el desarrollo del voluntariado bomberil. Desde sus
              inicios, su propósito ha sido brindar una respuesta eficiente ante
              emergencias en una zona en constante crecimiento.
            </p>
          </div>

          <aside className="nosotros__valores">
            <div className="valor-caja">
              <IconoEscudo width={28} />
              <h3>Misión</h3>
              <p>
                Proteger la vida, los bienes y el medio ambiente de Calama
                mediante una respuesta oportuna, eficiente y profesional ante
                emergencias.
              </p>
            </div>
            <div className="valor-caja">
              <IconoFuego width={28} />
              <h3>Visión</h3>
              <p>
                Ser una compañía referente a nivel regional por su excelencia
                operativa, especialización técnica y compromiso con la
                comunidad.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="seccion seccion--alt">
        <div className="contenedor">
          <span className="eyebrow">Capacidades operativas</span>
          <h2 className="titulo-seccion">Nuestras especialidades</h2>
          <div className="especialidades-grid">
            {especialidades.map((e) => (
              <article className="especialidad" key={e.titulo}>
                <IconoCheck width={20} />
                <div>
                  <h3>{e.titulo}</h3>
                  <p>{e.texto}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor">
          <span className="eyebrow">Trayectoria</span>
          <h2 className="titulo-seccion">Nuestra historia</h2>
          <ol className="timeline">
            {hitos.map((h) => (
              <li key={h.anio} className="timeline__item">
                <span className="timeline__anio">{h.anio}</span>
                <p>{h.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
