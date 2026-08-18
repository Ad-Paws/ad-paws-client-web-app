import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Store, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { CANCEL_RESERVATION, RESERVATION, RESERVATIONS } from "@/graphql/reservations";
import { messageFor } from "@/lib/api/errors";
import { useAuth } from "@/contexts/AuthContext";

interface CancelReservationProps {
  reservationId: string;
  status: string;
  scheduledCheckIn: string;
  /** Si la reserva usaba saldo de un paquete, se devuelve al cancelar. */
  usedPackage: boolean;
}

/**
 * Cancelación por parte del cliente.
 *
 * Tres condiciones, las mismas que aplica el servidor: la reserva sigue
 * PENDING, falta más que la ventana del negocio para la llegada, y hay un
 * motivo. Ocultar el botón cuando no aplican es cortesía; quien decide es el
 * backend, y por eso el error de la mutación se muestra tal cual si algo se
 * escapa.
 */
export default function CancelReservation({
  reservationId,
  status,
  scheduledCheckIn,
  usedPackage,
}: CancelReservationProps) {
  const { activeCompany } = useAuth();
  const [confirming, setConfirming] = useState(false);
  const [reason, setReason] = useState("");
  /**
   * El reloj se congela al montar: leerlo en cada render es impuro y el
   * compilador de React lo rechaza. Si alguien deja la pantalla abierta hasta
   * pasada la ventana, el botón sigue ahí y el servidor lo rechaza con su
   * mensaje — que es la respuesta correcta de todos modos, porque quien decide
   * es él.
   */
  const [now] = useState(() => Date.now());

  const [cancelReservation, { loading, error }] = useMutation(CANCEL_RESERVATION, {
    refetchQueries: [
      { query: RESERVATION, variables: { id: reservationId } },
      { query: RESERVATIONS },
    ],
    onCompleted: () => setConfirming(false),
  });

  // Sólo una reserva viva y no empezada se cancela desde aquí.
  if (status !== "PENDING") return null;

  const windowHours = activeCompany?.cancellationWindowHours ?? 24;
  const deadline = new Date(scheduledCheckIn).getTime() - windowHours * 3_600_000;
  const tooLate = now > deadline;

  if (tooLate) {
    return (
      <p className="flex items-start gap-2 rounded-2xl bg-muted/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <Store className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        La cancelación en línea cierra {windowHours} horas antes de la llegada.
        Si necesitas cambiar algo, escríbele directamente al negocio.
      </p>
    );
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="flex items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
      >
        <XCircle className="h-4 w-4" />
        Cancelar reserva
      </button>
    );
  }

  return (
    <form
      className="flex flex-col gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        void cancelReservation({
          variables: { id: reservationId, reason: reason.trim() },
        });
      }}
    >
      <div>
        <p className="text-sm font-semibold text-foreground">
          ¿Cancelar esta reserva?
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {usedPackage
            ? "Las visitas que descontó vuelven a tu paquete."
            : "Liberas el lugar y no se te cobra nada."}{" "}
          Esto no se puede deshacer: para volver, tendrías que reservar de nuevo.
        </p>
      </div>

      <Textarea
        required
        rows={2}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="¿Por qué cancelas? El negocio lo va a leer."
        aria-label="Motivo de la cancelación"
      />

      {error && <p className="text-sm text-destructive">{messageFor(error)}</p>}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-full"
          onClick={() => setConfirming(false)}
        >
          Mejor no
        </Button>
        <Button
          type="submit"
          variant="destructive"
          className="flex-1 rounded-full"
          disabled={loading || reason.trim().length === 0}
        >
          {loading ? <Spinner className="size-4" /> : "Sí, cancelar"}
        </Button>
      </div>
    </form>
  );
}
