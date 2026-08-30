/**
 * Genera un PDF del turno para registro físico.
 *
 * Sin librerías externas: abre una ventana con el turno maquetado
 * en HTML y lanza el diálogo de impresión del navegador, donde el
 * usuario elige "Guardar como PDF". Es la vía estándar y liviana
 * para producir un PDF desde el navegador.
 *
 * @param {object} planilla - La planilla/turno a exportar.
 * @param {object} encargado - El rango (con persona y número) a cargo.
 */
export function descargarTurnoPDF(planilla, encargado) {
  const ventana = window.open('', '_blank', 'width=800,height=600')
  if (!ventana) {
    alert('Habilita las ventanas emergentes para descargar el PDF.')
    return
  }

  // Filas de la tabla de bloques.
  const filasBloques = planilla.bloques
    .map((b) => {
      const cerrado = b.anotados.length >= b.cupos
      const nombres = cerrado
        ? b.anotados.slice(0, b.cupos).join(', ')
        : '<i>Cupos abiertos</i>'
      return `
        <tr>
          <td>${b.dia}</td>
          <td>${b.horario}</td>
          <td style="text-align:center">${b.anotados.length}/${b.cupos}</td>
          <td>${nombres}</td>
        </tr>`
    })
    .join('')

  // Lista de tareas (si hay).
  const tareas =
    planilla.tareas && planilla.tareas.length
      ? `<h3>Tareas correspondientes</h3><ul>${planilla.tareas
          .map((t) => `<li>${t}</li>`)
          .join('')}</ul>`
      : ''

  const fechaEmision = new Date().toLocaleDateString('es-CL', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  ventana.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>${planilla.titulo} - 3ra Compañía Calama</title>
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
        .meta { display: flex; gap: 24px; margin: 16px 0; font-size: 14px; }
        .meta b { color: #15663f; }
        .tag {
          display: inline-block; padding: 3px 12px; border-radius: 12px;
          font-size: 12px; font-weight: bold; text-transform: uppercase;
          background: ${planilla.tipo === 'nocturno' ? '#15663f' : '#c1272d'};
          color: #fff;
        }
        table { width: 100%; border-collapse: collapse; margin: 8px 0 24px; font-size: 13px; }
        th { background: #15663f; color: #fff; padding: 8px 10px; text-align: left; }
        td { padding: 8px 10px; border-bottom: 1px solid #ddd; }
        tr:nth-child(even) td { background: #f4f6f3; }
        h3 { color: #c1272d; font-size: 15px; margin: 20px 0 8px; }
        ul { margin: 0; padding-left: 20px; }
        li { margin-bottom: 4px; font-size: 13px; }
        footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd;
          font-size: 12px; color: #888; display: flex; justify-content: space-between; }
        .firma { margin-top: 48px; display: flex; justify-content: space-around; text-align: center; font-size: 13px; }
        .firma div { border-top: 1px solid #333; padding-top: 6px; width: 200px; }
        @media print { body { padding: 0; } .cinta { margin-bottom: 16px; } }
      </style>
    </head>
    <body>
      <div class="cinta"></div>
      <header>
        <h1>${planilla.titulo}</h1>
        <div class="sub">3ra Compañía de Bomberos de Calama · ${planilla.subtitulo}</div>
      </header>

      <div class="meta">
        <div><b>Tipo:</b> <span class="tag">${planilla.tipo === 'nocturno' ? 'Nocturno' : 'Diurno'}</span></div>
        <div><b>Encargado:</b> ${encargado.numero} · ${encargado.persona}</div>
      </div>

      <table>
        <thead>
          <tr><th>Día</th><th>Horario</th><th>Cupos</th><th>Personal asignado</th></tr>
        </thead>
        <tbody>${filasBloques}</tbody>
      </table>

      ${tareas}

      <div class="firma">
        <div>Encargado de turno</div>
        <div>Oficial de guardia</div>
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
