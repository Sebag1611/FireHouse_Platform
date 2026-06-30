/* ============================================================
   Datos de ejemplo (mock) para la cara pública.
   En producción, estos arreglos se reemplazan por llamadas
   a la API REST del backend (Python / Node + base de datos).
   Cada export corresponde a una Historia de Usuario del informe.
   ============================================================ */

// HU-02 — Catálogo de Material Mayor
export const unidades = [
  {
    id: 'B-3',
    nombre: 'Carro de Ataque B-3',
    tipo: 'Bomba / Combate de Incendios',
    marca: 'Mercedes-Benz Atego',
    anio: 2019,
    estado: 'disponible',
    descripcion:
      'Unidad principal de combate de incendios estructurales. Estanque de 3.000 L y sistema de espuma AFFF.',
  },
  {
    id: 'RX-3',
    nombre: 'Rescate Vehicular RX-3',
    tipo: 'Rescate Vehicular Ligero',
    marca: 'Ford F-4000',
    anio: 2021,
    estado: 'disponible',
    descripcion:
      'Equipada con herramientas hidráulicas de extricación (mordaza, separador) para accidentes de tránsito.',
  },
  {
    id: 'H-3',
    nombre: 'Unidad HazMat H-3',
    tipo: 'Materiales Peligrosos (HazMat)',
    marca: 'Iveco Daily',
    anio: 2018,
    estado: 'servicio',
    descripcion:
      'Respuesta a incidentes con materiales peligrosos. Trajes nivel A/B y equipos de detección de gases.',
  },
  {
    id: 'K9-3',
    nombre: 'Unidad Canina USAR K9',
    tipo: 'Búsqueda y Rescate (USAR K9)',
    marca: 'Toyota Hilux',
    anio: 2022,
    estado: 'disponible',
    descripcion:
      'Apoyo a búsqueda y rescate de personas vivas con unidad canina certificada.',
  },
  {
    id: 'Q-3',
    nombre: 'Carro Aljibe Q-3',
    tipo: 'Abastecimiento de Agua',
    marca: 'Volkswagen Constellation',
    anio: 2017,
    estado: 'taller',
    descripcion:
      'Abastecimiento de agua en incendios de gran magnitud. Capacidad de estanque de 8.000 L.',
  },
  {
    id: 'BX-3',
    nombre: 'Carro de Transporte BX-3',
    tipo: 'Transporte de Personal',
    marca: 'Hyundai H1',
    anio: 2020,
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
    clave: '10-2-1 · Accidente Vehicular',
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
    clave: '10-0-2 · Amago de Incendio',
    sector: 'Sector Centro',
  },
]

// Etiquetas legibles para cada estado operativo (HU-13)
export const estadosOperativos = {
  disponible: { etiqueta: 'Disponible', color: 'var(--disponible)' },
  emergencia: { etiqueta: 'En Emergencia', color: 'var(--emergencia)' },
  servicio: { etiqueta: 'Acto de Servicio', color: 'var(--servicio)' },
  taller: { etiqueta: 'Fuera de Servicio', color: 'var(--taller)' },
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
