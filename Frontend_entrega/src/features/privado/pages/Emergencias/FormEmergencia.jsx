import { useState } from 'react'
import { IconoCerrar, IconoCheck, IconoFuego } from '../../../../components/ui/Icono'

/**
 * Formulario para registrar la última emergencia.
 *
 * @param {array} tipos - Catálogo de tipos de emergencia (10-X).
 * @param {function} onRegistrar - Recibe los datos de la emergencia.
 * @param {function} onCerrar - Cierra sin registrar.
 *
 * El TIPO se elige desde un selector (no se escribe a mano), para
 * mantener consistente la clasificación. La descripción y el sector
 * sí son texto libre.
 */
export default function FormEmergencia({ tipos, onRegistrar, onCerrar }) {
  const [claveTipo, setClaveTipo] = useState(tipos[0].clave)
  const [descripcion, setDescripcion] = useState('')
  const [sector, setSector] = useState('')
  const [error, setError] = useState('')

  const registrar = () => {
    if (!sector.trim()) {
      setError('Indica el sector de la emergencia.')
      return
    }
    // Buscamos el nombre del tipo elegido para guardarlo junto a la clave.
    const tipoElegido = tipos.find((t) => t.clave === claveTipo)
    onRegistrar({
      claveTipo,
      nombreTipo: tipoElegido ? tipoElegido.nombre : '',
      descripcion: descripcion.trim(),
      sector: sector.trim(),
    })
  }

  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <div className="form-emergencia" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="form-emergencia__head">
          <h2><IconoFuego width={20} /> Registrar emergencia</h2>
          <button className="form-emergencia__cerrar" onClick={onCerrar} aria-label="Cerrar">
            <IconoCerrar width={20} />
          </button>
        </div>

        <div className="form-emergencia__body">
          {/* Selector de tipo de emergencia (códigos 10-X) */}
          <label className="campo-form">
            Tipo de emergencia
            <select value={claveTipo} onChange={(e) => { setClaveTipo(e.target.value); setError('') }}>
              {tipos.map((t) => (
                <option key={t.clave} value={t.clave}>
                  {t.clave === 'OTRO' ? t.nombre : `${t.clave} · ${t.nombre}`}
                </option>
              ))}
            </select>
          </label>

          <label className="campo-form">
            Sector *
            <input
              value={sector}
              onChange={(e) => { setSector(e.target.value); setError('') }}
              placeholder="Ej: Sector Norte, Zona Industrial..."
            />
          </label>

          <label className="campo-form">
            Descripción
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Breve descripción de la emergencia (opcional)"
            />
          </label>

          {error && <p className="form-emergencia__error">{error}</p>}
        </div>

        <div className="form-emergencia__acciones">
          <button className="btn btn-fantasma" onClick={onCerrar}>Cancelar</button>
          <button className="btn btn-primario" onClick={registrar}>
            <IconoCheck width={16} /> Registrar
          </button>
        </div>
      </div>
    </div>
  )
}
