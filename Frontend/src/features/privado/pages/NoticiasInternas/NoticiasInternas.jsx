import { useState } from 'react'
import { useSesion } from '../../context/SesionContext'
import { noticiasInternas } from '../../../../data/personal'
import { IconoLapiz, IconoBasura, IconoSubir, IconoOjo } from '../../../../components/ui/Icono'
import FormNoticia from './FormNoticia'
import '../../estilos-panel.css'
import './NoticiasInternas.css'

/**
 * Noticias internas de la compañía (panel privado).
 *
 * Las gestiona la SECRETARÍA (agregar, editar, eliminar). El rol
 * 'secretaria' se deja preparado; mientras no exista en el backend,
 * también puede gestionarlas el director (y capitán). Cualquier otro
 * rango solo las visualiza.
 *
 * Las noticias pueden tener foto o no.
 *
 * Maqueta: los cambios viven en memoria (se reinician al recargar).
 * Al conectar el backend, se reemplazan por llamadas a la API.
 */
export default function NoticiasInternas() {
  const { rango, tipo } = useSesion()

  const rangoActual = rango ? rango.toLowerCase() : ''
  const tipoActual = tipo ? tipo.toLowerCase() : ''

  // Roles que pueden gestionar noticias. 'secretaria' queda listo
  // para cuando exista en el backend; por ahora, director y capitán.
  const rolesGestores = ['secretaria', 'director', 'capitán', 'capitan']
  const gestiona =
    rolesGestores.includes(rangoActual) || rolesGestores.includes(tipoActual)

  // Lista local (maqueta).
  const [noticias, setNoticias] = useState(noticiasInternas)
  // Estado del formulario: null (cerrado), 'nueva' o el objeto a editar.
  const [editando, setEditando] = useState(null)

  // Crear o actualizar una noticia.
  const guardar = (datos) => {
    if (datos.id) {
      setNoticias((prev) => prev.map((n) => (n.id === datos.id ? { ...n, ...datos } : n)))
    } else {
      setNoticias((prev) => [
        {
          ...datos,
          id: Date.now(),
          fecha: new Date().toISOString().slice(0, 10),
          autor: 'Secretaría',
        },
        ...prev,
      ])
    }
    setEditando(null)
  }

  // Eliminar una noticia.
  const eliminar = (id) => {
    if (!window.confirm('¿Eliminar esta noticia? Esta acción no se puede deshacer.')) return
    setNoticias((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <>
      <div className="vista-head">
        <h1>Noticias internas</h1>
        <p>Novedades y avisos internos de la compañía.</p>
      </div>

      {/* Botón crear: solo quien gestiona. */}
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

      {noticias.length === 0 && (
        <div className="panel-box noticias-vacio">
          No hay noticias publicadas por el momento.
        </div>
      )}

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
                <span className="noticia-card__autor">{n.autor}</span>
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

      {/* Formulario crear/editar */}
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
