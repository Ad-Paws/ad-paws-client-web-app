import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { Helmet } from "react-helmet-async";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import Logo from "@/components/Logo";
import { REQUEST_PASSWORD_RESET } from "@/graphql/user";

/**
 * Solicitud de restablecimiento.
 *
 * El servidor responde `true` exista o no la cuenta —lo contrario convertiría
 * este formulario en un detector de correos registrados— así que la pantalla
 * confirma en los mismos términos: "si existe, te llegó". No decir de más aquí
 * es parte del diseño, no una omisión.
 *
 * `app: CLIENT` es lo que hace que el link del correo apunte a esta app y no
 * a la del negocio.
 */
export default function RequestPasswordReset() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const [requestReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET, {
    onCompleted: () => setSent(true),
    // Un fallo de red tampoco debe revelar nada distinto.
    onError: () => setSent(true),
  });

  return (
    <>
      <Helmet>
        <title>AdPaws | Recuperar contraseña</title>
      </Helmet>

      <Card className="w-full max-w-9/10 md:max-w-[400px] border border-border rounded-lg p-6 flex flex-col gap-5">
        <div className="flex justify-center">
          <Logo className="w-40" />
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center">
              <MailCheck className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-1.5">
              <p className="text-lg font-semibold text-foreground">Revisa tu correo</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Si <span className="font-medium text-foreground">{email}</span>{" "}
                tiene una cuenta, te enviamos un link para crear una contraseña
                nueva. Caduca en una hora.
              </p>
            </div>
            <Link
              to="/auth/login"
              className="text-sm font-semibold text-secondary hover:text-secondary/80 underline underline-offset-2"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center space-y-1.5">
              <h1 className="text-xl font-bold text-foreground">
                ¿Olvidaste tu contraseña?
              </h1>
              <p className="text-sm text-muted-foreground">
                Te mandamos un link para crear una nueva.
              </p>
            </div>

            <form
              className="flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                void requestReset({
                  variables: { input: { email: email.trim(), app: "CLIENT" } },
                });
              }}
            >
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.correo@ejemplo.com"
                aria-label="Correo electrónico"
              />
              <Button
                type="submit"
                size="lg"
                disabled={loading || !email.trim()}
                className="w-full rounded-full h-12"
              >
                {loading ? <Spinner className="size-4" /> : "Enviar link"}
              </Button>
            </form>

            <Link
              to="/auth/login"
              className="text-sm text-center text-muted-foreground hover:text-foreground transition-colors"
            >
              Volver al inicio de sesión
            </Link>
          </>
        )}
      </Card>
    </>
  );
}
