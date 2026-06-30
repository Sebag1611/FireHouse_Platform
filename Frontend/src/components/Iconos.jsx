/* Iconos SVG inline — sin dependencias externas.
   Heredan el color del texto vía currentColor. */

const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const IconoCasco = (p) => (
  <svg {...base} {...p}>
    <path d="M2 17h20a10 10 0 0 0-20 0Z" />
    <path d="M12 7V3M9 3h6" />
    <path d="M2 17v2h20v-2" />
  </svg>
)

export const IconoCamion = (p) => (
  <svg {...base} {...p}>
    <path d="M2 16V7a1 1 0 0 1 1-1h11v10" />
    <path d="M14 9h4l3 3v4h-7" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
)

export const IconoCorreo = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)

export const IconoPersona = (p) => (
  <svg {...base} {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9.5" cy="7" r="4" />
    <path d="M19 8v6M22 11h-6" />
  </svg>
)

export const IconoEscudo = (p) => (
  <svg {...base} {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
  </svg>
)

export const IconoFlecha = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const IconoReloj = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)

export const IconoUbicacion = (p) => (
  <svg {...base} {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export const IconoFuego = (p) => (
  <svg {...base} {...p}>
    <path d="M12 2c1 4 4 5 4 9a4 4 0 0 1-8 0c0-1 .3-1.8.8-2.5C9 10 9 8 12 2Z" />
    <path d="M12 22a6 6 0 0 0 6-6c0-2-1-3.5-2-5" />
  </svg>
)

export const IconoArchivo = (p) => (
  <svg {...base} {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6M9 13h6M9 17h6" />
  </svg>
)

export const IconoCheck = (p) => (
  <svg {...base} {...p}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

export const IconoMenu = (p) => (
  <svg {...base} {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

export const IconoCerrar = (p) => (
  <svg {...base} {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)
