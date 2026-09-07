import { useState } from 'react'
import { useSesion } from '../../context/SesionContext'
import { bomberos as bomberosData, estadosDisponibilidad } from '../../../../data/personal'
import { getRango } from '../../../../data/roles'
import { IconoGrupo } from '../../../../components/ui/Icono'
import '../../estilos-panel.css'
import './Disponibilidad.css'

/**
 * Módulo de visualización de disponibilidad del personal.
 *
 * Muestra a cada integrante con su estado de disponibilidad:
 *   - En Laboral: en su trabajo, disponibilidad limitada.
 *   - Libre: disponible para acudir.
 *   - Con excusa: no disponible, justificado.
 *
 * Un resumen arriba cuenta cuántos hay en cada estado. La oficialidad
 * puede cambiar el estado de cualquiera; el resto puede cambiar el
 * suyo (se identifica por nombre en la maqueta).
 *
 * Maqueta: los cambios viven en memoria (se reinician al recargar).
 */
export default function Disponibilidad() {
  const { rango, tipo, nombreCompleto } = useSesion()

  const rangoActual = rango ? rango.toLowerCase() : ''
  const tipoActual = tipo ? tipo.toLowerCase() : ''

  // Oficialidad puede cambiar la disponibilidad de cualquiera.
  const rolesGestores = ['director', 'capitán', 'capitan', 'teniente']
  const gestionaTodos =
    rolesGestores.includes(rangoActual) || rolesGestores.includes(tipoActual)

  const [personal, setPersonal] = useState(bomberosData)

  // Cambia la disponibilidad de una persona.
  const cambiarDisponibilidad = (id, nuevaDisp) => {
    setPersonal((prev) =>
      prev.map((p) => (p.id === id ? { ...p, disponibilidad: nuevaDisp } : p))
    )
  }

  // ¿Puede el usuario actual cambiar la disponibilidad de esta persona?
  // Los gestores, a cualquiera; los demás, solo la propia (por nombre).
  const puedeCambiar = (persona) =>
    gestionaTodos || persona.nombre === nombreCompleto

  // Contadores por estado para el resumen.
  const claves = Object.keys(estadosDisponibilidad)
  const conteo = claves.reduce((acc, clave) => {
    acc[clave] = personal.filter((p) => p.disponibilidad === clave).length
    return acc
  }, {})

  return (
    <>
      <div className="vista-head">
        <h1>Disponibilidad</h1>
        <p>Estado operativo del personal en este momento. Para ver la ficha completa de cada integrante, usa "Información personal".</p>
      </div>

      {/* Resumen por estado */}
      <div className="disp-resumen">
        {claves.map((clave) => {
          const est = estadosDisponibilidad[clave]
          return (
            <div className="disp-resumen__card" key={clave} style={{ '--c': est.color }}>
              <span className="disp-resumen__num">{conteo[clave]}</span>
              <span className="disp-resumen__label">{est.etiqueta}</span>
            </div>
          )
        })}
      </div>

      {/* Listado del personal */}
      <div className="panel-box">
        <div className="panel-box__titulo">
          <span><IconoGrupo width={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Personal ({personal.length})</span>
        </div>

        <div className="disp-lista">
          {personal.map((p) => {
            const rangoInfo = getRango(p.rango)
            const est = estadosDisponibilidad[p.disponibilidad] ?? estadosDisponibilidad.libre
            return (
              <div className="disp-fila" key={p.id}>
                <div className="disp-fila__persona">
                  <span className="disp-fila__nombre">{p.nombre}</span>
                  <span className="disp-fila__rango">
                    {rangoInfo.numero ? `${rangoInfo.numero} · ${rangoInfo.nombre}` : rangoInfo.nombre}
                  </span>
                </div>

                {/* Estado actual + selector si puede cambiarlo */}
                {puedeCambiar(p) ? (
                  <select
                    className="disp-fila__selector"
                    value={p.disponibilidad}
                    onChange={(e) => cambiarDisponibilidad(p.id, e.target.value)}
                    style={{ '--c': est.color }}
                  >
                    {claves.map((clave) => (
                      <option key={clave} value={clave}>
                        {estadosDisponibilidad[clave].etiqueta}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="disp-fila__badge" style={{ '--c': est.color }}>
                    {est.etiqueta}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
