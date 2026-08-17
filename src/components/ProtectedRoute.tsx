import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Para las pantallas que sí funcionan sin negocio: vincularse a uno, el
   * perfil, cerrar sesión. Sin esto, un usuario sin membresía quedaría en un
   * bucle de redirecciones hacia la pantalla que necesita visitar.
   */
  allowWithoutCompany?: boolean;
}

export function ProtectedRoute({
  children,
  allowWithoutCompany = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, membershipState } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="size-8 text-primary" />
          <p className="text-sm text-muted-foreground">Cargando…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  /**
   * Autenticado pero sin negocio no es un error de sesión: la cuenta existe,
   * sólo que el backend no tiene contra qué empresa resolver sus datos.
   * Mandarlo al login —que es lo que haría un guardia de un solo estado— lo
   * dejaría dando vueltas, porque volvería a entrar igual de huérfano.
   */
  if (membershipState === "none" && !allowWithoutCompany) {
    return <Navigate to="/vincular-negocio" replace />;
  }

  return <>{children}</>;
}
