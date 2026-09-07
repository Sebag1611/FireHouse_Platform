/**
 * ============================================================
 *  Validaciones de formularios
 * ============================================================
 *  Funciones simples y reutilizables para validar campos comunes.
 *  Devuelven true/false. Se centralizan aquí para que todos los
 *  formularios validen igual.
 * ============================================================
 */

// Correo con un formato básico válido (algo@algo.algo).
export function correoValido(correo) {
  if (!correo) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())
}

// Edad dentro de un rango razonable para un voluntario (18 a 99).
export function edadValida(edad) {
  const n = Number(edad)
  return Number.isInteger(n) && n >= 18 && n <= 99
}

// RUT chileno con el formato cuerpo-dígito (ej. 12345678-9).
// Valida forma, no el dígito verificador (eso lo hace el backend).
export function rutFormatoValido(rut) {
  if (!rut) return false
  return /^\d{7,8}-[\dkK]$/.test(rut.trim())
}

// Teléfono chileno con formato +56 9 XXXX XXXX (o al menos 9 dígitos).
export function telefonoValido(telefono) {
  if (!telefono) return false
  const digitos = telefono.replace(/\D/g, '')
  return digitos.length >= 9
}
