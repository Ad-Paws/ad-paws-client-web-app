/**
 * Política de contraseñas, la misma que aplica el servidor.
 *
 * `assertPasswordPolicy` en el backend exige 10 caracteres con letras y
 * números, y la rechaza en las tres rutas que fijan contraseña: alta, reset y
 * cambio. El formulario pedía 8 y sin exigir dígitos, así que una contraseña
 * "válida" en la UI moría con VALIDATION_ERROR al enviarla. Duplicar la regla
 * aquí es deliberado: sirve para avisar antes, no para autorizar — quien
 * decide sigue siendo el servidor.
 */

export const PASSWORD_MIN_LENGTH = 10;

export const PASSWORD_HINT = "Mínimo 10 caracteres, con letras y números.";

/** Devuelve el motivo del rechazo, o null si pasa. */
export function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`;
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "La contraseña debe combinar letras y números.";
  }
  return null;
}
