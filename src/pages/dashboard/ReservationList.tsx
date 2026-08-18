import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarX2, ChevronRight, HistoryIcon, TriangleAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney, isFree } from "@/lib/money";
import { messageFor } from "@/lib/api/errors";
import type { ErrorLike } from "@apollo/client";
import type { ReservationsQuery } from "@/generated/graphql";

type Reservation = ReservationsQuery["reservations"][number];

const shortDate = (iso: string) => format(new Date(iso), "d MMM", { locale: es });

/** El nombre del servicio vive en la línea MAIN, que es la que se cobra. */
function serviceNameOf(reservation: Reservation): string {
  return reservation.items.find((item) => item.kind === "MAIN")?.name ?? "Servicio";
}

export function ReservationList({
  reservations,
  loading,
  error,
  variant,
}: {
  reservations: Reservation[];
  loading: boolean;
  error?: ErrorLike;
  variant: "upcoming" | "past";
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3 py-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    );
  }

  /**
   * Un fallo tiene que verse como fallo.
   *
   * Antes, cualquier error dejaba la lista vacía y la pantalla decía "sin
   * reservas próximas" — que es una afirmación falsa y manda al usuario a
   * dudar de su reserva en vez de a reintentar.
   */
  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <TriangleAlert className="h-8 w-8 text-destructive" />
        </div>
        <p className="font-semibold text-foreground">No pudimos cargar tus reservas</p>
        <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground">
          {messageFor(error)}
        </p>
      </div>
    );
  }

  if (reservations.length === 0) {
    const empty =
      variant === "upcoming"
        ? {
            icon: <CalendarX2 className="h-10 w-10 text-muted-foreground/50" />,
            title: "Sin reservas próximas",
            description: "Cuando reserves, aparecerá aquí.",
          }
        : {
            icon: <HistoryIcon className="h-10 w-10 text-muted-foreground/50" />,
            title: "Sin historial",
            description: "Tus visitas pasadas aparecerán aquí.",
          };

    return (
      <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          {empty.icon}
        </div>
        <p className="font-semibold text-foreground">{empty.title}</p>
        <p className="max-w-[220px] text-sm leading-relaxed text-muted-foreground">
          {empty.description}
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3 py-3">
      {reservations.map((reservation) => (
        <li key={reservation.id}>
          <Link
            to={`/reservas/${reservation.id}`}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 transition-colors hover:bg-muted"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15">
              {reservation.dog.imageUrl ? (
                <img
                  src={reservation.dog.imageUrl}
                  alt={reservation.dog.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-primary">
                  {reservation.dog.name[0].toUpperCase()}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-foreground">
                {serviceNameOf(reservation)}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {reservation.dog.name} ·{" "}
                {shortDate(reservation.scheduledCheckIn)}
                {reservation.scheduledCheckOut
                  ? ` a ${shortDate(reservation.scheduledCheckOut)}`
                  : ""}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold text-foreground">
                {isFree(reservation.total) ? "Sin costo" : formatMoney(reservation.total)}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
