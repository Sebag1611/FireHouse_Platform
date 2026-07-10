import { emergenciasAnuales } from '../../../data/contenidoPublico'
import { IconoFuego, IconoRescate, IconoHazmat, IconoAgua } from '../Icono'
import './EmergenciasResumen.css'

/**
 * Resumen del total de emergencias del año con desglose por tipo,
 * mostrado en NÚMEROS (no porcentajes).
 *
 * Es reutilizable: se usa en la cara pública (transparencia hacia
 * la comunidad) y en el panel interno (motivación para el cuerpo
 * de bomberos). Toma los datos de emergenciasAnuales.
 *
 * @param {string} variante - 'publico' | 'panel'. Ajusta detalles
 *   visuales menores según dónde se muestre.
 */

// Relaciona la clave de icono del dato con su componente SVG.
const ICONOS = {
  fuego: IconoFuego,
  rescate: IconoRescate,
  hazmat: IconoHazmat,
  agua: IconoAgua,
}

export default function EmergenciasResumen({ variante = 'publico' }) {
  const { total, desglose, corteAl, anio } = emergenciasAnuales

  return (
    <div className={`emergencias-resumen emergencias-resumen--${variante}`}>
      {/* Total del año, destacado. */}
      <div className="emergencias-resumen__total">
        <span className="emergencias-resumen__numero">{total}</span>
        <span className="emergencias-resumen__label">
          Emergencias atendidas en {anio}
        </span>
        <span className="emergencias-resumen__corte">Al {corteAl}</span>
      </div>

      {/* Desglose por tipo, en números. */}
      <div className="emergencias-resumen__grid">
        {desglose.map((d) => {
          const Icono = ICONOS[d.icono] ?? IconoFuego
          return (
            <div className="emergencias-tipo" key={d.tipo}>
              <span className="emergencias-tipo__icono">
                <Icono width={24} />
              </span>
              <span className="emergencias-tipo__cantidad">{d.cantidad}</span>
              <span className="emergencias-tipo__tipo">{d.tipo}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
