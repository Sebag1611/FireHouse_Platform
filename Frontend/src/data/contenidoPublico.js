/**
 * ============================================================
 *  DATOS · Contenido de la cara pública (mock)
 * ============================================================
 *  Datos de ejemplo que alimentan las vistas públicas.
 *
 *  ¿Por qué un archivo de datos separado?
 *  Hoy son arreglos fijos ("mock"), pero mañana vendrán de la
 *  API REST del backend. Al tenerlos aislados aquí, conectar el
 *  backend será cambiar SOLO este archivo por llamadas fetch,
 *  sin tocar ninguna vista. Cada export mapea a una Historia de
 *  Usuario (HU) del informe de gestión del proyecto.
 * ============================================================
 */

// HU-02 — Catálogo de Material Mayor
export const unidades = [
  {
    id: 'B-3',
    nombre: 'B-3',
    tipo: 'Combate de incendios estructurales',
    marca: 'Spartan Metro Star',
    anio: 2019,
    estado: 'disponible',
    descripcion:
      'Unidad principal de combate de incendios estructurales. Estanque de 4.000 L y Bomba Darley con 1250 GPM',
  },
  {
    id: 'BX-3',
    nombre: 'BX-3',
    tipo: 'Incendios',
    marca: 'Renault Camiva',
    anio: 2003,
    estado: 'disponible',
    descripcion:
      'Maquina de segunda intervencion para incendios, y principal para incendios en lugares de dificil acceso',
  },
  {
    id: 'RH-3',
    nombre: 'RH-3',
    tipo: 'Materiales Peligrosos (HazMat) y Rescate Vehicular',
    marca: 'Ferrara Cindinder',
    anio: 2016,
    estado: 'servicio',
    descripcion:
      'Respuesta a incidentes con materiales peligrosos y equipada con material de rescate vehicular',
  },
  {
    id: 'BT-3',
    nombre: 'BT-3',
    tipo: 'Abastecimiento',
    marca: 'Iveco Trakker',
    anio: 2019,
    estado: 'taller',
    descripcion:
      'Abastecimiento de agua en incendios. Capacidad de estanque de 12.000 L y una bomba Magirus 750 GPM',
  },
  {
    id: 'J-3',
    nombre: 'J-3',
    tipo: 'Transporte de Personal',
    marca: 'Nissan xtrail',
    anio: 2017,
    estado: 'emergencia',
    descripcion:
      'Traslado de voluntarios y equipamiento menor a la zona de operaciones.',
  },
]

// HU-05 — Portal de Noticias
export const noticias = [
  {
    id: 1,
    titulo: 'Nueva academia de Materiales Peligrosos para voluntarios 2026',
    resumen:
      'Durante el mes de julio se dictará la academia HazMat nivel operativo, abierta a todo el personal activo de la compañía.',
    fecha: '2026-06-20',
    categoria: 'Capacitación',
  },
  {
    id: 2,
    titulo: 'La 3ra Compañía incorpora nuevo sistema digital de gestión',
    resumen:
      'FireHouse Platform centralizará turnos, material mayor y postulaciones en un solo sistema seguro y en tiempo real.',
    fecha: '2026-06-12',
    categoria: 'Institucional',
  },
  {
    id: 3,
    titulo: 'Conmemoración del 68° aniversario de la compañía',
    resumen:
      'Con una ceremonia en el cuartel, la 3ra Compañía celebró un nuevo aniversario de servicio a la comunidad de Calama.',
    fecha: '2026-05-18',
    categoria: 'Comunidad',
  },
]

// HU-06 — Registro automático de emergencias recientes
// (Sin direcciones exactas por seguridad, según criterio de aceptación)
export const emergencias = [
  {
    id: 'A-1042',
    fecha: '2026-06-27',
    hora: '03:14',
    clave: '10-0-1 · Incendio Estructural',
    sector: 'Sector Norte',
  },
  {
    id: 'A-1041',
    fecha: '2026-06-26',
    hora: '18:47',
    clave: '10-2-1 · Quema de Pastizal',
    sector: 'Av. Circunvalación',
  },
  {
    id: 'A-1040',
    fecha: '2026-06-25',
    hora: '11:02',
    clave: '10-5-0 · Material Peligroso',
    sector: 'Zona Industrial',
  },
  {
    id: 'A-1039',
    fecha: '2026-06-24',
    hora: '22:30',
    clave: '10-0-2 · Incendio en construccion de 3 pisos o mas',
    sector: 'Sector Centro',
  },
]

// Etiquetas legibles para cada estado operativo (HU-13)
// Colores alineados con la versión del equipo (verde/naranjo/azul/rojo).
export const ESTADOS_OPERATIVOS = {
  disponible: { etiqueta: 'Disponible', color: 'Green' },
  emergencia: { etiqueta: 'En Emergencia', color: 'Orange' },
  servicio: { etiqueta: 'Acto de Servicio', color: 'Blue' },
  taller: { etiqueta: 'Fuera de Servicio', color: 'Red' },
}

// HU-08 — Estado de turno actual (banner del home)
export const turnoActual = {
  tipo: 'Guardia Nocturna',
  horario: '20:00 — 08:00 hrs',
  oficial: 'Tte. de turno asignado',
}

// Redes sociales oficiales (HU-01)
export const redes = [
  { nombre: 'Instagram', url: 'https://instagram.com', icono: 'instagram' },
  { nombre: 'Facebook', url: 'https://facebook.com', icono: 'facebook' },
  { nombre: 'YouTube', url: 'https://youtube.com', icono: 'youtube' },
]
