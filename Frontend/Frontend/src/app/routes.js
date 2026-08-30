/**
 * ============================================================
 *  RUTAS DE LA APLICACIÓN
 * ============================================================
 *  Centraliza TODAS las URLs del sitio en un solo lugar.
 *
 *  ¿Por qué?
 *  - Evita "magic strings" repartidos por el código. Si una URL
 *    cambia, se edita aquí una sola vez y no en 15 archivos.
 *  - Da autocompletado y previene errores de tipeo (ROUTES.PANEL
 *    en vez de escribir "/panel" a mano cada vez).
 *  - Sirve como índice legible de todo el mapa del sitio.
 *
 *  Convención: agrupamos las rutas públicas y las privadas para
 *  que se entienda de un vistazo qué pertenece a cada área.
 * ============================================================
 */

export const ROUTES = {
  // ---------- Cara pública ----------
  HOME: '/',
  NOSOTROS: '/nosotros',
  UNIDADES: '/unidades',
  NOTICIAS: '/noticias',
  CONTACTO: '/contacto',
  POSTULAR: '/postular',
  ACCESO: '/acceso',

  // ---------- Área privada (panel interno) ----------
  PANEL: '/panel',
  PANEL_PERSONAL: '/panel/personal',
  PANEL_UNIDADES: '/panel/unidades',
  PANEL_TURNOS: '/panel/turnos',
  PANEL_CURSOS: '/panel/cursos',
  PANEL_COMUNICADOS: '/panel/comunicados',
  PANEL_POSTULACIONES: '/panel/postulaciones',
}

/**
 * Enlaces del menú de navegación público.
 * Se define aquí (y no dentro del Navbar) para que el orden y los
 * textos del menú sean fáciles de mantener junto a las rutas.
 */
export const NAV_PUBLICO = [
  { to: ROUTES.HOME, label: 'Inicio', exacto: true },
  { to: ROUTES.NOSOTROS, label: 'Nosotros' },
  { to: ROUTES.UNIDADES, label: 'Material Mayor' },
  { to: ROUTES.NOTICIAS, label: 'Noticias' },
  { to: ROUTES.CONTACTO, label: 'Contacto' },
]
