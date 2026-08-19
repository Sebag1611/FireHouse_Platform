import { useSesion } from '../../context/SesionContext' // Ruta del contexto corregida
import { comunicados } from '../../../../data/personal'
import {
  IconoDocumentos, IconoSubir, IconoOjo, IconoSalir,
} from '../../../../components/ui/Icono'
import '../../estilos-panel.css'

export default function Comunicados() {
  // 1. Extraemos los datos reales de Django
  const { rango, tipo } = useSesion()
  
  const rangoActual = rango ? rango.toLowerCase() : ''
  const tipoActual = tipo ? tipo.toLowerCase() : ''

  // 2. Definimos quién puede GESTIONAR (Subir comunicados). Ej: Capitán y Director
  const rolesAutorizados = ['capitán', 'capitan', 'director']
  const gestiona = rolesAutorizados.includes(rangoActual) || rolesAutorizados.includes(tipoActual)

  // Descarga simulada: en producción apuntaría al archivo real.
  const descargar = (doc) => {
    // Aquí iría, por ejemplo: window.open(urlDelArchivo, '_blank')
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

      {/* Aviso según lo que puede hacer el rol de Django. */}
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