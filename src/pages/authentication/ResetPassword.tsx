import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { Helmet } from "react-helmet-async";
import { Check, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import Logo from "@/components/Logo";
import { CONFIRM_PASSWORD_RESET } from "@/graphql/user";
import { messageFor } from "@/lib/api/errors";
import { PASSWORD_HINT, validatePassword } from "@/lib/password";

/**
 * Confirmación del restablecimiento.
 *
 * Al terminar, el backend invalida TODAS las sesiones de esa cuenta —es el
 * objetivo de restablecer por sospecha de compromiso— así que la app no
 * intenta dejar al usuario dentro: lo manda al login, que es donde va a
 * acabar de todos modos.
 */
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [done, setDone] = useState(false);

  const [confirmReset, { loading, error }] = useMutation(CONFIRM_PASSWORD_RESET, {
    onCompleted: () => {
      setDone(true);
      setTimeout(() => navigate("/auth/login", { replace: true }), 2500);
    },
  });

  const localError =
    password && confirmation && password !== confirmation
      ? "Las contraseñas no coinciden."
      : password
        ? validatePassword(password)
        : null;

  if (!token) {
    return (
      <Card className="w-full max-w-9/10 md:max-w-[400px] border border-border rounded-lg p-8 flex flex-col items-center gap-5">
        <XCircle className="w-14 h-14 text-destructive" />
        <p className="text-center text-sm text-muted-foreground">
          El link no es válido. Pide uno nuevo desde la pantalla de inicio de
          sesión.
        </p>
        <Link
          to="/auth/recuperar"
          className="text-sm font-semibold text-secondary underline underline-offset-2"
        >
          Pedir un link nuevo
        </Link>
      </Card>
    );
  }

  return (
    <>
      <Helmet>
        <title>AdPaws | Nueva contraseña</title>
      </Helmet>

      <Card className="w-full max-w-9/10 md:max-w-[400px] border border-border rounded-lg p-6 flex flex-col gap-5">
        <div className="flex justify-center">
          <Logo className="w-40" />
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-8 h-8 text-white stroke-[3]" />
            </div>
            <div className="space-y-1.5">
              <p className="text-lg font-semibold text-foreground">
                Contraseña actualizada
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Por seguridad cerramos tus sesiones en todos los dispositivos.
                Te llevamos al inicio de sesión.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center space-y-1.5">
              <h1 className="text-xl font-bold text-foreground">Crea tu nueva contraseña</h1>
              <p className="text-sm text-muted-foreground">{PASSWORD_HINT}</p>
            </div>

            <form
              className="flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (localError) return;
                void confirmReset({
                  variables: { input: { token, newPassword: password } },
                });
              }}
            >
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nueva contraseña"
                aria-label="Nueva contraseña"
              />
              <Input
                type="password"
                required
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder="Confírmala"
                aria-label="Confirmar contraseña"
              />

              {localError && (
                <p className="text-sm text-destructive">{localError}</p>
              )}
              {error && !localError && (
                <p className="text-sm text-destructive">{messageFor(error)}</p>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={loading || !password || !confirmation || localError !== null}
                className="w-full rounded-full h-12"
              >
                {loading ? <Spinner className="size-4" /> : "Guardar contraseña"}
              </Button>
            </form>
          </>
        )}
      </Card>
    </>
  );
}
