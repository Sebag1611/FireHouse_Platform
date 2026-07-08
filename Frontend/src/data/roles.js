/* ============================================================
   ROLES Y PERMISOS · Área privada
   ------------------------------------------------------------
   Define los rangos de la 3ra Compañía, su agrupación en
   niveles de permiso y qué puede hacer cada uno.

   Requisitos del cliente:
   - Capitán y Director        -> permiso máximo (administradores).
   - Tenientes 1/2/3           -> operativos.
   - Ayudantes 1/2             -> operativos, pero SÍ marcan turno.
   - Secretaria                -> administrativa: edita bomberos.
   - Tesorera                  -> lectura ("que figure como oficial").
   - Bombero                   -> base: todo voluntario sin cargo.

   Turnos (asistencia): TODOS pueden ver la sección de turnos,
   pero solo requieren marcar asistencia los que no son mando:
   Bomberos, Ayudantes, Secretaria y Tesorera. Director, Capitán
   y Tenientes la ven en modo consulta (no se inscriben).

   Cada rango tiene un número identificador oficial (ej. 302),
   que forma parte de su identidad dentro de la compañía.
   ============================================================ */

// Lista de permisos posibles del sistema (llaves internas)
export const PERMISOS = {
  VER_PANEL: 'ver_panel',
  VER_BOMBEROS: 'ver_bomberos',
  EDITAR_BOMBEROS: 'editar_bomberos',
  CAMBIAR_RANGOS: 'cambiar_rangos',
  MOVER_MATERIAL: 'mover_material',
  CAMBIAR_ESTADO_UNIDAD: 'cambiar_estado_unidad',
  GESTIONAR_COMUNICADOS: 'gestionar_comunicados',
  VER_TURNOS: 'ver_turnos',              // ver la planilla de turnos
  MARCAR_ASISTENCIA_TURNO: 'marcar_turno', // inscribirse en un bloque
  VER_POSTULACIONES: 'ver_postulaciones',
}

// Niveles de permiso (agrupan varios rangos)
export const NIVELES = {
  ADMIN: {
    id: 'admin',
    etiqueta: 'Administrador',
    color: 'var(--emergencia)',
    permisos: [
      PERMISOS.VER_PANEL,
      PERMISOS.VER_BOMBEROS,
      PERMISOS.EDITAR_BOMBEROS,
      PERMISOS.CAMBIAR_RANGOS,
      PERMISOS.MOVER_MATERIAL,
      PERMISOS.CAMBIAR_ESTADO_UNIDAD,
      PERMISOS.GESTIONAR_COMUNICADOS,
      PERMISOS.VER_TURNOS, // ven turnos, pero NO marcan asistencia
      PERMISOS.VER_POSTULACIONES,
    ],
  },
  // Tenientes: operativos que ven turnos pero no marcan asistencia.
  OPERATIVO_MANDO: {
    id: 'operativo_mando',
    etiqueta: 'Oficial operativo',
    color: 'var(--servicio)',
    permisos: [
      PERMISOS.VER_PANEL,
      PERMISOS.VER_BOMBEROS,
      PERMISOS.MOVER_MATERIAL,
      PERMISOS.CAMBIAR_ESTADO_UNIDAD,
      PERMISOS.GESTIONAR_COMUNICADOS,
      PERMISOS.VER_TURNOS, // ven, no se inscriben
      PERMISOS.VER_POSTULACIONES,
    ],
  },
  // Ayudantes: operativos que SÍ marcan asistencia en turnos.
  OPERATIVO: {
    id: 'operativo',
    etiqueta: 'Oficial operativo',
    color: 'var(--servicio)',
    permisos: [
      PERMISOS.VER_PANEL,
      PERMISOS.VER_BOMBEROS,
      PERMISOS.MOVER_MATERIAL,
      PERMISOS.CAMBIAR_ESTADO_UNIDAD,
      PERMISOS.GESTIONAR_COMUNICADOS,
      PERMISOS.VER_TURNOS,
      PERMISOS.MARCAR_ASISTENCIA_TURNO,
      PERMISOS.VER_POSTULACIONES,
    ],
  },
  ADMINISTRATIVO: {
    id: 'administrativo',
    etiqueta: 'Oficial administrativo',
    color: 'var(--verde-claro)',
    permisos: [
      PERMISOS.VER_PANEL,
      PERMISOS.VER_BOMBEROS,
      PERMISOS.EDITAR_BOMBEROS, // la secretaria SÍ edita
      PERMISOS.GESTIONAR_COMUNICADOS,
      PERMISOS.VER_TURNOS,
      PERMISOS.MARCAR_ASISTENCIA_TURNO,
      PERMISOS.VER_POSTULACIONES,
    ],
  },
  LECTURA: {
    id: 'lectura',
    etiqueta: 'Oficial (solo lectura)',
    color: 'var(--gris-tenue)',
    permisos: [
      PERMISOS.VER_PANEL,
      PERMISOS.VER_BOMBEROS,
      PERMISOS.VER_TURNOS,
      PERMISOS.MARCAR_ASISTENCIA_TURNO, // la tesorera marca asistencia
    ],
  },
  // Bombero base: voluntario sin cargo. Ve el panel, ve turnos y
  // marca asistencia (es justamente quien más lo necesita).
  BOMBERO: {
    id: 'bombero',
    etiqueta: 'Bombero',
    color: 'var(--verde-claro)',
    permisos: [
      PERMISOS.VER_PANEL,
      PERMISOS.VER_TURNOS,
      PERMISOS.MARCAR_ASISTENCIA_TURNO,
    ],
  },
}

