/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { apolloClient } from "@/lib/api/apolloClient";
import { USER_QUERY } from "@/lib/api/user.api";
import { LOGOUT } from "@/graphql/user";
import { clearSession, getRefreshToken, onSessionCleared } from "@/lib/session";

// TODO(F1): el almacenamiento de sesión se reescribe con Bearer + refreshSession.
const USER_DATA_KEY = "userData";

// Types
export interface User {
  id?: string;
  email?: string;
  name?: string;
  company?: Company;
  // Add more user properties as needed
}

export interface Company {
  id: string;
  logoUrl: string;
  name: string;
  ownerId: string;
  uuid: string;
}
export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData?: User) => Promise<void>;
  logout: () => void;
  updateUser: (userData: User) => void;
  refetchUser: () => Promise<void>;
  company: Company | null;
}

// Create Context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Provider Props
interface AuthProviderProps {
  children: React.ReactNode;
}

// Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data from API
  const fetchUserData = useCallback(async () => {
    try {
      const { data } = await apolloClient.query<{
        user: { id: string; email: string; name: string; company: Company };
      }>({
        query: USER_QUERY,
        fetchPolicy: "network-only", // Always fetch fresh data
      });

      if (data?.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
        };
        const companyData: Company = {
          id: data.user.company.id,
          logoUrl: data.user.company.logoUrl,
          name: data.user.company.name,
          ownerId: data.user.company.ownerId,
          uuid: data.user.company.uuid,
        };
        // Update state and localStorage
        setUser(userData);
        setCompany(companyData);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));

        return userData;
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // If fetch fails (e.g., cookie expired or invalid), clear auth data
      localStorage.removeItem(USER_DATA_KEY);
      setUser(null);
      throw error;
    }
  }, []);

  // Initialize auth state by validating cookie
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to fetch user data - if cookies are valid, this will succeed
        await fetchUserData();
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        // Cookie is invalid or expired, user is not authenticated
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [fetchUserData]);

  // Login function - cookies are set by the server
  const login = useCallback(
    async (userData?: User) => {
      try {
        // If user data is provided, use it
        if (userData) {
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
          setUser(userData);
        } else {
          // Otherwise, fetch user data from API (validates cookie)
          await fetchUserData();
        }
      } catch (error) {
        console.error("Failed to validate authentication:", error);
        throw error;
      }
    },
    [fetchUserData]
  );

  /**
   * Cierra sesión en este dispositivo.
   *
   * El refresh token va explícito: es lo que el servidor revoca. Si la llamada
   * falla —red caída, token ya vencido— la sesión local se limpia igual: dejar
   * al usuario "dentro" porque el servidor no contestó es la peor salida.
   */
  const logout = useCallback(async () => {
    localStorage.removeItem(USER_DATA_KEY);
    try {
      await apolloClient.mutate({
        mutation: LOGOUT,
        variables: { refreshToken: getRefreshToken() },
      });
    } catch (error) {
      console.error("Logout request failed; clearing local session anyway", error);
    } finally {
      clearSession();
      await apolloClient.clearStore();
      setUser(null);
    }
  }, []);

  /**
   * El link de errores puede invalidar la sesión sin pasar por aquí (un
   * refresh que falla). Esto es lo que hace que la UI se entere.
   */
  useEffect(() => onSessionCleared(() => setUser(null)), []);

  // Update user function
  const updateUser = useCallback((userData: User) => {
    try {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  }, []);

  // Refetch user data (useful after profile updates)
  const refetchUser = useCallback(async () => {
    try {
      await fetchUserData();
    } catch (error) {
      console.error("Failed to refetch user data:", error);
    }
  }, [fetchUserData]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
    updateUser,
    refetchUser,
    company,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
