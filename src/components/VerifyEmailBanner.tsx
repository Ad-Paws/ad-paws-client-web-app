import { MailWarning } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Aviso de cuenta sin verificar.
 *
 * No bloquea: por decisión de producto el usuario opera con normalidad
 * mientras tanto. Vale la pena decir por qué no es sólo pereza — bloquear en
 * la interfaz no sería una frontera de nada, porque el servidor hoy acepta a
 * un usuario INCOMPLETE igual que a uno activo. El día que se quiera bloquear
 * de verdad, el cambio va en el backend.
 */
export default function VerifyEmailBanner() {
  const { user } = useAuth();

  if (!user || user.emailVerifiedAt) return null;

  return (
    <div className="mx-6 mt-3 flex items-start gap-2.5 rounded-xl border border-amber-300/60 bg-amber-50 dark:bg-amber-950/30 px-3.5 py-2.5">
      <MailWarning className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200">
        Te enviamos un correo a{" "}
        <span className="font-semibold">{user.email}</span> para confirmar tu
        cuenta. Búscalo cuando puedas — el link caduca en 24 horas.
      </p>
    </div>
  );
}
