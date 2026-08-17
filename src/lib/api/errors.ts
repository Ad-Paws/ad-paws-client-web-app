import { CombinedGraphQLErrors, type ErrorLike } from "@apollo/client";

/**
 * Los códigos que devuelve el backend en `extensions.code`.
 *
 * Están tipados porque son un contrato, no strings sueltos: cada uno tiene una
 * respuesta distinta en la UI, y confundir `FORBIDDEN` con `UNAUTHENTICATED`
 * manda al usuario al login cuando lo que pasa es que le falta un permiso.
 */
export type ApiErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "CONFLICT"
  | "TENANT_CONTEXT_REQUIRED";

/** Primer código de error de la respuesta, si lo hay. */
export function errorCodeOf(error: ErrorLike | undefined): ApiErrorCode | null {
  if (!error || !CombinedGraphQLErrors.is(error)) return null;
  for (const graphQLError of error.errors) {
    const code = graphQLError.extensions?.["code"];
    if (typeof code === "string") return code as ApiErrorCode;
  }
  return null;
}

export function hasErrorCode(error: ErrorLike | undefined, code: ApiErrorCode): boolean {
  if (!error || !CombinedGraphQLErrors.is(error)) return false;
  return error.errors.some((e) => e.extensions?.["code"] === code);
}

/**
 * Mensaje para el usuario final.
 *
 * Los del backend están en inglés y escritos para quien depura, no para quien
 * reserva. Se traducen aquí, en un solo lugar, en vez de en cada pantalla.
 */
const MESSAGES: Record<ApiErrorCode, string> = {
  UNAUTHENTICATED: "Tu sesión expiró. Vuelve a iniciar sesión.",
  FORBIDDEN: "No tienes permiso para hacer esto.",
  NOT_FOUND: "No encontramos lo que buscabas.",
  VALIDATION_ERROR: "Revisa los datos: hay algo que no cuadra.",
  CONFLICT: "Esa acción ya no es posible en este momento.",
  TENANT_CONTEXT_REQUIRED: "Tu cuenta todavía no está vinculada a un negocio.",
};

export function messageFor(error: ErrorLike | undefined): string {
  const code = errorCodeOf(error);
  if (code) return MESSAGES[code] ?? "Algo salió mal. Inténtalo de nuevo.";
  return "No pudimos conectar con el servidor. Revisa tu conexión.";
}
