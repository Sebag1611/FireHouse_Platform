import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { IconoMenu, IconoCerrar } from './Iconos'
import './Navbar.css'

const enlaces = [
  { a: '/', texto: 'Inicio' },
  { a: '/nosotros', texto: 'Nosotros' },
  { a: '/unidades', texto: 'Material Mayor' },
  { a: '/noticias', texto: 'Noticias' },
  { a: '/contacto', texto: 'Contacto' },
]

export default function Navbar() {
  const [abierto, setAbierto] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setAbierto(false)
  }, [location])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="contenedor nav__fila">
        <Link to="/" aria-label="FireHouse Platform — Inicio">
          <Logo compacto />
        </Link>

        <nav className={`nav__menu ${abierto ? 'nav__menu--abierto' : ''}`}>
          {enlaces.map((e) => (
            <NavLink
              key={e.a}
              to={e.a}
              end={e.a === '/'}
              className={({ isActive }) =>
                `nav__link ${isActive ? 'nav__link--activo' : ''}`
              }
            >
              {e.texto}
            </NavLink>
          ))}
          <Link to="/postular" className="btn btn-primario nav__cta">
            Postular como voluntario
          </Link>
          <Link to="/acceso" className="nav__acceso">
            Acceso interno
          </Link>
        </nav>

        <button
          className="nav__hamburguesa"
          onClick={() => setAbierto((v) => !v)}
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={abierto}
        >
          {abierto ? <IconoCerrar /> : <IconoMenu />}
        </button>
      </div>
    </header>
  )
}
