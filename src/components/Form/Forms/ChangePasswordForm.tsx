import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { CHANGE_PASSWORD } from "@/graphql/user";
import { messageFor } from "@/lib/api/errors";
import { PASSWORD_HINT, validatePassword } from "@/lib/password";

interface ChangePasswordFormProps {
  onDone: () => void;
}

/**
 * Cambio de contraseña.
 *
 * Pide la actual porque el servidor la exige: cambiar una contraseña conocida
 * requiere demostrar que se conoce. Al terminar, el backend cierra la sesión
 * en los OTROS dispositivos y deja vivo el actual, así que aquí no hay que
 * hacer nada con los tokens.
 */
export default function ChangePasswordForm({ onDone }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [done, setDone] = useState(false);

  const [changePassword, { loading, error }] = useMutation(CHANGE_PASSWORD, {
    onCompleted: () => {
      setDone(true);
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(onDone, 1800);
    },
  });

  const policyError = newPassword ? validatePassword(newPassword) : null;
  const sameAsCurrent =
    Boolean(newPassword) && newPassword === currentPassword
      ? "La nueva contraseña debe ser distinta de la actual."
      : null;
  const localError = policyError ?? sameAsCurrent;

  if (done) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3.5">
        <Check className="h-4 w-4 text-primary" />
        <p className="text-sm text-foreground">
          Contraseña actualizada. Cerramos la sesión en tus otros dispositivos.
        </p>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (localError) return;
        void changePassword({ variables: { input: { currentPassword, newPassword } } });
      }}
    >
      <Input
        type="password"
        required
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Contraseña actual"
        aria-label="Contraseña actual"
      />
      <Input
        type="password"
        required
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Nueva contraseña"
        aria-label="Nueva contraseña"
      />
      <p className="px-1 text-xs text-muted-foreground">{PASSWORD_HINT}</p>

      {localError && <p className="text-sm text-destructive">{localError}</p>}
      {error && !localError && (
        <p className="text-sm text-destructive">{messageFor(error)}</p>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-full"
          onClick={onDone}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1 rounded-full"
          disabled={loading || !currentPassword || !newPassword || localError !== null}
        >
          {loading ? <Spinner className="size-4" /> : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
