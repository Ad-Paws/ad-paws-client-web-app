/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apolloClient } from "@/lib/api/apolloClient";
import { ME, MY_COMPANIES, LOGOUT } from "@/graphql/user";
import {
  clearSession,
  getCompanyId,
  getRefreshToken,
  hasSession,
  onSessionCleared,
  setCompanyId,
  setTokens,
  type TokenPair,
} from "@/lib/session";
import type { MeQuery, MyCompaniesQuery } from "@/generated/graphql";

export type User = NonNullable<MeQuery["me"]>;
export type Company = MyCompaniesQuery["myCompanies"][number];

/**
 * En qué situación está la cuenta respecto a los negocios.
 *
 * No es un detalle cosmético: el backend resuelve cada petición contra UNA
 * empresa activa, y sin ella todo lo que toque datos de negocio responde
 * TENANT_CONTEXT_REQUIRED. Una cuenta recién creada sin slug cae justo ahí,
 * así que la app necesita distinguir "no ha iniciado sesión" de "inició
 * sesión pero todavía no pertenece a ningún negocio".
 */
export type MembershipState = "none" | "single" | "multiple";

export interface AuthContextValue {
  user: User | null;
  companies: Company[];
  activeCompany: Company | null;
  membershipState: MembershipState;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Guarda los tokens y carga al usuario. */
  login: (tokens?: TokenPair) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  selectCompany: (companyId: string) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(getCompanyId);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * `me` y `myCompanies` son de las pocas operaciones que funcionan SIN empresa
   * activa (`@auth` a secas). Por eso sirven para arrancar: son lo único que
   * se puede preguntar antes de saber si la cuenta pertenece a algún negocio.
   */
  const fetchUser = useCallback(async () => {
    const [me, mine] = await Promise.all([
      apolloClient.query({ query: ME, fetchPolicy: "network-only" }),
      apolloClient.query({ query: MY_COMPANIES, fetchPolicy: "network-only" }),
    ]);

    const nextUser = me.data?.me ?? null;
    const nextCompanies = mine.data?.myCompanies ?? [];

    setUser(nextUser);
    setCompanies(nextCompanies);

    /**
     * Con una sola membresía el header es opcional —el servidor la deduce—
     * pero se fija igual: el día que la persona gane una segunda, un cliente
     * que nunca mandó el header empieza a fallar sin que nadie haya tocado
     * nada. Si la guardada ya no está entre las suyas, se descarta.
     */
    const stored = getCompanyId();
    const valid = nextCompanies.some((c) => c.id === stored);
    const resolved = valid ? stored : (nextCompanies[0]?.id ?? null);

    setCompanyId(resolved);
    setActiveCompanyId(resolved);

    return nextUser;
  }, []);

  useEffect(() => {
    const initialize = async () => {
      // Sin tokens no hay nada que validar, y preguntar sólo produce un 401.
      if (!hasSession()) {
        setIsLoading(false);
        return;
      }
      try {
        await fetchUser();
      } catch (error) {
        console.error("No se pudo restaurar la sesión:", error);
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    void initialize();
  }, [fetchUser]);

  /** El link de errores puede invalidar la sesión sin pasar por aquí. */
  useEffect(
    () =>
      onSessionCleared(() => {
        setUser(null);
        setCompanies([]);
        setActiveCompanyId(null);
      }),
    [],
  );

  const login = useCallback(
    async (tokens?: TokenPair) => {
      if (tokens) setTokens(tokens);
      await fetchUser();
    },
    [fetchUser],
  );

  /**
   * Cierra sesión en este dispositivo. Si la llamada falla —red caída, token
   * ya vencido— la sesión local se limpia igual: dejar al usuario "dentro"
   * porque el servidor no contestó es la peor salida posible.
   */
  const logout = useCallback(async () => {
    try {
      await apolloClient.mutate({
        mutation: LOGOUT,
        variables: { refreshToken: getRefreshToken() },
      });
    } catch (error) {
      console.error("Falló el cierre de sesión remoto; se limpia el local:", error);
    } finally {
      clearSession();
      setUser(null);
      setCompanies([]);
      setActiveCompanyId(null);
      await apolloClient.clearStore();
    }
  }, []);

  const refetchUser = useCallback(async () => {
    try {
      await fetchUser();
    } catch (error) {
      console.error("No se pudo recargar al usuario:", error);
    }
  }, [fetchUser]);

  /** Cambiar de negocio cambia lo que devuelve casi todo: la caché se vacía. */
  const selectCompany = useCallback((companyId: string) => {
    setCompanyId(companyId);
    setActiveCompanyId(companyId);
    void apolloClient.resetStore();
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const membershipState: MembershipState =
      companies.length === 0 ? "none" : companies.length === 1 ? "single" : "multiple";

    return {
      user,
      companies,
      activeCompany: companies.find((c) => c.id === activeCompanyId) ?? null,
      membershipState,
      isAuthenticated: user !== null,
      isLoading,
      login,
      logout,
      refetchUser,
      selectCompany,
    };
  }, [user, companies, activeCompanyId, isLoading, login, logout, refetchUser, selectCompany]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
