import { Link } from 'react-router-dom'
import Logo from './Logo'
import { redes } from '../data/contenido'
import './Footer.css'

// Iconos de marca para redes (simples, inline)
const iconosRed = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 9V7c0-1 .3-1.5 1.5-1.5H17V2.5h-2.5C11.8 2.5 10 4.2 10 7v2H7.5v3H10v9.5h4V12h2.6l.4-3H14Z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.5 12 5.5 12 5.5s-6 0-7.9.6A3 3 0 0 0 2 8.2 31 31 0 0 0 2 12a31 31 0 0 0 .1 3.8 3 3 0 0 0 2.1 2.1c1.9.6 7.8.6 7.8.6s6 0 7.9-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.1-3.8ZM10 15V9l5.2 3L10 15Z" />
    </svg>
  ),
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="cinta-peligro" />
      <div className="contenedor footer__grid">
        <div className="footer__marca">
          <Logo />
          <p className="footer__lema">«Unión es Fuerza»</p>
          <p className="footer__desc">
            Plataforma de gestión institucional, administrativa y operativa de
            la 3ra Compañía de Bomberos de Calama.
          </p>
          <div className="footer__redes">
            {redes.map((r) => (
              <a
                key={r.nombre}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={r.nombre}
                className="footer__red"
              >
                {iconosRed[r.icono]}
              </a>
            ))}
          </div>
        </div>

        <div className="footer__col">
          <h4>Navegación</h4>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/unidades">Material Mayor</Link>
          <Link to="/noticias">Noticias</Link>
          <Link to="/contacto">Contacto</Link>
        </div>

        <div className="footer__col">
          <h4>Participa</h4>
          <Link to="/postular">Postular como voluntario</Link>
          <Link to="/acceso">Acceso interno</Link>
          <a href="#emergencias">Emergencias recientes</a>
        </div>

        <div className="footer__col">
          <h4>Contacto</h4>
          <span>Calama, Región de Antofagasta</span>
          <span>Fundada el 18 de mayo de 1958</span>
          <a href="tel:132">Emergencias: 132</a>
        </div>
      </div>

      <div className="contenedor footer__base">
        <span>© 2026 3ra Compañía de Bomberos de Calama. Todos los derechos reservados.</span>
        <span>Desarrollado por Fire Knights · Ingeniería en Informática</span>
      </div>
    </footer>
  )
}
