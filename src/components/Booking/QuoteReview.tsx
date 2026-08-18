import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AlertTriangle, PackageCheck, Store } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney, isFree } from "@/lib/money";
import type { QuoteReservationQuery } from "@/generated/graphql";

type Quote = QuoteReservationQuery["quoteReservation"];

/**
 * La cotización, tal cual la devuelve el servidor.
 *
 * Nada de esto se calcula aquí: `dates`, `coveredDates`, `addOns` y los totales
 * vienen de `quoteReservation`, que corre el mismo código de precio que la
 * reserva real. Ese es el punto — el número que el cliente ve y el que se
 * factura no pueden separarse.
 */
export function QuoteReview({
  quote,
  loading,
  dogName,
}: {
  quote: Quote | undefined;
  loading: boolean;
  dogName: string;
}) {
  if (loading || !quote) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
      </div>
    );
  }

  const covered = new Set(quote.coveredDates);
  const paysNothing = isFree(quote.amountDue);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="font-semibold text-foreground">{quote.service.name}</p>
        <p className="text-sm text-muted-foreground">Para {dogName}</p>
      </div>

      <section className="rounded-2xl border border-border bg-card">
        <p className="border-b border-border px-4 py-3 text-sm font-semibold text-muted-foreground">
          Detalle por día
        </p>
        <ul className="divide-y divide-border">
          {quote.dates.map((day) => {
            const isCovered = covered.has(day.date);
            return (
              <li
                key={day.date}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm text-foreground">
                    {format(new Date(day.date), "EEEE d 'de' MMMM", { locale: es })}
                  </p>
                  {day.exception && (
                    <p className="text-xs text-muted-foreground">{day.exception.name}</p>
                  )}
                </div>

                {isCovered ? (
                  <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary">
                    <PackageCheck className="h-3.5 w-3.5" /> Tu paquete
                  </span>
                ) : (
                  <span className="shrink-0 text-sm font-semibold text-foreground">
                    {formatMoney(day.price)}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {quote.addOns.length > 0 && (
        <section className="rounded-2xl border border-border bg-card">
          <p className="border-b border-border px-4 py-3 text-sm font-semibold text-muted-foreground">
            Extras
          </p>
          <ul className="divide-y divide-border">
            {quote.addOns.map((addOn) => (
              <li
                key={addOn.service.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <p className="min-w-0 truncate text-sm text-foreground">
                  {addOn.service.name}
                </p>
                {addOn.coveredByPackage ? (
                  <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary">
                    <PackageCheck className="h-3.5 w-3.5" /> Tu paquete
                  </span>
                ) : (
                  <span className="shrink-0 text-sm font-semibold text-foreground">
                    {formatMoney(addOn.price)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/*
        Advertencias: condiciones que el servidor ACEPTÓ en lugar de rechazar.
        Que la reserva se pueda hacer no significa que el cliente no deba
        enterarse — llegar fuera de horario, por ejemplo.
      */}
      {quote.warnings.length > 0 && (
        <div className="flex flex-col gap-2 rounded-2xl border border-amber-300/60 bg-amber-50 p-4 dark:bg-amber-950/30">
          {quote.warnings.map((warning) => (
            <p
              key={warning}
              className="flex items-start gap-2 text-xs leading-relaxed text-amber-900 dark:text-amber-200"
            >
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {warning}
            </p>
          ))}
        </div>
      )}

      <section className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatMoney(quote.subtotal)}</span>
        </div>
        {/*
          Se muestran los dos números en vez de restarlos: la diferencia sería
          aritmética sobre `Money`, que es exactamente lo que no se hace en el
          cliente. El servidor ya dijo cuánto es cada cosa.
        */}
        {quote.total !== quote.amountDue && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Sin tu paquete costaría</span>
            <span className="line-through">{formatMoney(quote.total)}</span>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-border pt-2 text-base font-bold text-foreground">
          <span>Total a pagar</span>
          <span>{paysNothing ? "Sin costo" : formatMoney(quote.amountDue)}</span>
        </div>
      </section>

      {/*
        El pago ocurre en sucursal: la plataforma no mueve dinero en esta
        versión. Se omite cuando no hay nada que pagar — un paquete cubrió
        todo — porque ahí la leyenda sólo confundiría.
      */}
      {!paysNothing && (
        <p className="flex items-start gap-2 rounded-2xl bg-muted/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          <Store className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          El pago se realiza directamente en sucursal. Tu reserva queda
          confirmada y se liquida al llegar.
        </p>
      )}
    </div>
  );
}
