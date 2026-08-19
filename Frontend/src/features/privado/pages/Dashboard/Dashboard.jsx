import { useSesion } from '../../context/SesionContext' // Ruta ajustada a tu nuevo contexto
import { resumenPanel, comunicados, planillasTurno } from '../../../../data/personal'
import { IconoGrupo, IconoCamion, IconoCalendario, IconoBandeja } from '../../../../components/ui/Icono'
import EmergenciasResumen from '../../../../components/ui/EmergenciasResumen'
import '../../estilos-panel.css'

export default function Dashboard() {
  // 1. Traemos las variables reales de tu base de datos Django
  const { nombreCompleto, rango, nivel, tipo } = useSesion()

  const stats = [
    { valor: resumenPanel.bomberosActivos, label: 'Bomberos activos', clase: 'stat-card--verde', icono: IconoGrupo },
    { valor: resumenPanel.unidadesDisponibles, label: 'Unidades disponibles', clase: 'stat-card--claro', icono: IconoCamion },
    { valor: resumenPanel.turnosAbiertos, label: 'Turnos abiertos', clase: 'stat-card--ambar', icono: IconoCalendario },
    { valor: resumenPanel.postulacionesPendientes, label: 'Postulaciones pendientes', clase: 'stat-card--rojo', icono: IconoBandeja },
  ]

  // 2. Extraemos el primer nombre de forma segura
  const primerNombre = nombreCompleto ? nombreCompleto.split(' ')[0] : 'Bombero'

  // Preparamos las etiquetas visuales para tu cargo
  const etiquetaCargo = rango || tipo || 'Sin Rango'
  const etiquetaNivel = nivel ? ` · ${nivel}` : ''

  // 3. Transformamos la vieja lógica de "puede()" a tus rangos reales
  const rangoActual = rango ? rango.toLowerCase() : ''
  const tipoActual = tipo ? tipo.toLowerCase() : ''

  const puedeVerComunicados = ['capitán', 'capitan', 'director', 'teniente'].includes(rangoActual) || ['capitán', 'capitan', 'director', 'teniente'].includes(tipoActual)
  const puedeVerTurnos = ['capitán', 'capitan', 'director'].includes(rangoActual) || ['capitán', 'capitan', 'director'].includes(tipoActual)

  return (
    <>
      <div className="vista-head">
        <h1>Hola, {primerNombre}</h1>
        <p>
          Sesión iniciada como {etiquetaCargo}{etiquetaNivel}
        </p>
      </div>

      <div className="stats-grid">
        {stats.map((s) => (
          <div className={`stat-card ${s.clase}`} key={s.label}>
            <div className="stat-card__valor">{s.valor}</div>
            <div className="stat-card__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Estadística de emergencias del año (motivación al cuerpo). */}
      <div className="panel-box" style={{ marginBottom: 22 }}>
        <div className="panel-box__titulo">Emergencias atendidas este año</div>
        <EmergenciasResumen variante="panel" />
      </div>

      <div className="panel-dashboard-grid">
        {/* Últimos comunicados (visibilidad según rol de DB) */}
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

        {/* Resumen de planillas de turno (visibilidad según rol de DB) */}
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