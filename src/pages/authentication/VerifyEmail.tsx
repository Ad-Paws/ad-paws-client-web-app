import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { VERIFY_EMAIL_MUTATION } from "@/lib/api/user.api";
import { Check, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";

interface VerifyEmailResponse {
  verifyEmail: {
    accessToken: string;
    refreshToken: string;
  };
}

type VerifyState = "loading" | "success" | "error";

function getVerifyState(
  loading: boolean,
  data: VerifyEmailResponse | null | undefined,
  error: unknown,
): VerifyState {
  if (loading) return "loading";
  if (data?.verifyEmail) return "success";
  if (error) return "error";
  return "loading";
}

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [verifyEmail, { loading, data, error }] =
    useMutation<VerifyEmailResponse>(VERIFY_EMAIL_MUTATION);

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get("token");
    if (!token) {
      navigate("/auth/login", { replace: true });
      return;
    }

    verifyEmail({ variables: { token } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!data?.verifyEmail) return;
    const destination = isAuthenticated ? "/" : "/auth/login";
    const timer = setTimeout(() => navigate(destination, { replace: true }), 3000);
    return () => clearTimeout(timer);
  }, [data, navigate, isAuthenticated]);

  const state = getVerifyState(loading, data, error);

  return (
    <Card className="w-full max-w-9/10 md:max-w-[400px] border border-border rounded-lg p-8 bg-white dark:bg-brand-900 flex flex-col items-center gap-6">
      <Logo className="w-40" />

      {state === "loading" && (
        <>
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <div className="text-center space-y-1">
            <p className="text-lg font-semibold text-foreground">
              Verificando tu cuenta…
            </p>
            <p className="text-sm text-muted-foreground">
              Esto solo tardará un momento.
            </p>
          </div>
        </>
      )}

      {state === "success" && (
        <>
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Check className="w-10 h-10 text-white stroke-[3]" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-lg font-semibold text-foreground">
              ¡Cuenta verificada!
            </p>
            <p className="text-sm text-muted-foreground">
              {isAuthenticated
                ? "Te redirigiremos al dashboard en unos segundos."
                : "Te redirigiremos al inicio de sesión en unos segundos."}
            </p>
          </div>
          <Button
            className="w-full rounded-full"
            onClick={() => navigate(isAuthenticated ? "/" : "/auth/login", { replace: true })}
          >
            {isAuthenticated ? "Ir al dashboard" : "Ir al inicio de sesión"}
          </Button>
        </>
      )}

      {state === "error" && (
        <>
          <XCircle className="w-16 h-16 text-destructive" />
          <div className="text-center space-y-1">
            <p className="text-lg font-semibold text-foreground">
              El enlace no es válido
            </p>
            <p className="text-sm text-muted-foreground">
              El link expiró o ya fue usado. Revisa tu correo o contáctanos en{" "}
              <a
                href="mailto:hey@adpaws.com.mx"
                className="text-primary underline underline-offset-2"
              >
                hey@adpaws.com.mx
              </a>
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full rounded-full"
            onClick={() => navigate("/auth/login", { replace: true })}
          >
            Volver al inicio de sesión
          </Button>
        </>
      )}
    </Card>
  );
}
