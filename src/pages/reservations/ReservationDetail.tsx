import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, Store } from "lucide-react";
import { RESERVATION } from "@/graphql/reservations";
import CancelReservation from "@/components/Reservation/CancelReservation";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney, isFree } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { ReservationStatus } from "@/generated/schema-types";

const STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING: "Confirmada",
  CHECKED_IN: "En el hotel",
  CHECKED_OUT: "Terminada",
  COMPLETED: "Terminada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No asistió",
};

const STATUS_STYLES: Record<ReservationStatus, string> = {
  PENDING: "bg-primary/15 text-primary",
  CHECKED_IN: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  CHECKED_OUT: "bg-muted text-muted-foreground",
  COMPLETED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-destructive/10 text-destructive",
  NO_SHOW: "bg-destructive/10 text-destructive",
};

const ITEM_KIND_LABELS: Record<string, string> = {
  MAIN: "Servicio",
  ADDON: "Extra",
  FEE: "Cargo",
  DISCOUNT: "Descuento",
};

const longDate = (iso: string) =>
  format(new Date(iso), "EEEE d 'de' MMMM, HH:mm", { locale: es });

export default function ReservationDetail() {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();

  const { data, loading } = useQuery(RESERVATION, {
    variables: { id: reservationId ?? "" },
    skip: !reservationId,
  });

  const reservation = data?.reservation;

  return (
    <>
      <Helmet>
        <title>AdPaws | Reserva</title>
      </Helmet>

      <div className="flex shrink-0 items-center gap-3 px-4 py-4">
        <button
          type="button"
          onClick={() => navigate("/inicio")}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80"
          aria-label="Regresar"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="flex-1 pr-9 text-center text-base font-bold text-foreground">
          Tu reserva
        </h1>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-8">
        {loading || !reservation ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15">
                {reservation.dog.imageUrl ? (
                  <img
                    src={reservation.dog.imageUrl}
                    alt={reservation.dog.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-base font-bold text-primary">
                    {reservation.dog.name[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-foreground">
                  {reservation.dog.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Reserva #{reservation.id}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
                  STATUS_STYLES[reservation.status],
                )}
              >
                {STATUS_LABELS[reservation.status]}
              </span>
            </div>

            <section className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Llegada</p>
                <p className="text-sm text-foreground first-letter:uppercase">
                  {longDate(reservation.scheduledCheckIn)}
                </p>
              </div>
              {reservation.scheduledCheckOut && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Salida</p>
                  <p className="text-sm text-foreground first-letter:uppercase">
                    {longDate(reservation.scheduledCheckOut)}
                  </p>
                </div>
              )}
              {reservation.actualCheckInAt && (
                <p className="text-xs text-muted-foreground">
                  Llegó el {longDate(reservation.actualCheckInAt)}
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-card">
              <p className="border-b border-border px-4 py-3 text-sm font-semibold text-muted-foreground">
                Desglose
              </p>
              <ul className="divide-y divide-border">
                {reservation.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {ITEM_KIND_LABELS[item.kind] ?? item.kind}
                        {item.quantity > 1 ? ` · ${item.quantity}` : ""}
                        {item.sourceType === "PACKAGE" ? " · cubierto por tu paquete" : ""}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-foreground">
                      {formatMoney(item.totalPrice)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-border px-4 py-3 text-base font-bold text-foreground">
                <span>Total</span>
                <span>
                  {isFree(reservation.total) ? "Sin costo" : formatMoney(reservation.total)}
                </span>
              </div>
            </section>

            {/* Sin estado de pago por reserva: el cobro ocurre en sucursal. */}
            {!isFree(reservation.total) && reservation.status === "PENDING" && (
              <p className="flex items-start gap-2 rounded-2xl bg-muted/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                <Store className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                El pago se realiza directamente en sucursal, al llegar.
              </p>
            )}

            <CancelReservation
              reservationId={reservation.id}
              status={reservation.status}
              scheduledCheckIn={reservation.scheduledCheckIn}
              usedPackage={reservation.items.some(
                (item) => item.sourceType === "PACKAGE",
              )}
            />
          </div>
        )}
      </div>
    </>
  );
}
