/**
 * ============================================================
 *  Utilidades de formato chileno (RUT y teléfono)
 * ============================================================
 *  Funciones compartidas para dar formato a RUT y teléfonos en
 *  el formato que usa la compañía (y que espera la base de datos).
 *  Se centralizan aquí para no duplicar la lógica entre el login
 *  y los formularios de alta de personal.
 * ============================================================
 */

/**
 * Limpia un RUT dejando solo dígitos y la letra K (verificador).
 * No agrega el guion (eso lo hace formatearRutConGuion).
 */
export function limpiarRut(valor) {
  let limpio = valor.replace(/[^0-9kK]/g, '')
  // La 'k' solo vale como último carácter (dígito verificador).
  limpio = limpio.replace(/[kK]/g, (match, offset) =>
    offset === limpio.length - 1 ? 'K' : ''
  )
  return limpio.toUpperCase()
}

/**
 * Formatea un RUT al formato de la base de datos: cuerpo + guion +
 * dígito verificador (ej. "12345678-9"). Sin puntos.
 */
export function formatearRutConGuion(valor) {
  const limpio = limpiarRut(valor)
  if (limpio.length < 2) return limpio
  return `${limpio.slice(0, -1)}-${limpio.slice(-1)}`
}

/**
 * Formatea un teléfono chileno al formato "+56 9 XXXX XXXX".
 * Toma los dígitos ingresados y los agrupa. Acepta que el usuario
 * escriba con o sin el +56; siempre normaliza a ese formato.
 */
export function formatearTelefono(valor) {
  // Solo dígitos.
  let d = valor.replace(/\D/g, '')
  // Si viene con 56 al inicio (código país), lo quitamos para
  // reconstruirlo de forma uniforme.
  if (d.startsWith('56')) d = d.slice(2)
  // Quitamos un 9 inicial extra si el usuario lo repitió.
  // Nos quedamos con los últimos 9 dígitos (9 + 8 del número).
  d = d.slice(-9)

  if (d.length === 0) return ''
  // Construye progresivamente: +56 9 XXXX XXXX
  let out = '+56'
  if (d.length >= 1) out += ' ' + d[0]           // el 9
  if (d.length >= 2) out += ' ' + d.slice(1, 5)  // primeros 4
  if (d.length >= 6) out += ' ' + d.slice(5, 9)  // últimos 4
  return out
}
