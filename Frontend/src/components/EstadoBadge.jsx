import { estadosOperativos } from '../data/contenido'
import './EstadoBadge.css'

// Indicador visual del estado operativo de una unidad (HU-13)
export default function EstadoBadge({ estado }) {
  const info = estadosOperativos[estado] ?? estadosOperativos.taller
  return (
    <span className="estado-badge" style={{ '--c': info.color }}>
      <span className="estado-badge__punto" />
      {info.etiqueta}
    </span>
  )
}
