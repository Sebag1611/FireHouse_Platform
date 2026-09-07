import { useState } from 'react'
import { IconoCerrar, IconoCheck } from '../../../../components/ui/Icono'

/**
 * Formulario para crear o editar una noticia interna.
 *
 * @param {object|null} noticia - Noticia a editar, o null para crear.
 * @param {function} onGuardar - Recibe los datos de la noticia.
 * @param {function} onCerrar  - Cierra sin guardar.
 *
 * La foto es OPCIONAL. En la maqueta se ingresa como una URL/ruta de
 * imagen; si se deja vacía, la noticia se publica sin foto. Al
 * conectar el backend, aquí se puede cambiar por una subida de
 * archivo real.
 */
export default function FormNoticia({ noticia, onGuardar, onCerrar }) {
  const esEdicion = Boolean(noticia)

  const [form, setForm] = useState({
    titulo: noticia?.titulo ?? '',
    cuerpo: noticia?.cuerpo ?? '',
    foto: noticia?.foto ?? '',
  })
  const [error, setError] = useState('')

  const cambiar = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }))
    setError('')
  }

  const guardar = () => {
    if (!form.titulo.trim() || !form.cuerpo.trim()) {
      setError('Completa el título y el contenido de la noticia.')
      return
    }
    onGuardar({
      ...(esEdicion ? { id: noticia.id } : {}),
      titulo: form.titulo.trim(),
      cuerpo: form.cuerpo.trim(),
      // Si no se ingresó foto, se guarda null (noticia sin imagen).
      foto: form.foto.trim() || null,
    })
  }

  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <div className="form-noticia" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="form-noticia__head">
          <h2>{esEdicion ? 'Editar noticia' : 'Publicar noticia'}</h2>
          <button className="form-noticia__cerrar" onClick={onCerrar} aria-label="Cerrar">
            <IconoCerrar width={20} />
          </button>
        </div>

        <div className="form-noticia__body">
          <label className="campo-form">
            Título *
            <input
              value={form.titulo}
              onChange={(e) => cambiar('titulo', e.target.value)}
              placeholder="Título de la noticia"
            />
          </label>

          <label className="campo-form">
            Contenido *
            <textarea
              rows={5}
              value={form.cuerpo}
              onChange={(e) => cambiar('cuerpo', e.target.value)}
              placeholder="Escribe el contenido de la noticia..."
            />
          </label>

          <label className="campo-form">
            Foto (opcional)
            <input
              value={form.foto}
              onChange={(e) => cambiar('foto', e.target.value)}
              placeholder="Ruta o URL de la imagen (déjalo vacío si no lleva foto)"
            />
            <span className="campo-form__ayuda">
              La noticia puede publicarse sin foto.
            </span>
          </label>

          {error && <p className="form-noticia__error">{error}</p>}
        </div>

        <div className="form-noticia__acciones">
          <button className="btn btn-fantasma" onClick={onCerrar}>Cancelar</button>
          <button className="btn btn-primario" onClick={guardar}>
            <IconoCheck width={16} /> {esEdicion ? 'Guardar cambios' : 'Publicar'}
          </button>
        </div>
      </div>
    </div>
  )
}
