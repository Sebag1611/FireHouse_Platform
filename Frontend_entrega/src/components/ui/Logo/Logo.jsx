import './Logo.css'

/**
 * Logo institucional: escudo vectorial + wordmark "FIREHOUSE PLATFORM".
 *
 * @param {boolean} compacto - Versión reducida para barras (navbar/panel).
 *
 * El escudo se dibuja en SVG (no es una imagen) para que se vea
 * nítido a cualquier tamaño y tome el verde institucional desde
 * las variables CSS.
 */
export default function Logo({ compacto = false }) {
  return (
    <span className={`logo ${compacto ? 'logo--compacto' : ''}`}>
      <svg className="logo__escudo" viewBox="0 0 64 64" aria-hidden="true">
        {/* Escudo dividido: mitad verde y mitad roja, representando
            las dos identidades del personal de la compañía. */}
        <defs>
          <clipPath id="escudo-forma">
            <path d="M32 6 12 12v18c0 14 20 28 20 28s20-14 20-28V12L32 6Z" />
          </clipPath>
        </defs>
        <g clipPath="url(#escudo-forma)">
          <rect x="0" y="0" width="32" height="64" fill="var(--verde)" />
          <rect x="32" y="0" width="32" height="64" fill="var(--rojo)" />
        </g>
        {/* Contorno del escudo */}
        <path
          d="M32 6 12 12v18c0 14 20 28 20 28s20-14 20-28V12L32 6Z"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.5"
        />
        {/* Llama central */}
        <path
          d="M32 17c2.4 6.6 6.8 8.8 6.8 15.4A6.8 6.8 0 0 1 25.2 32c0-2.2.6-3.4 1.4-4.5C28 25 28 21.5 32 17Z"
          fill="#fff"
        />
      </svg>
      <span className="logo__texto">
        <strong>FIREHOUSE</strong>
        <em>PLATFORM</em>
      </span>
    </span>
  )
}
