import { useSesion } from '../../context'
import { comunicados } from '../../../../data/personal'
import { PERMISOS } from '../../../../data/roles'
import {
  IconoDocumentos, IconoSubir, IconoOjo, IconoSalir,
} from '../../../../components/ui/Icono'
import '../../estilos-panel.css'

/**
 * Vista de Comunicados y documentos internos.
 *
 * Permisos:
 *  - VER_COMUNICADOS: ver la lista y DESCARGAR documentos
 *    (Bomberos, oficiales, administrativos... todos los que entran).
 *  - GESTIONAR_COMUNICADOS: además, SUBIR nuevos documentos
 *    (oficiales y administrativos).
 *
 * Nota: la descarga aquí es simulada (carcasa sin backend). En
 * producción, el botón dispararía la descarga real del archivo.
 */
export default function Comunicados() {
  const { puede } = useSesion()
  const gestiona = puede(PERMISOS.GESTIONAR_COMUNICADOS) // puede subir

  // Descarga simulada: en producción apuntaría al archivo real.
  const descargar = (doc) => {
    // Aquí iría, por ejemplo: window.open(urlDelArchivo, '_blank')
    // Como es carcasa, solo avisamos qué se descargaría.
    alert(`Descargando: ${doc.archivo}`)
  }

  return (
    <>
      <div className="vista-head">
        <h1>Comunicados y documentos</h1>
        <p>Circulares, protocolos y documentación interna de la compañía.</p>
      </div>

      <div className="panel-box">
        <div className="panel-box__titulo">
          <span>Documentos publicados</span>
          {gestiona && (
            <button className="btn-mini btn-mini--primario">
              <IconoSubir width={14} /> Subir documento
            </button>
          )}
        </div>

        <div className="tabla-scroll">
          <table className="tabla">
            <thead>
              <tr>
                <th>Título</th>
                <th>Tipo</th>
                <th>Publicado por</th>
                <th>Fecha</th>
                <th style={{ textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {comunicados.map((c) => (
                <tr key={c.id}>
                  <td className="tabla__nombre">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <IconoDocumentos width={16} /> {c.titulo}
                    </span>
                  </td>
                  <td>{c.tipo}</td>
                  <td>{c.autor}</td>
                  <td>{c.fecha}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn-mini btn-mini--primario"
                      onClick={() => descargar(c)}
                    >
                      <IconoSalir width={14} style={{ transform: 'rotate(90deg)' }} />
                      Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Aviso según lo que puede hacer el rol. */}
      {gestiona ? (
        <div className="nota-info">
          <IconoSubir width={18} />
          Tu rango puede subir y descargar documentos.
        </div>
      ) : (
        <div className="nota-info">
          <IconoOjo width={18} />
          Tu rango puede consultar y descargar los documentos, pero no subir.
        </div>
      )}
    </>
  )
}
