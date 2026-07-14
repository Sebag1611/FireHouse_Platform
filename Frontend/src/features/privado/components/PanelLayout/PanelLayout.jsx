import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSesion } from '../../context'
import { PERMISOS } from '../../../../data/roles'
import { ROUTES } from '../../../../app/routes'
import Logo from '../../../../components/ui/Logo'
import ToggleTema from '../../../../components/ui/ToggleTema'
import {
  IconoPanel, IconoGrupo, IconoCamion, IconoCalendario,
  IconoDocumentos, IconoBandeja, IconoSalir, IconoMenu, IconoCerrar, IconoCasa,
} from '../../../../components/ui/Icono'
import './PanelLayout.css'

/**
 * ============================================================
 *  PanelLayout · Estructura del área privada
 * ============================================================
 *  Provee el "marco" del panel interno: barra lateral (sidebar)
 *  con el menú, barra superior (topbar) con el usuario y el
 *  selector de rol, y el área central donde se renderiza cada
 *  vista.
 *
 *  Punto clave: el menú se filtra según los permisos del rol
 *  activo. Un teniente no ve "Postulaciones" si no tiene ese
 *  permiso, etc. Así la navegación refleja el control de acceso.
 * ============================================================
 */

/**
 * Definición del menú lateral. Cada entrada declara el permiso
 * que se necesita para verla; el layout luego filtra la lista
 * según el rol actual. Las URLs vienen de ROUTES (centralizadas).
 */
const MENU = [
  { to: ROUTES.PANEL, texto: 'Dashboard', icono: IconoPanel, permiso: PERMISOS.VER_PANEL, exacto: true },
  { to: ROUTES.PANEL_PERSONAL, texto: 'Personal', icono: IconoGrupo, permiso: PERMISOS.VER_BOMBEROS },
  { to: ROUTES.PANEL_UNIDADES, texto: 'Material Mayor', icono: IconoCamion, permiso: PERMISOS.VER_UNIDADES },
  { to: ROUTES.PANEL_TURNOS, texto: 'Turnos', icono: IconoCalendario, permiso: PERMISOS.VER_TURNOS },
  { to: ROUTES.PANEL_COMUNICADOS, texto: 'Comunicados', icono: IconoDocumentos, permiso: PERMISOS.VER_COMUNICADOS },
  { to: ROUTES.PANEL_POSTULACIONES, texto: 'Postulaciones', icono: IconoBandeja, permiso: PERMISOS.VER_POSTULACIONES },
]

export default function PanelLayout({ children }) {
  const { rango, nivel, usuarioConNumero, puede, cerrarSesion } = useSesion()
  // Estado del menú lateral en móvil (abierto/cerrado).
  const [menuAbierto, setMenuAbierto] = useState(false)
  const navigate = useNavigate()

  // Solo mostramos las entradas del menú permitidas para el rol.
  const visibles = MENU.filter((m) => puede(m.permiso))

  return (
    <div className="panel">
      {/* ---------- SIDEBAR (menú lateral) ---------- */}
      <aside className={`panel__side ${menuAbierto ? 'panel__side--abierto' : ''}`}>
        <div className="panel__side-top">
          <Logo compacto />
          <button
            className="panel__cerrar-movil"
            onClick={() => setMenuAbierto(false)}
            aria-label="Cerrar menú"
          >
            <IconoCerrar width={20} />
          </button>
        </div>

        <span className="panel__side-rotulo">Área interna</span>

        <nav className="panel__nav">
          {visibles.map((m) => {
            const Icono = m.icono
            return (
              <NavLink
                key={m.to}
                to={m.to}
                end={m.exacto}
                className={({ isActive }) =>
                  `panel__link ${isActive ? 'panel__link--activo' : ''}`
                }
                onClick={() => setMenuAbierto(false)}
              >
                <Icono width={19} />
                {m.texto}
              </NavLink>
            )
          })}
        </nav>

        {/* Cierra la sesión y regresa a la cara pública. */}
        <button
          className="panel__salir"
          onClick={() => {
            cerrarSesion()
            navigate(ROUTES.HOME)
          }}
        >
          <IconoSalir width={19} />
          Salir del panel
        </button>
      </aside>

      {/* ---------- CONTENIDO PRINCIPAL ---------- */}
      <div className="panel__main">
        {/* Barra superior */}
        <header className="panel__top">
          <button
            className="panel__hamburguesa"
            onClick={() => setMenuAbierto(true)}
            aria-label="Abrir menú"
          >
            <IconoMenu width={22} />
          </button>

          {/* Usuario y rol actual */}
          <div className="panel__usuario">
            <span className="panel__usuario-nombre">{usuarioConNumero}</span>
            <span
              className="panel__usuario-rango"
              style={{ '--c': nivel.color }}
            >
              {rango.nombre} · {nivel.etiqueta}
            </span>
          </div>

          {/* Botón Home: regresa al Dashboard del panel. */}
          <button
            className="panel__home"
            onClick={() => navigate(ROUTES.PANEL)}
            title="Ir al Dashboard"
          >
            <IconoCasa width={18} />
            <span>Home</span>
          </button>

          <ToggleTema />
        </header>

        <div className="panel__contenido">{children}</div>
      </div>

      {/* Fondo oscuro tras el menú móvil: al hacer clic, cierra. */}
      {menuAbierto && (
        <div className="panel__overlay" onClick={() => setMenuAbierto(false)} />
      )}
    </div>
  )
}