// Rangos oficiales, con su número identificador y nombre real.
// El "orden" respeta la jerarquía de la compañía.
export const RANGOS = [
  { id: 'director', numero: 73, nombre: 'Directora', persona: 'Evelyn Cruz Cruz', nivel: 'ADMIN', orden: 1 },
  { id: 'capitan', numero: 43, nombre: 'Capitán', persona: 'Ivan Villagra Pacan', nivel: 'ADMIN', orden: 2 },
  { id: 'teniente1', numero: 301, nombre: 'Teniente Primero', persona: 'Jeferson Araya', nivel: 'OPERATIVO_MANDO', orden: 3 },
  { id: 'teniente2', numero: 302, nombre: 'Teniente Segundo', persona: 'Omar Cruz', nivel: 'OPERATIVO_MANDO', orden: 4 },
  { id: 'teniente3', numero: 303, nombre: 'Teniente Tercero', persona: 'Pablo Valdes', nivel: 'OPERATIVO_MANDO', orden: 5 },
  { id: 'ayudante1', numero: 305, nombre: 'Ayudante Primero', persona: 'Juan Pacheco', nivel: 'OPERATIVO', orden: 6 },
  { id: 'ayudante2', numero: 306, nombre: 'Ayudante Segundo', persona: 'Lissete Perez de Arce', nivel: 'OPERATIVO', orden: 7 },
  { id: 'secretario', numero: 307, nombre: 'Secretaria', persona: 'Natalia Anza', nivel: 'ADMINISTRATIVO', orden: 8 },
  { id: 'tesorero', numero: 308, nombre: 'Tesorera', persona: 'Allison Maulen', nivel: 'LECTURA', orden: 9 },
  // Rango base para todo voluntario sin cargo asignado.
  { id: 'bombero', numero: null, nombre: 'Bombero', persona: 'Voluntario de base', nivel: 'BOMBERO', orden: 10 },
]

// --- Helpers ---

// Devuelve el objeto de rango a partir de su id
export function getRango(idRango) {
  return RANGOS.find((r) => r.id === idRango) ?? RANGOS[0]
}

// Devuelve el nivel de permiso de un rango
export function getNivel(idRango) {
  const rango = getRango(idRango)
  return NIVELES[rango.nivel]
}

// Pregunta si un rango tiene un permiso concreto
export function puede(idRango, permiso) {
  return getNivel(idRango).permisos.includes(permiso)
}

// Descripción legible del nivel para mostrar en pantalla
export function etiquetaNivel(idRango) {
  return getNivel(idRango).etiqueta
}

// Nombre completo con número identificador (ej. "302 · Omar Cruz").
// Si el rango no tiene número (Bombero base), devuelve solo el nombre.
export function nombreConNumero(idRango) {
  const r = getRango(idRango)
  return r.numero ? `${r.numero} · ${r.persona}` : r.persona
}
