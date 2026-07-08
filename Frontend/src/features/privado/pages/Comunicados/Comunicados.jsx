import { useSesion } from '../../context'
import { comunicados } from '../../../../data/personal'
import { PERMISOS } from '../../../../data/roles'
import { IconoDocumentos, IconoSubir, IconoOjo } from '../../../../components/ui/Icono'
import '../../estilos-panel.css'

export default function Comunicados() {
  const { puede } = useSesion()
  const gestiona = puede(PERMISOS.GESTIONAR_COMUNICADOS)

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
                    <button className="btn-mini">
                      <IconoOjo width={14} /> Abrir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!gestiona && (
        <div className="nota-info">
          <IconoOjo width={18} />
          Tu rango puede consultar los documentos, pero no subir ni eliminar.
        </div>
      )}
    </>
  )
}
