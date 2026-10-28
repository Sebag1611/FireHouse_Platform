import { useState, useEffect } from 'react'
import { useSesion } from '../../context/SesionContext'
import { IconoLapiz, IconoBasura, IconoSubir, IconoOjo } from '../../../../components/ui/Icono'
import FormNoticia from './FormNoticia'
import '../../estilos-panel.css'
import './NoticiasInternas.css'

export default function NoticiasInternas() {
  const { rut, rango, tipo } = useSesion()

  const rangoActual = rango ? rango.toLowerCase() : ''
  const tipoActual = tipo ? tipo.toLowerCase() : ''

  const rolesGestores = [
    'secretaria', 
    'director', 
    'directora', 
    'capitán', 
    'capitan', 
    'teniente',
    'teniente 1',
    'teniente 2',
    'teniente 3',
    'teniente primero',
    'teniente segundo',
    'teniente tercero'
  ]
  
  const gestiona = rolesGestores.some(rol => 
    rangoActual.includes(rol) || tipoActual.includes(rol)
  )

  const [noticias, setNoticias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [editando, setEditando] = useState(null)
  const API_URL = import.meta.env.VITE_API_URL

  // 1. Cargar noticias desde el Backend
  const cargarNoticias = async () => {
    try {
      setCargando(true)
      const res = await fetch(`${API_URL}/api/Administracion/noticias/`)
      if (!res.ok) throw new Error('Error al obtener noticias')
      const data = await res.json()
      setNoticias(data)
    } catch (err) {
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarNoticias()
  }, [])

  // 2. Crear o actualizar noticia
  const guardar = async (datos) => {
    try {
      if (datos.id) {
        // --- MODO EDICIÓN (PUT) ---
        const payload = {
          rut: rut,
          titulo: datos.titulo,
          cuerpo: datos.cuerpo,
          categoria: datos.categoria || 'Internas',
          foto: datos.foto || null,
        }

        const res = await fetch(`${API_URL}/api/Administracion/noticias/editar/${datos.id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (!res.ok) {
          const texto = await res.text()
          try {
            const errJson = JSON.parse(texto)
            alert(errJson.error || 'No se pudo editar la noticia.')
          } catch {
            alert(`Error del servidor (${res.status}).`)
          }
          return
        }
      } else {
        // --- MODO CREACIÓN (POST) ---
        const payload = {
          rut: rut,
          titulo: datos.titulo,
          cuerpo: datos.cuerpo,
          categoria: datos.categoria || 'Internas',
          foto: datos.foto || null
        }

        const res = await fetch(`${API_URL}/api/Administracion/noticias/crear/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (!res.ok) {
          const texto = await res.text()
          try {
            const errJson = JSON.parse(texto)
            alert(errJson.error || 'No se pudo publicar la noticia.')
          } catch {
            alert(`Error del servidor (${res.status}).`)
          }
          return
        }
      }

      // Recargar lista actualizada desde Supabase/Django
      await cargarNoticias()
      setEditando(null)
    } catch (err) {
      console.error(err)
      alert('Error de conexión al procesar la noticia.')
    }
  }

  // 3. Eliminar noticia en Django
  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta noticia? Esta acción no se puede deshacer.')) return

    try {
      const res = await fetch(`${API_URL}/api/Administracion/noticias/eliminar/${id}/?rut=${rut}`, {
        method: 'DELETE'
      })

      const resData = await res.json()
      if (!res.ok) {
        alert(resData.error || 'Error al eliminar la noticia.')
        return
      }

      // Filtramos en pantalla
      setNoticias((prev) => prev.filter((n) => n.id !== id))
    } catch (err) {
      console.error(err)
      alert('Error de conexión al eliminar.')
    }
  }

  return (
    <>
      <div className="vista-head">
        <h1>Noticias internas</h1>
        <p>Novedades y avisos internos de la compañía.</p>
      </div>

      {/* Botón crear: solo quien gestiona */}
      {gestiona ? (
        <div className="noticias-acciones">
          <button className="btn btn-primario" onClick={() => setEditando('nueva')}>
            <IconoSubir width={16} /> Publicar noticia
          </button>
        </div>
      ) : (
        <div className="nota-info">
          <IconoOjo width={18} />
          Tu rango puede consultar las noticias internas.
        </div>
      )}

      {cargando ? (
        <div className="panel-box noticias-vacio">Cargando noticias...</div>
      ) : noticias.length === 0 ? (
        <div className="panel-box noticias-vacio">
          No hay noticias publicadas por el momento.
        </div>
      ) : (
        <div className="noticias-lista">
          {noticias.map((n) => (
            <article className="noticia-card" key={n.id}>
              {/* Foto opcional */}
              {n.foto && (
                <div className="noticia-card__foto">
                  <img src={n.foto} alt={n.titulo} />
                </div>
              )}

              <div className="noticia-card__cuerpo">
                <div className="noticia-card__top">
                  <h2>{n.titulo}</h2>
                  <time>{n.fecha}</time>
                </div>
                <p>{n.cuerpo}</p>
                <div className="noticia-card__pie">
                  <span className="noticia-card__autor">{n.autor || 'Oficialidad'}</span>
                  {gestiona && (
                    <div className="noticia-card__acciones">
                      <button className="btn-mini" onClick={() => setEditando(n)}>
                        <IconoLapiz width={13} /> Editar
                      </button>
                      <button className="btn-mini btn-mini--peligro" onClick={() => eliminar(n.id)}>
                        <IconoBasura width={13} /> Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal crear / editar */}
      {editando && (
        <FormNoticia
          noticia={editando === 'nueva' ? null : editando}
          onGuardar={guardar}
          onCerrar={() => setEditando(null)}
        />
      )}
    </>
  )
}