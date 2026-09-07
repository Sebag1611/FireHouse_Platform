import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSesion } from '../../context/SesionContext'
import { ROUTES } from '../../../../app/routes'
import Logo from '../../../../components/ui/Logo'
import ToggleTema from '../../../../components/ui/ToggleTema'
import {
  IconoPanel, IconoGrupo, IconoCamion, IconoCalendario,
  IconoDocumentos, IconoBandeja, IconoSalir, IconoMenu, IconoCerrar, IconoCasa, IconoCurso, IconoArchivo, IconoFuego, IconoReloj, IconoPersona, IconoLapiz
} from '../../../../components/ui/Icono'
import './PanelLayout.css'

// Menú del panel, agrupado por secciones para mayor orden.
// Cada sección tiene un título y sus enlaces. Los enlaces se filtran
// por rol; una sección solo se muestra si tiene enlaces visibles.
const TODOS = ['capitán', 'capitan', 'director', 'teniente', 'bombero', 'secretaria', 'aspirante']

const SECCIONES = [
  {
    titulo: null, // sin título (va primero, suelto)
    items: [
      { to: ROUTES.PANEL, texto: 'Dashboard', icono: IconoPanel, exacto: true },
    ],
  },
  {
    titulo: 'Personal',
    items: [
      { to: ROUTES.PANEL_PERSONAL, texto: 'Personal', icono: IconoGrupo, rolesPermitidos: ['capitán', 'capitan', 'director'] },
      { to: ROUTES.PANEL_INFO_PERSONAL, texto: 'Información personal', icono: IconoPersona, rolesPermitidos: TODOS },
      { to: ROUTES.PANEL_DISPONIBILIDAD, texto: 'Disponibilidad', icono: IconoReloj, rolesPermitidos: TODOS },
      { to: ROUTES.PANEL_MI_PERFIL, texto: 'Mis datos', icono: IconoLapiz, rolesPermitidos: TODOS },
    ],
  },
  {
    titulo: 'Operación',
    items: [
      { to: ROUTES.PANEL_UNIDADES, texto: 'Material Mayor', icono: IconoCamion, rolesPermitidos: ['capitán', 'capitan', 'director', 'teniente', 'bombero'] },
      { to: ROUTES.PANEL_EMERGENCIAS, texto: 'Emergencias', icono: IconoFuego, rolesPermitidos: TODOS },
      { to: ROUTES.PANEL_TURNOS, texto: 'Turnos', icono: IconoCalendario, rolesPermitidos: ['capitán', 'capitan', 'director', 'teniente', 'bombero'] },
      { to: ROUTES.PANEL_CURSOS, texto: 'Cursos', icono: IconoCurso, rolesPermitidos: ['capitán', 'capitan', 'director', 'teniente', 'bombero'] },
    ],
  },
  {
    titulo: 'Comunicación',
    items: [
      { to: ROUTES.PANEL_COMUNICADOS, texto: 'Comunicados', icono: IconoDocumentos, rolesPermitidos: ['capitán', 'capitan', 'director', 'teniente', 'bombero'] },
      { to: ROUTES.PANEL_NOTICIAS, texto: 'Noticias', icono: IconoArchivo, rolesPermitidos: TODOS },
      { to: ROUTES.PANEL_POSTULACIONES, texto: 'Postulaciones', icono: IconoBandeja, rolesPermitidos: ['director'] },
    ],
  },
]

export default function PanelLayout({ children }) {
  const { rango, nivel, tipo, nombreCompleto, cerrarSesion } = useSesion()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const navigate = useNavigate()

  // Filtra los enlaces de cada sección según el rol, y descarta las
  // secciones que quedan sin enlaces visibles.
  const puedeVer = (item) => {
    if (!item.rolesPermitidos) return true
    const rangoActual = rango ? rango.toLowerCase() : ''
    const tipoActual = tipo ? tipo.toLowerCase() : ''
    return item.rolesPermitidos.includes(rangoActual) || item.rolesPermitidos.includes(tipoActual)
  }

  const seccionesVisibles = SECCIONES
    .map((sec) => ({ ...sec, items: sec.items.filter(puedeVer) }))
    .filter((sec) => sec.items.length > 0)

  const etiquetaCargo = rango || tipo || 'Sin Rango'
  const etiquetaNivel = nivel ? ` · ${nivel}` : ''

  return (
    <div className="panel">
      <aside className={`panel__side ${menuAbierto ? 'panel__side--abierto' : ''}`}>
        <div className="panel__side-top">
          <Logo compacto />
          <button className="panel__cerrar-movil" onClick={() => setMenuAbierto(false)}>
            <IconoCerrar width={20} />
          </button>
        </div>
        <span className="panel__side-rotulo">Área interna</span>
        <nav className="panel__nav">
          {seccionesVisibles.map((sec, i) => (
            <div className="panel__nav-seccion" key={sec.titulo || `sec-${i}`}>
              {sec.titulo && (
                <span className="panel__nav-titulo">{sec.titulo}</span>
              )}
              {sec.items.map((m) => {
                const Icono = m.icono
                return (
                  <NavLink key={m.to} to={m.to} end={m.exacto} className={({ isActive }) => `panel__link ${isActive ? 'panel__link--activo' : ''}`} onClick={() => setMenuAbierto(false)}>
                    <Icono width={19} /> {m.texto}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>
        <button className="panel__salir" onClick={() => { cerrarSesion(); navigate(ROUTES.HOME) }}>
          <IconoSalir width={19} /> Salir del panel
        </button>
      </aside>
      <div className="panel__main">
        <header className="panel__top">
          <button className="panel__hamburguesa" onClick={() => setMenuAbierto(true)}>
            <IconoMenu width={22} />
          </button>
          <div className="panel__usuario">
            <span className="panel__usuario-nombre">{nombreCompleto}</span>
            <span className="panel__usuario-rango">{etiquetaCargo} {etiquetaNivel}</span>
          </div>
          <button className="panel__home" onClick={() => navigate(ROUTES.PANEL)}>
            <IconoCasa width={18} /> <span>Home</span>
          </button>
          <ToggleTema />
        </header>
        <div className="panel__contenido">{children}</div>
      </div>
      {menuAbierto && <div className="panel__overlay" onClick={() => setMenuAbierto(false)} />}
    </div>
  )
}