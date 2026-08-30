import { useSesion } from '../../context'
import { resumenPanel, comunicados, planillasTurno } from '../../../../data/personal'
import { PERMISOS } from '../../../../data/roles'
import { IconoGrupo, IconoCamion, IconoCalendario, IconoBandeja } from '../../../../components/ui/Icono'
import EmergenciasResumen from '../../../../components/ui/EmergenciasResumen'
import '../../estilos-panel.css'

export default function Dashboard() {
  const { usuario, rango, nivel, puede } = useSesion()

  const stats = [
    { valor: resumenPanel.bomberosActivos, label: 'Bomberos activos', clase: 'stat-card--verde', icono: IconoGrupo },
    { valor: resumenPanel.unidadesDisponibles, label: 'Unidades disponibles', clase: 'stat-card--claro', icono: IconoCamion },
    { valor: resumenPanel.turnosAbiertos, label: 'Turnos abiertos', clase: 'stat-card--ambar', icono: IconoCalendario },
    { valor: resumenPanel.postulacionesPendientes, label: 'Postulaciones pendientes', clase: 'stat-card--rojo', icono: IconoBandeja },
  ]

  // Toma solo el primer nombre de la persona para el saludo.
  const primerNombre = usuario.split(' ')[0]

  return (
    <>
      <div className="vista-head">
        <h1>Hola, {primerNombre}</h1>
        <p>
          Sesión iniciada como {rango.nombre} · {nivel.etiqueta}
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
        {/* Últimos comunicados (todos los que pueden verlos). */}
        {puede(PERMISOS.VER_COMUNICADOS) && (
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

        {/* Resumen de planillas de turno (todos los que ven turnos). */}
        {puede(PERMISOS.VER_TURNOS) && (
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
