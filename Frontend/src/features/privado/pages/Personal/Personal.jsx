import { useSesion } from '../../context'
import { bomberos } from '../../../../data/personal'
import { getRango, getNivel, PERMISOS } from '../../../../data/roles'
import { IconoLapiz, IconoOjo } from '../../../../components/ui/Icono'
import '../../estilos-panel.css'

const estadoBombero = {
  activo: { etiqueta: 'Activo', color: 'var(--disponible)' },
  licencia: { etiqueta: 'Con licencia', color: 'var(--servicio)' },
  baja: { etiqueta: 'De baja', color: 'var(--gris-tenue)' },
}

export default function Personal() {
  const { puede } = useSesion()
  const editar = puede(PERMISOS.EDITAR_BOMBEROS)

  return (
    <>
      <div className="vista-head">
        <h1>Personal</h1>
        <p>Registro de bomberos de la compañía.</p>
      </div>

      {!editar && (
        <div className="nota-info">
          <IconoOjo width={18} />
          Tu rango puede <strong>&nbsp;visualizar&nbsp;</strong> la información, pero no editarla.
        </div>
      )}

      <div className="panel-box">
        <div className="tabla-scroll">
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Rango</th>
                <th>Nivel</th>
                <th>Estado</th>
                <th>Ingreso</th>
                <th>Teléfono</th>
                <th style={{ textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {bomberos.map((b) => {
                const rango = getRango(b.rango)
                const nivel = getNivel(b.rango)
                const est = estadoBombero[b.estado]
                return (
                  <tr key={b.id}>
                    <td className="tabla__nombre">{b.nombre}</td>
                    <td>
                      {rango.numero ? `${rango.numero} · ${rango.nombre}` : rango.nombre}
                    </td>
                    <td>
                      <span className="chip" style={{ '--c': nivel.color }}>
                        {nivel.etiqueta}
                      </span>
                    </td>
                    <td>
                      <span className="chip" style={{ '--c': est.color }}>
                        {est.etiqueta}
                      </span>
                    </td>
                    <td>{b.ingreso}</td>
                    <td>{b.telefono}</td>
                    <td style={{ textAlign: 'right' }}>
                      {editar ? (
                        <button className="btn-mini btn-mini--primario">
                          <IconoLapiz width={14} /> Editar
                        </button>
                      ) : (
                        <button className="btn-mini">
                          <IconoOjo width={14} /> Ver
                        </button>
                      )}
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
