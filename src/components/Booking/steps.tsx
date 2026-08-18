import { PackageCheck } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, DOG_BREEDS } from "@/lib/utils";
import { formatMoney } from "@/lib/money";
import { closedWeekdays, formatMinuteOfDay, startOfToday } from "@/lib/schedule";
import type { MyDogsQuery, ServicesQuery } from "@/generated/graphql";

export type BookableDog = MyDogsQuery["myDogs"][number];
export type BookableService = ServicesQuery["services"][number];

import { PRICING_UNIT_LABELS, serviceTypeLabel } from "./labels";

// ---------------------------------------------------------------------------
// Paso 1 · ¿Para quién?
// ---------------------------------------------------------------------------

export function DogStep({
  dogs,
  loading,
  selectedId,
  onSelect,
}: {
  dogs: BookableDog[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (dogId: string) => void;
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (dogs.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border px-4 py-6 text-center text-sm leading-relaxed text-muted-foreground">
        Necesitas registrar a tu perro antes de reservar.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {dogs.map((dog) => (
        <button
          key={dog.id}
          type="button"
          onClick={() => onSelect(dog.id)}
          className={cn(
            "flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors",
            selectedId === dog.id
              ? "border-primary bg-primary/10"
              : "border-border bg-card hover:bg-muted",
          )}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15">
            {dog.imageUrl ? (
              <img src={dog.imageUrl} alt={dog.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-base font-bold text-primary">
                {dog.name[0].toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">{dog.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {DOG_BREEDS[dog.breed as keyof typeof DOG_BREEDS] ?? dog.breed ?? "—"}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Paso 2 · ¿Qué servicio?
// ---------------------------------------------------------------------------

export function ServiceStep({
  services,
  loading,
  selectedId,
  coveredServiceIds,
  onSelect,
}: {
  services: BookableService[];
  loading: boolean;
  selectedId: string | null;
  /** Servicios con saldo disponible en algún paquete del perro elegido. */
  coveredServiceIds: ReadonlySet<string>;
  onSelect: (service: BookableService) => void;
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border px-4 py-6 text-center text-sm leading-relaxed text-muted-foreground">
        Este negocio todavía no tiene servicios publicados. Escríbeles para
        agendar.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {services.map((service) => (
        <button
          key={service.id}
          type="button"
          onClick={() => onSelect(service)}
          className={cn(
            "flex flex-col gap-1.5 rounded-2xl border p-4 text-left transition-colors",
            selectedId === service.id
              ? "border-primary bg-primary/10"
              : "border-border bg-card hover:bg-muted",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">{service.name}</p>
              <p className="text-xs text-muted-foreground">
                {serviceTypeLabel(service.type)}
              </p>
            </div>
            <div className="shrink-0 text-right">
              {/*
                El saldo se anuncia ANTES de elegir, no al final en la
                cotización: saber que una noche ya está pagada cambia cuál
                servicio elige la persona, y enterarse hasta el último paso es
                enterarse tarde. El precio real lo sigue decidiendo el
                servidor al cotizar.
              */}
              {coveredServiceIds.has(service.id) ? (
                <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                  <PackageCheck className="h-3.5 w-3.5" /> Tienes saldo
                </span>
              ) : (
                <>
                  <p className="font-bold text-foreground">{formatMoney(service.price)}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {PRICING_UNIT_LABELS[service.pricingUnit] ?? ""}
                  </p>
                </>
              )}
            </div>
          </div>

          {service.description && (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {service.description}
            </p>
          )}

          <p className="text-[11px] text-muted-foreground">
            {formatMinuteOfDay(service.opensAtMinute)} a{" "}
            {formatMinuteOfDay(service.closesAtMinute)}
          </p>
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Paso 3 · ¿Cuándo?
// ---------------------------------------------------------------------------

export function DatesStep({
  service,
  checkIn,
  checkOut,
  onCheckIn,
  onCheckOut,
}: {
  service: BookableService;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  onCheckIn: (date: Date | undefined) => void;
  onCheckOut: (date: Date | undefined) => void;
}) {
  const needsCheckOut = service.type === "HOTEL";
  const closed = closedWeekdays(service.daysOfWeek);
  const today = startOfToday();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-muted-foreground">
          {needsCheckOut ? "Día de llegada" : "Día del servicio"}
        </p>
        <div className="rounded-2xl border border-border bg-card p-1">
          <Calendar
            mode="single"
            selected={checkIn}
            onSelect={onCheckIn}
            disabled={[{ before: today }, { dayOfWeek: closed }]}
            className="w-full"
          />
        </div>
      </div>

      {needsCheckOut && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-muted-foreground">Día de salida</p>
          <div className="rounded-2xl border border-border bg-card p-1">
            <Calendar
              mode="single"
              selected={checkOut}
              onSelect={onCheckOut}
              // La salida no puede ser el mismo día: una estancia tiene al
              // menos una noche, y el backend la rechazaría.
              disabled={[{ before: checkIn ? addDays(checkIn, 1) : today }]}
              className="w-full"
            />
          </div>
          <p className="px-1 text-xs text-muted-foreground">
            Se cobran las noches; el día de salida no cuenta como noche.
          </p>
        </div>
      )}
    </div>
  );
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// ---------------------------------------------------------------------------
// Paso 4 · Extras
// ---------------------------------------------------------------------------

export function AddOnsStep({
  addOns,
  selectedIds,
  onToggle,
}: {
  addOns: BookableService[];
  selectedIds: string[];
  onToggle: (serviceId: string) => void;
}) {
  if (addOns.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border px-4 py-6 text-center text-sm leading-relaxed text-muted-foreground">
        Este negocio no ofrece extras para este servicio. Puedes continuar.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {addOns.map((service) => {
        const selected = selectedIds.includes(service.id);
        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onToggle(service.id)}
            className={cn(
              "flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-colors",
              selected
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:bg-muted",
            )}
          >
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">{service.name}</p>
              {service.description && (
                <p className="truncate text-xs text-muted-foreground">
                  {service.description}
                </p>
              )}
            </div>
            <p className="shrink-0 font-bold text-foreground">
              {formatMoney(service.price)}
            </p>
          </button>
        );
      })}
    </div>
  );
}
