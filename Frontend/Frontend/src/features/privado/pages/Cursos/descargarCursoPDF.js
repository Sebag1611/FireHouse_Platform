/**
 * Genera un PDF de un curso para registro físico.
 *
 * Sin librerías externas: abre una ventana con el curso maquetado en
 * HTML y lanza el diálogo de impresión del navegador, donde el
 * usuario elige "Guardar como PDF".
 *
 * @param {object} curso - El curso a exportar.
 * @param {object} creador - El rango (con persona y número) que lo abrió.
 */
export function descargarCursoPDF(curso, creador) {
  const ventana = window.open('', '_blank', 'width=800,height=600')
  if (!ventana) {
    alert('Habilita las ventanas emergentes para descargar el PDF.')
    return
  }

  const cerrado = curso.inscritos.length >= curso.cupos
  const estado = cerrado ? 'Cerrado · Cupos completos' : 'Inscripciones abiertas'

  // Lista de inscritos (o aviso si aún no hay).
  const inscritos = curso.inscritos.length
    ? `<ol>${curso.inscritos.map((n) => `<li>${n}</li>`).join('')}</ol>`
    : '<p><i>Sin inscritos por el momento.</i></p>'

  const nombreCreador = creador
    ? (creador.numero ? `${creador.nombre} ${creador.persona}` : creador.persona)
    : 'Oficialidad'

  const fechaEmision = new Date().toLocaleDateString('es-CL', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  ventana.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>${curso.nombre} - 3ra Compañía Calama</title>
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: Arial, Helvetica, sans-serif;
          color: #1a1a1a;
          padding: 32px;
          max-width: 800px;
          margin: 0 auto;
        }
        .cinta {
          height: 8px;
          background: repeating-linear-gradient(-45deg,
            #c1272d 0 16px, #15663f 16px 32px);
          margin-bottom: 24px;
        }
        header { border-bottom: 2px solid #15663f; padding-bottom: 16px; margin-bottom: 20px; }
        h1 { color: #15663f; font-size: 24px; margin: 0 0 4px; text-transform: uppercase; }
        .sub { color: #555; font-size: 14px; }
        .tag {
          display: inline-block; padding: 3px 12px; border-radius: 12px;
          font-size: 12px; font-weight: bold; text-transform: uppercase;
          background: ${cerrado ? '#15663f' : '#c1272d'}; color: #fff;
        }
        .datos { margin: 16px 0; font-size: 14px; line-height: 1.9; }
        .datos b { color: #15663f; }
        h3 { color: #c1272d; font-size: 15px; margin: 24px 0 8px; }
        ol { margin: 0; padding-left: 22px; }
        li { margin-bottom: 5px; font-size: 14px; }
        .firma { margin-top: 48px; display: flex; justify-content: space-around; text-align: center; font-size: 13px; }
        .firma div { border-top: 1px solid #333; padding-top: 6px; width: 220px; }
        footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd;
          font-size: 12px; color: #888; display: flex; justify-content: space-between; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>
      <div class="cinta"></div>
      <header>
        <h1>${curso.nombre}</h1>
        <div class="sub">3ra Compañía de Bomberos de Calama · Registro de curso</div>
      </header>

      <div class="datos">
        <div><b>Estado:</b> <span class="tag">${estado}</span></div>
        <div><b>Fechas:</b> ${curso.fechas}</div>
        <div><b>Cupos:</b> ${curso.inscritos.length} de ${curso.cupos}</div>
        <div><b>Abierto por:</b> ${nombreCreador}</div>
        <div><b>Descripción:</b> ${curso.descripcion || '—'}</div>
      </div>

      <h3>Personal inscrito</h3>
      ${inscritos}

      <div class="firma">
        <div>Encargado del curso</div>
        <div>Oficial de compañía</div>
      </div>

      <footer>
        <span>Emitido el ${fechaEmision}</span>
        <span>FireHouse Platform · «Unión es Fuerza»</span>
      </footer>

      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `)
  ventana.document.close()
}
