import { useState, useEffect } from 'react'
import { useSesion } from '../../context/SesionContext' 
import { resumenPanel, comunicados, planillasTurno } from '../../../../data/personal'
import { IconoGrupo, IconoCamion, IconoCalendario, IconoBandeja } from '../../../../components/ui/Icono'
import EmergenciasResumen from '../../../../components/ui/EmergenciasResumen'
import '../../estilos-panel.css'

export default function Dashboard() {
  const { nombreCompleto, rango, nivel, tipo } = useSesion()
  
  const API_URL = import.meta.env.VITE_API_URL
  
  // Estados para los contadores reales
  const [totalBomberos, setTotalBomberos] = useState(resumenPanel.bomberosActivos)
  const [unidadesDisponibles, setUnidadesDisponibles] = useState(resumenPanel.unidadesDisponibles)

  // Efecto para consultar a la base de datos al abrir el panel
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // 1. Cargar Bomberos
        const resBomberos = await fetch(`${API_URL}/api/Administracion/Personal/listar/`)
        if (resBomberos.ok) {
          const dataBomberos = await resBomberos.json()
          setTotalBomberos(dataBomberos.length)
        }

        // 2. Cargar Unidades (Material Mayor)
        // Asegúrate de que esta ruta sea la que usaste para el catálogo público
        const resUnidades = await fetch(`${API_URL}/api/Operacion/MaterialMayor/listar/`)
        if (resUnidades.ok) {
          const dataUnidades = await resUnidades.json()
          // Filtramos solo los camiones que tengan su estado como "disponible"
          const disponibles = dataUnidades.filter(
            (u) => u.estado && u.estado.toLowerCase() === 'disponible'
          ).length
          setUnidadesDisponibles(disponibles)
        }
      } catch (error) {
        console.error("Error al cargar los datos del dashboard:", error)
      }
    }
    
    cargarDatos()
  }, [API_URL])

  // Actualizamos la tarjeta para que use ambos contadores dinámicos
  const stats = [
    { valor: totalBomberos, label: 'Bomberos activos', clase: 'stat-card--verde', icono: IconoGrupo },
    { valor: unidadesDisponibles, label: 'Unidades disponibles', clase: 'stat-card--claro', icono: IconoCamion },
    { valor: resumenPanel.turnosAbiertos, label: 'Turnos abiertos', clase: 'stat-card--ambar', icono: IconoCalendario },
    { valor: resumenPanel.postulacionesPendientes, label: 'Postulaciones pendientes', clase: 'stat-card--rojo', icono: IconoBandeja },
  ]

  const primerNombre = nombreCompleto ? nombreCompleto.split(' ')[0] : 'Bombero'
  const etiquetaCargo = rango || tipo || 'Sin Rango'
  const etiquetaNivel = nivel ? ` · ${nivel}` : ''
  const rangoActual = rango ? rango.toLowerCase() : ''
  const tipoActual = tipo ? tipo.toLowerCase() : ''

  const puedeVerComunicados = ['capitán', 'capitan', 'director', 'teniente'].includes(rangoActual) || ['capitán', 'capitan', 'director', 'teniente'].includes(tipoActual)
  const puedeVerTurnos = ['capitán', 'capitan', 'director'].includes(rangoActual) || ['capitán', 'capitan', 'director'].includes(tipoActual)

  return (
    <>
      <div className="vista-head">
        <h1>Hola, {primerNombre}</h1>
        <p>Sesión iniciada como {etiquetaCargo}{etiquetaNivel}</p>
      </div>

      <div className="stats-grid">
        {stats.map((s) => (
          <div className={`stat-card ${s.clase}`} key={s.label}>
            <div className="stat-card__valor">{s.valor}</div>
            <div className="stat-card__label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="panel-box" style={{ marginBottom: 22 }}>
        <div className="panel-box__titulo">Emergencias atendidas este año</div>
        <EmergenciasResumen variante="panel" />
      </div>

      <div className="panel-dashboard-grid">
        {puedeVerComunicados && (
          <div className="panel-box">
            <div className="panel-box__titulo">Últimos comunicados</div>
            {comunicados.slice(0, 3).map((c) => (
              <div className="mini-fila" key={c.id}>
                <div>
                  <strong>{c.titulo}</strong>
                  <span>{c.tipo} · {c.autor}</span>
                </div>
                <time>{c.fecha}</time>
              </div>
            ))}
          </div>
        )}

        {puedeVerTurnos && (
          <div className="panel-box">
            <div className="panel-box__titulo">Planillas de turno</div>
            {planillasTurno.map((p) => {
              const totalAnotados = p.bloques.reduce((s, b) => s + b.anotados.length, 0)
              return (
                <div className="mini-fila" key={p.id}>
                  <div>
                    <strong>{p.titulo}</strong>
                    <span>{p.subtitulo}</span>
                  </div>
                  <span className="cupos-mini">{totalAnotados} anotados</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}