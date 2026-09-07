import { useTema } from '../../../app/TemaContext'
import { IconoSol, IconoLuna } from '../Icono'
import './ToggleTema.css'

/**
 * Botón para alternar entre modo día y modo noche.
 *
 * Muestra un sol cuando está en modo oscuro (invita a pasar a
 * claro) y una luna cuando está en modo claro (invita a pasar a
 * oscuro). Es un componente reutilizable: se usa igual en el
 * navbar público y en el topbar del panel privado.
 */
export default function ToggleTema() {
  const { tema, alternarTema } = useTema()
  const esOscuro = tema === 'oscuro'

  return (
    <button
      className="toggle-tema"
      onClick={alternarTema}
      aria-label={esOscuro ? 'Activar modo día' : 'Activar modo noche'}
      title={esOscuro ? 'Modo día' : 'Modo noche'}
    >
      {esOscuro ? <IconoSol width={19} /> : <IconoLuna width={19} />}
    </button>
  )
}
