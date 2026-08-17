/**
 * Sesión del lado del cliente: tokens y empresa activa.
 *
 * El backend acepta dos mecanismos, cookie de `express-session` o
 * `Authorization: Bearer`. Esta app usa Bearer a propósito.
 *
 * La cookie del backend es `sameSite: "lax"`, y una cookie lax NO viaja en
 * XHR cross-site: con el front en un dominio y el API en otro, la sesión
 * simplemente no existiría en producción — y funcionaría perfecto en local,
 * que es la peor forma de romperse. Bearer no depende del dominio, y es lo
 * que va a necesitar la app móvil de todos modos.
 *
 * Dónde vive cada cosa:
 *
 * - `accessToken` en memoria. Vive 45 min y se renueva solo; guardarlo en
 *   `localStorage` lo dejaría legible por cualquier script inyectado sin
 *   ganar nada, porque se puede recuperar con el refresh.
 * - `refreshToken` en `localStorage`. Tiene que sobrevivir a un reload, y no
 *   hay dónde más ponerlo sin cookie. Es rotativo y de un solo uso: el
 *   backend revoca el presentado en cada intercambio y trata la reutilización
 *   como robo, revocando toda la cadena.
 * - `companyId` en `localStorage`. Va en `x-company-id` en cada request. El
 *   header sólo SELECCIONA entre las empresas de las que el usuario ya es
 *   miembro; no afirma pertenencia, así que un valor viejo no da acceso a
 *   nada, sólo un `FORBIDDEN`.
 */

const REFRESH_TOKEN_KEY = "adpaws.refreshToken";
const COMPANY_ID_KEY = "adpaws.companyId";

let accessToken: string | null = null;

/** Suscriptores para que la UI reaccione a un cierre de sesión desde el link. */
type SessionListener = () => void;
const listeners = new Set<SessionListener>();

export function onSessionCleared(listener: SessionListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    // Safari en modo privado lanza al tocar localStorage.
    return null;
  }
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export function setTokens({ accessToken: access, refreshToken }: TokenPair): void {
  accessToken = access;
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch {
    // Sin persistencia la sesión dura lo que la pestaña. Es degradado, no roto.
  }
}

export function getCompanyId(): string | null {
  try {
    return localStorage.getItem(COMPANY_ID_KEY);
  } catch {
    return null;
  }
}

export function setCompanyId(companyId: string | null): void {
  try {
    if (companyId === null) localStorage.removeItem(COMPANY_ID_KEY);
    else localStorage.setItem(COMPANY_ID_KEY, companyId);
  } catch {
    /* ídem */
  }
}

/** Borra todo rastro local. No habla con el servidor: eso es `logoutUser`. */
export function clearSession(): void {
  accessToken = null;
  try {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(COMPANY_ID_KEY);
  } catch {
    /* ídem */
  }
  for (const listener of listeners) listener();
}

export function hasSession(): boolean {
  return accessToken !== null || getRefreshToken() !== null;
}
