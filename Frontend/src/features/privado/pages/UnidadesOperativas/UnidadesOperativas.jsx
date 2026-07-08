import { useState } from 'react'
import { unidades as unidadesData, ESTADOS_OPERATIVOS } from '../../../../data/contenidoPublico'
import { useSesion } from '../../context'
import { PERMISOS } from '../../../../data/roles'
import { IconoUbicacion } from '../../../../components/ui/Icono'
import '../../estilos-panel.css'
import './UnidadesOperativas.css'

const OPCIONES = ['disponible', 'emergencia', 'servicio', 'taller']

export default function UnidadesOperativas() {
  const { puede } = useSesion()
  const [unidades, setUnidades] = useState(unidadesData)
  const puedeCambiar = puede(PERMISOS.CAMBIAR_ESTADO_UNIDAD)
  const puedeMover = puede(PERMISOS.MOVER_MATERIAL)

  const cambiarEstado = (id, nuevo) => {
    setUnidades((prev) =>
      prev.map((u) => (u.id === id ? { ...u, estado: nuevo } : u))
    )
  }

  return (
    <>
      <div className="vista-head">
        <h1>Material Mayor</h1>
        <p>Pizarra operativa: estado y ubicación de las unidades en tiempo real.</p>
      </div>

      <div className="unidades-panel-grid">
        {unidades.map((u) => {
          const est = ESTADOS_OPERATIVOS[u.estado] ?? ESTADOS_OPERATIVOS.taller
          return (
            <div className="unidad-panel-card" key={u.id}>
              <div className="unidad-panel-card__head">
                <span className="unidad-panel-card__id">{u.id}</span>
                <span
                  className="unidad-panel-card__estado"
                  style={{ '--c': est.color }}
                >
                  <i /> {est.etiqueta}
                </span>
              </div>

              <h3>{u.nombre}</h3>
              <span className="unidad-panel-card__tipo">{u.tipo}</span>

              {/* Mapa simulado (carcasa) */}
              <div className="mapa-mock">
                <div className="mapa-mock__grid" />
                <span className="mapa-mock__pin" style={{ color: est.color }}>
                  <IconoUbicacion width={26} />
                </span>
                <span className="mapa-mock__label">
                  {puedeMover ? 'Cuartel · sector norte' : 'Ubicación registrada'}
                </span>
              </div>

              {/* Cambiar estado (según permiso) */}
              {puedeCambiar ? (
                <div className="unidad-panel-card__acciones">
                  <label>Cambiar estado</label>
                  <select
                    value={u.estado}
                    onChange={(e) => cambiarEstado(u.id, e.target.value)}
                  >
                    {OPCIONES.map((o) => (
                      <option key={o} value={o}>
                        {ESTADOS_OPERATIVOS[o].etiqueta}
                      </option>
                    ))}
                  </select>
                  {puedeMover && (
                    <button className="btn-mini" style={{ marginTop: 8, width: '100%' }}>
                      <IconoUbicacion width={14} /> Mover ubicación
                    </button>
                  )}
                </div>
              ) : (
                <p className="unidad-panel-card__solo-lectura">
                  Solo lectura para tu rango.
                </p>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
