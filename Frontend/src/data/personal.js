/**
 * ============================================================
 *  DATOS · Información interna del panel privado (mock)
 * ============================================================
 *  Datos de ejemplo del área privada: personal (bomberos),
 *  turnos, comunicados y postulaciones recibidas.
 *
 *  Igual que el contenido público, hoy son datos fijos y en
 *  producción vendrán de la API. Se mantienen separados de los
 *  datos públicos porque pertenecen a otro dominio (gestión
 *  interna) con acceso restringido por roles.
 * ============================================================
 */

// Personal de la compañía
export const bomberos = [
  { id: 1, nombre: 'Ivan Villagra Pacan', rango: 'capitan', estado: 'activo', ingreso: '2010-03-12', telefono: '+56 9 1111 1111', tipoSangre: 'O+' },
  { id: 2, nombre: 'Evelyn Cruz Cruz', rango: 'director', estado: 'activo', ingreso: '2008-06-01', telefono: '+56 9 2222 2222', tipoSangre: 'A+' },
  { id: 3, nombre: 'Jeferson Araya', rango: 'teniente1', estado: 'activo', ingreso: '2014-09-20', telefono: '+56 9 3333 3333', tipoSangre: 'B+' },
  { id: 4, nombre: 'Omar Cruz', rango: 'teniente2', estado: 'activo', ingreso: '2015-01-15', telefono: '+56 9 4444 4444', tipoSangre: 'O-' },
  { id: 5, nombre: 'Pablo Valdes', rango: 'teniente3', estado: 'activo', ingreso: '2016-11-05', telefono: '+56 9 5555 5555', tipoSangre: 'A-' },
  { id: 6, nombre: 'Juan Pacheco', rango: 'ayudante1', estado: 'activo', ingreso: '2018-04-10', telefono: '+56 9 6666 6666', tipoSangre: 'AB+' },
  { id: 7, nombre: 'Lissete Perez de Arce', rango: 'ayudante2', estado: 'activo', ingreso: '2019-08-30', telefono: '+56 9 7777 7777', tipoSangre: 'O+' },
  { id: 8, nombre: 'Natalia Anza', rango: 'secretario', estado: 'activo', ingreso: '2016-07-22', telefono: '+56 9 8888 8888', tipoSangre: 'A+' },
  { id: 9, nombre: 'Allison Maulen', rango: 'tesorero', estado: 'activo', ingreso: '2017-02-18', telefono: '+56 9 9999 9999', tipoSangre: 'B-' },
  { id: 10, nombre: 'Diego Fuentes', rango: 'bombero', estado: 'activo', ingreso: '2022-05-14', telefono: '+56 9 1010 1010', tipoSangre: 'O+' },
  { id: 11, nombre: 'Camila Vega', rango: 'bombero', estado: 'activo', ingreso: '2023-03-08', telefono: '+56 9 1111 2020', tipoSangre: 'A+' },
]

/* ------------------------------------------------------------
   TURNOS · Planillas de asistencia semanal
   ------------------------------------------------------------
   El cambio de turno rota cada semana. Cada planilla cubre una
   semana, tiene un TENIENTE ENCARGADO y se divide en BLOQUES
   (día + franja horaria), cada uno con un LÍMITE DE CUPOS.

   Reglas:
   - Los bomberos se anotan; los primeros en llenar el cupo quedan.
   - Antes de cerrarse, se ve "anotados / cupos" (sin nombres).
   - Cuando los anotados llegan al cupo, el bloque se CIERRA solo
     y recién ahí se muestran los NOMBRES de los seleccionados.
   - El encargado (o Directora/Capitán) puede editar cupos y
     horarios, y designar al siguiente encargado.

   Cada bloque guarda 'anotados' como lista de nombres (no solo un
   número), para poder revelarlos al cerrarse.
   ------------------------------------------------------------ */

// Franjas horarias del turno diurno (bloques de 4 horas).
const FRANJAS_DIURNO = ['09:30 a 13:30', '13:30 a 17:30', '17:30 a 21:30']

