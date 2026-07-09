import { useState, useEffect } from 'react'
import { ESTADOS_OPERATIVOS } from '../../../../data/contenidoPublico'
import EstadoBadge from '../../../../components/ui/EstadoBadge'
import { IconoCamion } from '../../../../components/ui/Icono'
import './Unidades.css'

const API_URL = import.meta.env.VITE_API_URL

const filtros = [
  { clave: 'todos', etiqueta: 'Todas' },
  { clave: 'disponible', etiqueta: 'Disponibles' },
  { clave: 'emergencia', etiqueta: 'En emergencia' },
  { clave: 'servicio', etiqueta: 'En servicio' },
  { clave: 'taller', etiqueta: 'Fuera de servicio' },
]

export default function Unidades() {
  const [filtro, setFiltro] = useState('todos')
  const [unidades, setUnidades] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const obtenerUnidades = async () => {
      try {
        const respuesta = await fetch(`${API_URL}/api/Operacion/MaterialMayor/listar/`)
        if (!respuesta.ok) throw new Error('Error al obtener las unidades.')
        const datos = await respuesta.json()
        setUnidades(datos)
      } catch (err) {
        setError('No se pudieron cargar las unidades. Intenta más tarde.')
      } finally {
        setCargando(false)
      }
    }

    obtenerUnidades()
  }, [])

  const lista =
    filtro === 'todos'
      ? unidades
      : unidades.filter((u) => u.estado === filtro)

  return (
    <>
      <header className="page-head">
        <div className="contenedor">
          <span className="eyebrow">Catálogo de material mayor</span>
          <h1>Nuestras unidades</h1>
          <p>
            Equipamiento operativo de la 3ra Compañía. Cada carro muestra su
            especialidad, características técnicas y disponibilidad actual.
          </p>
        </div>
      </header>

      <section className="seccion">
        <div className="contenedor">
          <div className="leyenda">
            {Object.entries(ESTADOS_OPERATIVOS).map(([k, v]) => (
              <span className="leyenda__item" key={k}>
                <i style={{ background: v.color }} /> {v.etiqueta}
              </span>
            ))}
          </div>

          <div className="filtros" role="tablist" aria-label="Filtrar unidades">
            {filtros.map((f) => (
              <button
                key={f.clave}
                role="tab"
                aria-selected={filtro === f.clave}
                className={`filtros__btn ${
                  filtro === f.clave ? 'filtros__btn--activo' : ''
                }`}
                onClick={() => setFiltro(f.clave)}
              >
                {f.etiqueta}
              </button>
            ))}
          </div>

          {cargando ? (
            <p className="vacio">Cargando unidades...</p>
          ) : error ? (
            <p className="vacio">{error}</p>
          ) : lista.length === 0 ? (
            <p className="vacio">No hay unidades en este estado por ahora.</p>
          ) : (
            <div className="unidades-grid">
              {lista.map((u) => (
                <article className="unidad-card" key={u.id_material}>
                  <div className="unidad-card__media">
                    <IconoCamion width={48} />
                    <span className="unidad-card__codigo">{u.id_material}</span>
                  </div>
                  <div className="unidad-card__cuerpo">
                    <div className="unidad-card__top">
                      <h3>{u.nombre}</h3>
                      <EstadoBadge estado={u.estado} />
                    </div>
                    <span className="unidad-card__tipo">{u.especialidad}</span>
                    <p>{u.descripcion}</p>
                    <dl className="unidad-card__specs">
                      <div>
                        <dt>Marca</dt>
                        <dd>{u.marca}</dd>
                      </div>
                      <div>
                        <dt>Año</dt>
                        <dd>{u.anio}</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}