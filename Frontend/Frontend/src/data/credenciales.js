/**
 * ============================================================
 *  CREDENCIALES DE PRUEBA (carcasa sin backend)
 * ============================================================
 *  Usuarios de demostración para el inicio de sesión mientras no
 *  hay backend. Cada RUT se asocia a un rango del sistema.
 *
 *  ⚠️ IMPORTANTE: esto es SOLO para la demo. Las contraseñas están
 *  en texto plano a propósito, porque no hay servidor que valide.
 *  En producción, la autenticación y las contraseñas (cifradas)
 *  se manejan en el backend (JWT), NUNCA en el frontend.
 * ============================================================
 */

// Contraseña común para todos los usuarios de prueba.
const CLAVE_DEMO = 'pass123'

// Mapa de RUT -> rango del sistema (ver data/roles.js).
const USUARIOS = [
  { rut: '18123456-3', clave: CLAVE_DEMO, rangoId: 'capitan' },
  { rut: '19234567-7', clave: CLAVE_DEMO, rangoId: 'director' },
  { rut: '20345678-6', clave: CLAVE_DEMO, rangoId: 'teniente1' },
  // Bombero de base.
  { rut: '12312312-3', clave: CLAVE_DEMO, rangoId: 'bombero' },
]

/**
 * Valida un intento de inicio de sesión.
 * @param {string} rut   - RUT ya formateado (ej. "18123456-3").
 * @param {string} clave - Contraseña ingresada.
 * @returns {{ ok: boolean, rangoId?: string }} resultado.
 *
 * Devuelve ok=true y el rango si las credenciales coinciden;
 * ok=false si el RUT no existe o la contraseña es incorrecta.
 */
export function validarCredenciales(rut, clave) {
  const usuario = USUARIOS.find((u) => u.rut === rut)
  if (!usuario || usuario.clave !== clave) {
    return { ok: false }
  }
  return { ok: true, rangoId: usuario.rangoId }
}
