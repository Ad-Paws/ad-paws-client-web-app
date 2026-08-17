import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";
import { from, switchMap } from "rxjs";
import {
  clearSession,
  getAccessToken,
  getCompanyId,
  getRefreshToken,
  setTokens,
} from "@/lib/session";
import { hasErrorCode } from "./errors";

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

/**
 * Operaciones que no deben reintentarse tras un refresh: o son las que
 * producen la sesión, o reintentarlas provocaría un bucle.
 */
const SESSION_OPERATIONS = new Set(["RefreshSession", "SignInUser", "LogoutUser"]);

/**
 * Renovación de sesión, en un solo vuelo.
 *
 * El refresh token es rotativo y de un solo uso: el backend revoca el
 * presentado y emite un sucesor, y trata la reutilización como robo revocando
 * TODA la cadena del usuario. Si tres queries fallan a la vez con
 * `UNAUTHENTICATED` y cada una dispara su propio refresh, dos de ellas
 * presentan un token ya canjeado y el backend cierra la sesión entera. De ahí
 * la promesa compartida: el primero renueva, los demás esperan ese resultado.
 */
let refreshInFlight: Promise<boolean> | null = null;

async function performRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_URL}/graphql`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        // El backend tiene csrfPrevention activo; content-type json ya lo
        // satisface, pero este header lo hace explícito para el preflight.
        "apollo-require-preflight": "true",
      },
      body: JSON.stringify({
        operationName: "RefreshSession",
        query: `mutation RefreshSession($refreshToken: String!) {
          refreshSession(refreshToken: $refreshToken) { accessToken refreshToken }
        }`,
        variables: { refreshToken },
      }),
    });

    const payload = (await response.json()) as {
      data?: { refreshSession?: { accessToken: string; refreshToken: string } };
    };

    const tokens = payload.data?.refreshSession;
    if (!tokens) return false;

    setTokens(tokens);
    return true;
  } catch {
    return false;
  }
}

/**
 * Se usa `fetch` directo y no el propio cliente para evitar la recursión
 * obvia: renovar a través del link que dispara la renovación.
 */
function refreshSession(): Promise<boolean> {
  refreshInFlight ??= performRefresh().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

/**
 * Cada request lleva quién llama y sobre qué empresa actúa.
 *
 * `x-company-id` se manda siempre que se conozca, incluso con una sola
 * membresía: un usuario puede ganar una segunda en cualquier momento, y un
 * cliente que sólo contempla una se rompe en silencio ese día.
 */
const authLink = new SetContextLink((prevContext) => {
  const token = getAccessToken();
  const companyId = getCompanyId();

  return {
    ...prevContext,
    headers: {
      ...prevContext.headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(companyId ? { "x-company-id": companyId } : {}),
    },
  };
});

/**
 * `UNAUTHENTICATED` → un intento de renovación y un reintento. Si la
 * renovación falla, se limpia la sesión local y la UI reacciona vía
 * `onSessionCleared` — el link no navega, porque un link que sabe de rutas es
 * un link que no se puede probar.
 */
const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (!hasErrorCode(error, "UNAUTHENTICATED")) return;
  if (SESSION_OPERATIONS.has(operation.operationName ?? "")) return;

  // Un solo reintento por operación.
  const context = operation.getContext() as { retriedAfterRefresh?: boolean };
  if (context.retriedAfterRefresh) {
    clearSession();
    return;
  }

  return from(refreshSession()).pipe(
    switchMap((renewed) => {
      if (!renewed) {
        clearSession();
        throw error;
      }
      operation.setContext({ retriedAfterRefresh: true });
      return forward(operation);
    }),
  );
});

/**
 * `UploadHttpLink` en vez de `HttpLink`: `uploadDogImage` manda multipart, y
 * ese caso necesita el header de preflight que exige `csrfPrevention`.
 *
 * `credentials: "include"` se mantiene para que la cookie siga funcionando en
 * local, donde front y API comparten origen. No es el mecanismo principal.
 */
const uploadLink = new UploadHttpLink({
  uri: `${API_URL}/graphql`,
  credentials: "include",
  headers: {
    "Apollo-Require-Preflight": "true",
  },
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, uploadLink]),
  cache: new InMemoryCache(),
});