/**
 * Construye los bloques de una planilla diurna.
 * @param {string[]} dias  - Días de la semana de la planilla.
 * @param {number[]} cuposPorBloque   - Límite de cupos de cada bloque.
 * @param {string[][]} anotadosPorBloque - Nombres ya anotados en cada bloque.
 */
function bloquesDiurno(dias, cuposPorBloque, anotadosPorBloque) {
  const bloques = []
  let i = 0
  for (const dia of dias) {
    for (const franja of FRANJAS_DIURNO) {
      bloques.push({
        id: `${dia}-${franja}`.replace(/[\s:]/g, ''),
        dia,
        horario: franja,
        cupos: cuposPorBloque[i] ?? 4,
        anotados: anotadosPorBloque[i] ?? [],
        inscritoYo: false,
      })
      i++
    }
  }
  return bloques
}

export const planillasTurno = [
  {
    id: 'semana-actual',
    titulo: 'Turno Diurno',
    subtitulo: 'Semana del 24 al 30 de junio de 2026',
    plazo: 'Plazo: lunes 22 de junio a las 20:00 hrs.',
    tipo: 'diurno',
    encargado: 'teniente2', // 302 · Omar Cruz
    bloques: bloquesDiurno(
      ['Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      // Cupos por bloque:
      [4, 4, 4, 4, 4, 6, 4, 4, 4, 3, 2, 2],
      // Nombres ya anotados por bloque:
      [
        [], [], [],
        ['Juan Pacheco', 'Diego Fuentes'],
        ['Camila Vega', 'Lissete Perez de Arce'],
        ['Diego Fuentes', 'Camila Vega', 'Juan Pacheco', 'Natalia Anza', 'Allison Maulen', 'Lissete Perez de Arce'],
        ['Juan Pacheco', 'Diego Fuentes', 'Camila Vega', 'Natalia Anza'],
        ['Diego Fuentes', 'Lissete Perez de Arce', 'Camila Vega', 'Allison Maulen'],
        ['Juan Pacheco', 'Camila Vega', 'Diego Fuentes', 'Natalia Anza'],
        ['Diego Fuentes', 'Camila Vega'],
        ['Allison Maulen'],
        ['Juan Pacheco'],
      ]
    ),
  },
  {
    id: 'continuacion',
    titulo: 'Continuación de Turnos',
    subtitulo: 'Semana siguiente',
    plazo: 'Completa los bloques que puedas cubrir.',
    tipo: 'diurno',
    encargado: 'teniente1', // 301 · Jeferson Araya
    bloques: bloquesDiurno(
      ['Domingo', 'Lunes', 'Martes'],
      [4, 3, 3, 3, 3, 4, 3, 2, 2],
      [
        ['Juan Pacheco', 'Diego Fuentes', 'Camila Vega', 'Natalia Anza'], // Dom mañana lleno
        [],
        [],
        ['Camila Vega', 'Diego Fuentes', 'Juan Pacheco'], // lleno
        ['Natalia Anza', 'Allison Maulen', 'Lissete Perez de Arce'], // lleno
        ['Diego Fuentes', 'Camila Vega', 'Juan Pacheco', 'Natalia Anza'], // lleno
        ['Juan Pacheco', 'Camila Vega', 'Diego Fuentes'],
        ['Allison Maulen'],
        ['Diego Fuentes', 'Lissete Perez de Arce'],
      ]
    ),
  },
  {
    id: 'nocturna',
    titulo: 'Guardia Nocturna',
    subtitulo: 'Del miércoles 1 al martes 7 de julio',
    plazo: 'Franja única: 21:30 a 09:30 hrs.',
    tipo: 'nocturno',
    encargado: 'teniente3', // 303 · Pablo Valdes
    bloques: [
      { id: 'noc-mie', dia: 'Miércoles 1', horario: '21:30 a 09:30', cupos: 7, anotados: ['Juan Pacheco', 'Diego Fuentes', 'Camila Vega', 'Natalia Anza', 'Allison Maulen', 'Lissete Perez de Arce', 'Sebastián Guerra'], inscritoYo: true },
      { id: 'noc-jue', dia: 'Jueves 2', horario: '21:30 a 09:30', cupos: 7, anotados: ['Camila Vega', 'Diego Fuentes', 'Juan Pacheco', 'Natalia Anza', 'Allison Maulen'], inscritoYo: false },
      { id: 'noc-vie', dia: 'Viernes 3', horario: '21:30 a 09:30', cupos: 7, anotados: ['Juan Pacheco', 'Diego Fuentes', 'Camila Vega', 'Natalia Anza', 'Allison Maulen', 'Lissete Perez de Arce', 'Diego Fuentes'], inscritoYo: false },
      { id: 'noc-sab', dia: 'Sábado 4', horario: '21:30 a 09:30', cupos: 7, anotados: ['Diego Fuentes', 'Camila Vega', 'Juan Pacheco', 'Natalia Anza', 'Allison Maulen', 'Lissete Perez de Arce', 'Camila Vega'], inscritoYo: false },
      { id: 'noc-dom', dia: 'Domingo 5', horario: '21:30 a 09:30', cupos: 8, anotados: ['Juan Pacheco', 'Diego Fuentes', 'Camila Vega', 'Natalia Anza', 'Allison Maulen', 'Lissete Perez de Arce'], inscritoYo: true },
      { id: 'noc-lun', dia: 'Lunes 6', horario: '21:30 a 09:30', cupos: 6, anotados: ['Diego Fuentes', 'Camila Vega', 'Juan Pacheco', 'Natalia Anza'], inscritoYo: false },
      { id: 'noc-mar', dia: 'Martes 7', horario: '21:30 a 09:30', cupos: 6, anotados: ['Juan Pacheco', 'Camila Vega', 'Diego Fuentes', 'Allison Maulen'], inscritoYo: false },
    ],
  },
]

// Comunicados y documentos internos
export const comunicados = [
  { id: 1, titulo: 'Actualización protocolo HazMat 2026', tipo: 'Protocolo', fecha: '2026-06-25', autor: 'Capitán', archivo: 'protocolo_hazmat_2026.pdf' },
  { id: 2, titulo: 'Citación asamblea mensual de julio', tipo: 'Citación', fecha: '2026-06-22', autor: 'Secretaría', archivo: 'citacion_julio.pdf' },
  { id: 3, titulo: 'Estado financiero segundo trimestre', tipo: 'Documento', fecha: '2026-06-18', autor: 'Tesorería', archivo: 'balance_q2.pdf' },
  { id: 4, titulo: 'Nuevos horarios de academia', tipo: 'Comunicado', fecha: '2026-06-15', autor: 'Capitán', archivo: 'horarios_academia.pdf' },
]

// Postulaciones recibidas (desde el formulario público)
export const postulaciones = [
  { id: 'POST-2026-A1B2', nombre: 'Diego Fuentes', fecha: '2026-06-27', estado: 'pendiente', docs: 3 },
  { id: 'POST-2026-C3D4', nombre: 'Camila Vega', fecha: '2026-06-26', estado: 'revision', docs: 3 },
  { id: 'POST-2026-E5F6', nombre: 'Matías Rojas', fecha: '2026-06-24', estado: 'aprobada', docs: 3 },
  { id: 'POST-2026-G7H8', nombre: 'Antonia Silva', fecha: '2026-06-21', estado: 'rechazada', docs: 2 },
]

// Etiquetas de estado de postulación
export const estadoPostulacion = {
  pendiente: { etiqueta: 'Pendiente', color: 'var(--servicio)' },
  revision: { etiqueta: 'En revisión', color: 'var(--verde-claro)' },
  aprobada: { etiqueta: 'Aprobada', color: 'var(--disponible)' },
  rechazada: { etiqueta: 'Rechazada', color: 'var(--emergencia)' },
}

// Resumen para el dashboard
export const resumenPanel = {
  bomberosActivos: 11,
  unidadesDisponibles: 2,
  turnosAbiertos: 3,
  postulacionesPendientes: 2,
}
