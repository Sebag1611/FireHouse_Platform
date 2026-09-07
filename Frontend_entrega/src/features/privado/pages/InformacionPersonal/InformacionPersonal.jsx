import { useState } from 'react'
import { useSesion } from '../../context/SesionContext'
import {
  bomberos as bomberosData,
  estadosDisponibilidad,
  regimenesLaborales,
} from '../../../../data/personal'
import { getRango } from '../../../../data/roles'
import {
  IconoPersona, IconoCorreo, IconoUbicacion, IconoReloj, IconoCalendario,
} from '../../../../components/ui/Icono'
import '../../estilos-panel.css'
import './InformacionPersonal.css'

/**
 * Módulo de información personal.
 *
 * Muestra la ficha de cada integrante: datos de contacto, rango,
 * tipo de sangre, disponibilidad y — lo pedido — su RÉGIMEN LABORAL
 * (5x2, 7x7, 14x14 o personalizado), relevante en zona minera para
 * saber cuándo está en faena o disponible.
 *
 * Se puede buscar por nombre y filtrar por régimen. La oficialidad
 * ve a todo el personal; el resto puede ver la información general.
 *
 * Maqueta: datos fijos. Con backend, vendrían de la API.
 */
export default function InformacionPersonal() {
  const [personal] = useState(bomberosData)
  const [busqueda, setBusqueda] = useState('')
  const [filtroRegimen, setFiltroRegimen] = useState('todos')
  // Ficha expandida (id de la persona) o null.
  const [expandido, setExpandido] = useState(null)

  // Aplica búsqueda por nombre y filtro por régimen.
  const filtrados = personal.filter((p) => {
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const coincideRegimen = filtroRegimen === 'todos' || p.regimen === filtroRegimen
    return coincideNombre && coincideRegimen
  })

  return (
    <>
      <div className="vista-head">
        <h1>Información personal</h1>
        <p>Ficha completa de cada integrante: contacto, régimen laboral y datos generales. Para cambiar el estado operativo del momento, usa "Disponibilidad".</p>
      </div>

      {/* Filtros */}
      <div className="info-filtros">
        <input
          className="info-buscador"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre..."
        />
        <select
          className="info-filtro-regimen"
          value={filtroRegimen}
          onChange={(e) => setFiltroRegimen(e.target.value)}
        >
          <option value="todos">Todos los regímenes</option>
          {Object.keys(regimenesLaborales).map((clave) => (
            <option key={clave} value={clave}>
              {regimenesLaborales[clave].etiqueta}
            </option>
          ))}
        </select>
      </div>

      {/* Fichas */}
      <div className="info-grid">
        {filtrados.map((p) => {
          const rangoInfo = getRango(p.rango)
          const disp = estadosDisponibilidad[p.disponibilidad] ?? estadosDisponibilidad.libre
          const reg = regimenesLaborales[p.regimen] ?? regimenesLaborales['5x2']
          const abierto = expandido === p.id
          return (
            <article className={`info-card ${abierto ? 'info-card--abierto' : ''}`} key={p.id}>
              <button
                className="info-card__cabecera"
                onClick={() => setExpandido(abierto ? null : p.id)}
              >
                <span className="info-card__avatar"><IconoPersona width={26} /></span>
                <span className="info-card__id">
                  <span className="info-card__nombre">{p.nombre}</span>
                  <span className="info-card__rango">
                    {rangoInfo.numero ? `${rangoInfo.numero} · ${rangoInfo.nombre}` : rangoInfo.nombre}
                  </span>
                </span>
                <span className="info-card__regimen" title="Régimen laboral">
                  {reg.etiqueta}
                </span>
              </button>

              {abierto && (
                <div className="info-card__detalle">
                  <div className="info-dato">
                    <IconoReloj width={15} />
                    <span><b>Régimen:</b> {reg.etiqueta} — {reg.descripcion}</span>
                  </div>
                  <div className="info-dato">
                    <span className="info-dato__disp" style={{ '--c': disp.color }}>●</span>
                    <span><b>Disponibilidad:</b> {disp.etiqueta}</span>
                  </div>
                  <div className="info-dato">
                    <IconoCorreo width={15} />
                    <span><b>Correo:</b> {p.correo}</span>
                  </div>
                  <div className="info-dato">
                    <IconoUbicacion width={15} />
                    <span><b>Dirección:</b> {p.direccion}</span>
                  </div>
                  <div className="info-dato">
                    <IconoCalendario width={15} />
                    <span><b>Ingreso:</b> {p.ingreso} · <b>Edad:</b> {p.edad}</span>
                  </div>
                  <div className="info-dato">
                    <span className="info-dato__sangre">🩸</span>
                    <span><b>Tipo de sangre:</b> {p.tipoSangre} · <b>Tel:</b> {p.telefono}</span>
                  </div>
                </div>
              )}
            </article>
          )
        })}
        {filtrados.length === 0 && (
          <div className="panel-box info-vacio">
            No se encontraron integrantes con esos criterios.
          </div>
        )}
      </div>
    </>
  )
}
