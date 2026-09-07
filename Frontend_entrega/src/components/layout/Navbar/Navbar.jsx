import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../../ui/Logo'
import ToggleTema from '../../ui/ToggleTema'
import { IconoMenu, IconoCerrar, IconoCasa } from '../../ui/Icono'
import { ROUTES, NAV_PUBLICO } from '../../../app/routes'
import './Navbar.css'

/**
 * Barra de navegación superior de la cara pública.
 *
 * Responsabilidades:
 *  - Mostrar el logo y los enlaces principales (desde NAV_PUBLICO).
 *  - Resaltar el enlace de la página actual.
 *  - Colapsar los enlaces en un menú "hamburguesa" en móvil.
 *  - Cambiar de aspecto al hacer scroll (fondo más opaco).
 */
export default function Navbar() {
  // Estado del menú móvil (abierto/cerrado).
  const [abierto, setAbierto] = useState(false)
  // Estado de scroll: true cuando la página ya se desplazó un poco.
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Botón Home: va al inicio del sitio público y sube al tope de la
  // página. Si ya estamos en Inicio, igual hace scroll suave arriba.
  const irAHome = () => {
    navigate(ROUTES.HOME)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setAbierto(false)
  }

  // Al cambiar de ruta, cerramos el menú móvil (si estaba abierto).
  useEffect(() => {
    setAbierto(false)
  }, [location])

  // Escuchamos el scroll para engrosar la barra. Se limpia el
  // listener al desmontar para no dejar procesos colgados.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="contenedor nav__fila">
        <Link to={ROUTES.HOME} aria-label="FireHouse Platform — Inicio">
          <Logo compacto />
        </Link>

        <nav className={`nav__menu ${abierto ? 'nav__menu--abierto' : ''}`}>
          {/* Botón Home: sube al inicio de la página. */}
          <button className="nav__home" onClick={irAHome}>
            <IconoCasa width={16} /> Inicio
          </button>
          {/* El resto de enlaces se generan desde NAV_PUBLICO (se omite
              "Inicio" porque ya está el botón Home). */}
          {NAV_PUBLICO.filter((e) => e.to !== ROUTES.HOME).map((e) => (
            <NavLink
              key={e.to}
              to={e.to}
              end={e.exacto}
              className={({ isActive }) =>
                `nav__link ${isActive ? 'nav__link--activo' : ''}`
              }
            >
              {e.label}
            </NavLink>
          ))}
          <Link to={ROUTES.POSTULAR} className="btn btn-primario nav__cta">
            Postular como voluntario
          </Link>
          <Link to={ROUTES.ACCESO} className="nav__acceso">
            Acceso interno
          </Link>
        </nav>

        {/* Controles siempre visibles (también en móvil): toggle de
            tema y botón hamburguesa. */}
        <div className="nav__controles">
          <ToggleTema />
          <button
            className="nav__hamburguesa"
            onClick={() => setAbierto((v) => !v)}
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={abierto}
          >
            {abierto ? <IconoCerrar /> : <IconoMenu />}
          </button>
        </div>
      </div>
    </header>
  )
}
