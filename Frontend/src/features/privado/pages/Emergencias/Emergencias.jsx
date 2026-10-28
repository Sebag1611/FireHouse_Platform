import { useState, useEffect } from 'react'
import { useSesion } from '../../context/SesionContext'
import { tiposEmergencia } from '../../../../data/contenidoPublico'
import { IconoFuego, IconoSubir, IconoOjo, IconoReloj, IconoUbicacion, IconoBasura } from '../../../../components/ui/Icono'
import FormEmergencia from './FormEmergencia'
import '../../estilos-panel.css'
import './Emergencias.css'

export default function Emergencias() {
  const { rango, tipo } = useSesion()
  const API_URL = import.meta.env.VITE_API_URL

  const rangoActual = rango ? rango.toLowerCase() : ''
  const tipoActual = tipo ? tipo.toLowerCase() : ''
  const rolesRegistran = ['director', 'capitán', 'capitan', 'teniente']
  const registra = rolesRegistran.includes(rangoActual) || rolesRegistran.includes(tipoActual)

  const [emergencias, setEmergencias] = useState([])
  const [registrando, setRegistrando] = useState(false)

  // 1. OBTENER EMERGENCIAS
  const cargarEmergencias = async () => {
    try {
      const res = await fetch(`${API_URL}/api/Operacion/emergencias/listar/`)
      if (res.ok) {
        const data = await res.json()
        setEmergencias(data)
      }
    } catch (error) {
      console.error("Error al cargar emergencias:", error)
    }
  }

  useEffect(() => {
    cargarEmergencias()
  }, [API_URL])

  // 2. REGISTRAR EMERGENCIA (POST)
  const registrarEmergencia = async (datos) => {
    const ahora = new Date()
    const payload = {
      ...datos,
      fecha: ahora.toISOString().slice(0, 10),
      hora: ahora.toTimeString().slice(0, 5)
    }

    try {
      const res = await fetch(`${API_URL}/api/Operacion/emergencias/crear/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setRegistrando(false)
        cargarEmergencias()
      } else {
        const err = await res.json()
        alert(`Error al registrar: ${err.error}`)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  // 3. ELIMINAR EMERGENCIA (DELETE)
  const eliminarEmergencia = async (id) => {
    if (!window.confirm('¿Eliminar este registro de emergencia?')) return
    
    try {
      const res = await fetch(`${API_URL}/api/Operacion/emergencias/eliminar/${id}/`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setEmergencias((prev) => prev.filter((e) => e.id !== id))
      }
    } catch (error) {
      console.error("Error al eliminar:", error)
    }
  }

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