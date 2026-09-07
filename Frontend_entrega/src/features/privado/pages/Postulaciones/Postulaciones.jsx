import { postulaciones, estadoPostulacion } from '../../../../data/personal'
import { IconoBandeja, IconoOjo } from '../../../../components/ui/Icono'
import '../../estilos-panel.css'

export default function Postulaciones() {
  return (
    <>
      <div className="vista-head">
        <h1>Postulaciones</h1>
        <p>Solicitudes de ingreso recibidas desde el sitio público.</p>
      </div>

      <div className="panel-box">
        <div className="tabla-scroll">
          <table className="tabla">
            <thead>
              <tr>
                <th>Código</th>
                <th>Postulante</th>
                <th>Fecha</th>
                <th>Documentos</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {postulaciones.map((p) => {
                const est = estadoPostulacion[p.estado]
                return (
                  <tr key={p.id}>
                    <td className="tabla__nombre" style={{ fontFamily: 'var(--display)' }}>
                      {p.id}
                    </td>
                    <td>{p.nombre}</td>
                    <td>{p.fecha}</td>
                    <td>{p.docs} / 3 adjuntos</td>
                    <td>
                      <span className="chip" style={{ '--c': est.color }}>
                        {est.etiqueta}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn-mini">
                        <IconoOjo width={14} /> Revisar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
