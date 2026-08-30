import { useState } from 'react'
import { useSesion } from '../../context'
import { bomberos as bomberosData } from '../../../../data/personal'
import { getRango, getNivel, PERMISOS } from '../../../../data/roles'
import { IconoLapiz, IconoOjo, IconoGrupo } from '../../../../components/ui/Icono'
import FormCrearPersonal from './FormCrearPersonal'
import '../../estilos-panel.css'
import './Personal.css'

const estadoBombero = {
  activo: { etiqueta: 'Activo', color: 'var(--disponible)' },
  licencia: { etiqueta: 'Con licencia', color: 'var(--servicio)' },
  baja: { etiqueta: 'De baja', color: 'var(--gris-tenue)' },
}

export default function Personal() {
  const { puede } = useSesion()
  const editar = puede(PERMISOS.EDITAR_BOMBEROS)
  const crear = puede(PERMISOS.CREAR_PERSONAL) // Capitán y Directora

  // Lista local (para reflejar altas nuevas en la demo).
  const [bomberos, setBomberos] = useState(bomberosData)
  // Controla la apertura del formulario de alta.
  const [creando, setCreando] = useState(false)

  // Agrega un nuevo integrante a la lista (solo en memoria).
  const agregarPersona = (persona) => {
    setBomberos((prev) => [
      ...prev,
      {
        ...persona,
        id: prev.length + 1,
        estado: 'activo',
      },
    ])
    setCreando(false)
  }

  return (
    <>
      <div className="vista-head">
        <h1>Personal</h1>
        <p>Registro de bomberos de la compañía.</p>
      </div>

      {!editar && !crear && (
        <div className="nota-info">
          <IconoOjo width={18} />
          Tu rango puede <strong>&nbsp;visualizar&nbsp;</strong> la información, pero no editarla.
        </div>
      )}

      <div className="panel-box">
        <div className="panel-box__titulo">
          <span>Integrantes ({bomberos.length})</span>
          {/* Crear bombero/aspirante: solo Capitán y Directora. */}
          {crear && (
            <button
              className="btn-mini btn-mini--primario"
              onClick={() => setCreando(true)}
            >
              <IconoGrupo width={14} /> Crear bombero / aspirante
            </button>
          )}
        </div>

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
                const est = estadoBombero[b.estado] ?? estadoBombero.activo
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

      {/* Formulario de alta (modal), solo si se está creando. */}
      {creando && (
        <FormCrearPersonal
          onGuardar={agregarPersona}
          onCerrar={() => setCreando(false)}
        />
      )}
    </>
  )
}
