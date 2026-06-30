import './Logo.css'

// Logo institucional: escudo + wordmark "FIREHOUSE PLATFORM"
export default function Logo({ compacto = false }) {
  return (
    <span className={`logo ${compacto ? 'logo--compacto' : ''}`}>
      <svg className="logo__escudo" viewBox="0 0 64 64" aria-hidden="true">
        <path
          d="M32 6 12 12v18c0 14 20 28 20 28s20-14 20-28V12L32 6Z"
          fill="var(--rojo)"
        />
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
