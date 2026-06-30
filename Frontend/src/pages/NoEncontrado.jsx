import { Link } from 'react-router-dom'
import { IconoFuego } from '../components/Iconos'
import './NoEncontrado.css'

export default function NoEncontrado() {
  return (
    <section className="no-encontrado">
      <div className="contenedor no-encontrado__caja">
        <span className="no-encontrado__icono">
          <IconoFuego width={40} />
        </span>
        <h1>404</h1>
        <h2>Esta página se apagó</h2>
        <p>
          La dirección que buscas no existe o fue movida. Volvamos a un terreno
          seguro.
        </p>
        <Link to="/" className="btn btn-primario">
          Volver al inicio
        </Link>
      </div>
    </section>
  )
}
