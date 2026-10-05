import { useState, useEffect } from 'react'
import { useSesion } from '../../context/SesionContext' 
import { getRango, getNivel } from '../../../../data/roles' 
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
  const { rut, rango, tipo } = useSesion()
  const API_URL = import.meta.env.VITE_API_URL

  const rangoActual = rango ? rango.toLowerCase() : ''
  const tipoActual = tipo ? tipo.toLowerCase() : ''
  const puedeModificar = ['capitán', 'capitan', 'director'].includes(rangoActual) || ['capitán', 'capitan', 'director'].includes(tipoActual)
  
  const editar = puedeModificar
  const crear = puedeModificar 

  const [bomberos, setBomberos] = useState([])
  const [creando, setCreando] = useState(false)

  // 1. GET: Cargar bomberos desde Django/Supabase al iniciar
  useEffect(() => {
    const cargarPersonal = async () => {
      try {
        const respuesta = await fetch(`${API_URL}/api/Administracion/Personal/listar/`)
        if (respuesta.ok) {
          const data = await respuesta.json()
          setBomberos(data)
        }
      } catch (error) {
        console.error("Error al cargar personal:", error)
      }
    }
    cargarPersonal()
  }, [API_URL])

  // 2. POST: Guardar nuevo bombero en el Backend
  const agregarPersona = async (formData) => {
    try {
      // Ajustamos los datos al formato que exige tu views.py (crear_bombero)
      const payload = {
        rut_creador: rut, // El rut del Capitán/Director que está logueado
        rut: formData.rut,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        telefono: formData.telefono,
        correo: formData.correo || "sin_correo@firehouse.cl",
        contraseña: formData.contraseña || "Bombero123*", // Contraseña temporal por defecto
        direccion: formData.direccion || "Sin dirección",
        fecha_ingreso: formData.ingreso || new Date().toISOString().split('T')[0],
        rango: formData.rango,
        nivel: "Nivel 1" // Nivel inicial por defecto para nuevos
      }

      const respuesta = await fetch(`${API_URL}/api/Administracion/crear-bombero/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (respuesta.ok) {
        // Recargamos o actualizamos la lista local
        const nuevoBombero = await respuesta.json()
        setBomberos((prev) => [...prev, {
          ...payload,
          nombre: `${payload.nombres} ${payload.apellidos}`,
          estado: 'activo'
        }])
        setCreando(false)
        alert("Integrante creado exitosamente en la base de datos.")
      } else {
        const errorData = await respuesta.json()
        alert(`Error al crear: ${errorData.error || "Verifica los datos"}`)
      }
    } catch (error) {
      console.error("Error en la petición de creación:", error)
    }
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
          {crear && (
            <button className="btn-mini btn-mini--primario" onClick={() => setCreando(true)}>
              <IconoGrupo width={14} /> Crear bombero / aspirante
            </button>
          )}
        </div>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th><th>Rango</th><th>Nivel</th><th>Estado</th><th>Ingreso</th><th>Teléfono</th><th style={{ textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {bomberos.map((b) => {
                const rangoData = getRango(b.rango)
                const nivelData = getNivel(b.rango)
                const est = estadoBombero[b.estado] ?? estadoBombero.activo
                return (
                  <tr key={b.rut}>
                    <td className="tabla__nombre">{b.nombre || `${b.nombres} ${b.apellidos}`}</td>
                    <td>{rangoData.numero ? `${rangoData.numero} · ${rangoData.nombre}` : rangoData.nombre}</td>
                    <td><span className="chip" style={{ '--c': nivelData.color }}>{b.nivel || nivelData.etiqueta}</span></td>
                    <td><span className="chip" style={{ '--c': est.color }}>{est.etiqueta}</span></td>
                    <td>{b.fecha_ingreso}</td>
                    <td>{b.telefono}</td>
                    <td style={{ textAlign: 'right' }}>
                      {editar ? (
                        <button className="btn-mini btn-mini--primario"><IconoLapiz width={14} /> Editar</button>
                      ) : (
                        <button className="btn-mini"><IconoOjo width={14} /> Ver</button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      {creando && <FormCrearPersonal onGuardar={agregarPersona} onCerrar={() => setCreando(false)} />}
    </>
  )
}