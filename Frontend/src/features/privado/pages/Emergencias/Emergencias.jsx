import { useState } from 'react'
import { useSesion } from '../../context/SesionContext'
import { emergencias as emergenciasData, tiposEmergencia } from '../../../../data/contenidoPublico'
import { IconoFuego, IconoSubir, IconoOjo, IconoReloj, IconoUbicacion, IconoBasura } from '../../../../components/ui/Icono'
import FormEmergencia from './FormEmergencia'
import '../../estilos-panel.css'
import './Emergencias.css'

/**
 * Registro de emergencias (panel privado).
 *
 * Permite agregar la última emergencia atendida, eligiendo el TIPO
 * desde un selector (códigos de llamado 10-X) y agregando una
 * DESCRIPCIÓN y el sector. La más reciente queda destacada arriba.
 *
 * Quién puede registrar: oficialidad (director, capitán, tenientes).
 * El resto visualiza el historial.
 *
 * Alineado con el modelo Emergencia del backend (clave, nombre,
 * descripcion, sector, hora, fecha) para facilitar la conexión.
 *
 * Maqueta: los cambios viven en memoria (se reinician al recargar).
 */
export default function Emergencias() {
  const { rango, tipo } = useSesion()

  const rangoActual = rango ? rango.toLowerCase() : ''
  const tipoActual = tipo ? tipo.toLowerCase() : ''

  // Roles que pueden registrar emergencias.
  const rolesRegistran = ['director', 'capitán', 'capitan', 'teniente']
  const registra =
    rolesRegistran.includes(rangoActual) || rolesRegistran.includes(tipoActual)

  const [emergencias, setEmergencias] = useState(emergenciasData)
  const [registrando, setRegistrando] = useState(false)

  // Registrar una nueva emergencia (queda al inicio de la lista).
  const registrarEmergencia = (datos) => {
    const ahora = new Date()
    const nueva = {
      id: `A-${Math.floor(1000 + Math.random() * 9000)}`,
      fecha: ahora.toISOString().slice(0, 10),
      hora: ahora.toTimeString().slice(0, 5),
      // "clave" combina el código y el nombre del tipo, como el
      // formato que ya usa la plataforma (ej. "10-0 · Incendio...").
      clave: `${datos.claveTipo} · ${datos.nombreTipo}`,
      descripcion: datos.descripcion,
      sector: datos.sector,
    }
    setEmergencias((prev) => [nueva, ...prev])
    setRegistrando(false)
  }

  // Eliminar una emergencia del registro (solo quien registra).
  const eliminarEmergencia = (id) => {
    if (!window.confirm('¿Eliminar este registro de emergencia?')) return
    setEmergencias((prev) => prev.filter((e) => e.id !== id))
  }

  // La más reciente (primera de la lista).
  const ultima = emergencias[0]
  const resto = emergencias.slice(1)

  return (
    <>
      <div className="vista-head">
        <h1>Emergencias</h1>
        <p>Registro de las últimas emergencias atendidas por la compañía.</p>
      </div>

      {registra ? (
        <div className="emergencias-acciones">
          <button className="btn btn-primario" onClick={() => setRegistrando(true)}>
            <IconoSubir width={16} /> Registrar emergencia
          </button>
        </div>
      ) : (
        <div className="nota-info">
          <IconoOjo width={18} />
          Tu rango puede consultar el historial de emergencias.
        </div>
      )}

      {/* Última emergencia destacada */}
      {ultima && (
        <div className="ultima-emergencia">
          <span className="ultima-emergencia__rotulo">
            <IconoFuego width={16} /> Última emergencia
          </span>
          <h2 className="ultima-emergencia__clave">{ultima.clave}</h2>
          {ultima.descripcion && (
            <p className="ultima-emergencia__desc">{ultima.descripcion}</p>
          )}
          <div className="ultima-emergencia__meta">
            <span><IconoReloj width={14} /> {ultima.fecha} · {ultima.hora} hrs</span>
            <span><IconoUbicacion width={14} /> {ultima.sector}</span>
            {registra && (
              <button className="ultima-emergencia__eliminar" onClick={() => eliminarEmergencia(ultima.id)}>
                <IconoBasura width={13} /> Eliminar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Historial del resto */}
      <div className="panel-box">
        <div className="panel-box__titulo">Historial reciente</div>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead>
              <tr>
                <th>Clave</th>
                <th>Descripción</th>
                <th>Sector</th>
                <th>Fecha</th>
                <th>Hora</th>
                {registra && <th style={{ textAlign: 'right' }}>Acción</th>}
              </tr>
            </thead>
            <tbody>
              {resto.map((e) => (
                <tr key={e.id}>
                  <td className="tabla__nombre">{e.clave}</td>
                  <td>{e.descripcion || '—'}</td>
                  <td>{e.sector}</td>
                  <td>{e.fecha}</td>
                  <td>{e.hora}</td>
                  {registra && (
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn-mini btn-mini--peligro" onClick={() => eliminarEmergencia(e.id)}>
                        <IconoBasura width={13} /> Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {resto.length === 0 && (
                <tr><td colSpan={registra ? 6 : 5} style={{ textAlign: 'center', color: 'var(--gris-tenue)' }}>
                  No hay más registros.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {registrando && (
        <FormEmergencia
          tipos={tiposEmergencia}
          onRegistrar={registrarEmergencia}
          onCerrar={() => setRegistrando(false)}
        />
      )}
    </>
  )
}
