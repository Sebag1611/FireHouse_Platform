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
   TURNOS · Planilla semanal con rotación automática
   ------------------------------------------------------------
   Hay UNA sola planilla activa por semana. Cada semana el sistema
   alterna automáticamente el TIPO (diurno ↔ nocturno) y el
   TENIENTE a cargo, siguiendo esta regla acordada:
     - Semana diurna   -> encargado: Teniente 1º
     - Semana nocturna -> encargado: Teniente 2º
   La semana de referencia arranca en DIURNO.

   Cada planilla se divide en BLOQUES (día + franja horaria) con un
   LÍMITE DE CUPOS. Los bomberos se anotan; los primeros en llenar
   el cupo quedan. Antes de cerrarse se ve "anotados / cupos" (sin
   nombres); al llenarse, el bloque se cierra y se revelan los
   seleccionados.

   'anotados' es una lista de nombres (no un número), para poder
   revelarlos al cerrarse.
   ------------------------------------------------------------ */

// Franjas horarias del turno diurno (bloques de 4 horas).
const FRANJAS_DIURNO = ['09:30 a 13:30', '13:30 a 17:30', '17:30 a 21:30']
// Días que cubre una guardia semanal.
const DIAS_SEMANA = ['Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

// Calcula el número de semana del año (ISO simplificado). Sirve
// para alternar el turno automáticamente semana a semana.
function numeroSemana(fecha = new Date()) {
  const inicioAnio = new Date(fecha.getFullYear(), 0, 1)
  const dias = Math.floor((fecha - inicioAnio) / 86400000)
  return Math.ceil((dias + inicioAnio.getDay() + 1) / 7)
}

// Genera los bloques de una guardia diurna (3 franjas por día).
function generarBloquesDiurno() {
  const bloques = []
  for (const dia of DIAS_SEMANA) {
    for (const franja of FRANJAS_DIURNO) {
      bloques.push({
        id: `d-${dia}-${franja}`.replace(/[\s:]/g, ''),
        dia,
        horario: franja,
        cupos: 4,
        anotados: [],
        inscritoYo: false,
      })
    }
  }
  return bloques
}

// Genera los bloques de una guardia nocturna (1 franja por día).
function generarBloquesNocturno() {
  return DIAS_SEMANA.map((dia) => ({
    id: `n-${dia}`.replace(/[\s:]/g, ''),
    dia,
    horario: '21:30 a 09:30',
    cupos: 6,
    anotados: [],
    inscritoYo: false,
  }))
}

// Construye la planilla de la semana según su número (rotación).
function generarPlanillaSemana(fecha = new Date()) {
  // La semana actual arranca en DIURNO (según lo acordado). Se toma
  // la paridad de la semana actual como referencia "diurna", de modo
  // que a partir de aquí alterne diurno/nocturno cada semana.
  const SEMANA_BASE = numeroSemana(new Date(2026, 6, 14)) // 14-jul-2026
  const esDiurno = (numeroSemana(fecha) - SEMANA_BASE) % 2 === 0

  const tipo = esDiurno ? 'diurno' : 'nocturno'
  // Teniente fijo por tipo (rotación acordada).
  const encargado = esDiurno ? 'teniente1' : 'teniente2'

  return {
    id: `semana-${numeroSemana(fecha)}`,
    titulo: esDiurno ? 'Turno Diurno' : 'Guardia Nocturna',
    subtitulo: `Semana ${numeroSemana(fecha)} · ${fecha.getFullYear()}`,
    plazo: esDiurno
      ? 'Franjas de 09:30 a 21:30 hrs.'
      : 'Franja única: 21:30 a 09:30 hrs.',
    tipo,
    encargado,
    tareas: [
      'Revisión de material mayor y menor',
      'Control de equipos de respiración autónoma',
      'Limpieza y orden del cuartel',
    ],
    bloques: esDiurno ? generarBloquesDiurno() : generarBloquesNocturno(),
  }
}

// Planilla activa de la semana actual (una sola).
export const planillaActual = generarPlanillaSemana()

// Se mantiene como arreglo de una posición para compatibilidad con
// la vista (que itera sobre las planillas).
export const planillasTurno = [planillaActual]

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
