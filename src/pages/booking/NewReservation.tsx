import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { Helmet } from "react-helmet-async";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { MY_DOGS } from "@/graphql/dogs";
import { SERVICES } from "@/graphql/services";
import { DOG_PACKAGES } from "@/graphql/packages";
import { CREATE_RESERVATION, QUOTE_RESERVATION, RESERVATIONS } from "@/graphql/reservations";
import {
  AddOnsStep,
  DatesStep,
  DogStep,
  ServiceStep,
  type BookableService,
} from "@/components/Booking/steps";
import { QuoteReview } from "@/components/Booking/QuoteReview";
import { messageFor } from "@/lib/api/errors";
import { toDateTime } from "@/lib/schedule";

const STEPS = ["Perro", "Servicio", "Fechas", "Extras", "Confirmar"] as const;

/**
 * Reservar.
 *
 * El precio nunca se calcula aquí. Se arma la MISMA entrada que consumirá
 * `createReservation`, se manda a `quoteReservation` para mostrarla, y al
 * confirmar se envía esa entrada intacta. Cualquier cálculo intermedio en el
 * navegador abriría la puerta a que el total mostrado y el facturado difieran,
 * que es el error más caro que puede tener una pantalla como esta.
 */
export default function NewReservation() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [dogId, setDogId] = useState<string | null>(null);
  const [service, setService] = useState<BookableService | null>(null);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [addOnIds, setAddOnIds] = useState<string[]>([]);

  const { data: dogsData, loading: dogsLoading } = useQuery(MY_DOGS);
  const { data: servicesData, loading: servicesLoading } = useQuery(SERVICES);

  /**
   * Saldos del perro elegido, para marcar en el catálogo qué ya está pagado.
   * `remainingQuantity` en null es ILIMITADO; sólo un cero es "se acabó".
   */
  const { data: packagesData } = useQuery(DOG_PACKAGES, {
    variables: { dogId: dogId! },
    skip: !dogId,
  });

  const coveredServiceIds = useMemo(() => {
    const covered = new Set<string>();
    for (const dogPackage of packagesData?.dogPackages ?? []) {
      for (const balance of dogPackage.balances) {
        if (balance.remainingQuantity === null || balance.remainingQuantity > 0) {
          covered.add(balance.service.id);
        }
      }
    }
    return covered;
  }, [packagesData]);

  const dogs = dogsData?.myDogs ?? [];
  const allServices = servicesData?.services ?? [];
  const mainServices = allServices.filter((s) => s.category === "MAIN");
  const addOns = allServices.filter((s) => s.category === "ADDON");
  const dog = dogs.find((d) => d.id === dogId) ?? null;

  /**
   * La hora sale del horario del servicio: el cliente elige el día, no la
   * hora. El backend juzga la hora real en el check-in, así que esto es la
   * intención de la reserva, no una promesa de puntualidad.
   */
  const input = useMemo(() => {
    if (!dogId || !service || !checkIn) return null;
    const needsCheckOut = service.type === "HOTEL";
    if (needsCheckOut && !checkOut) return null;

    return {
      dogId,
      serviceId: service.id,
      scheduledCheckIn: toDateTime(checkIn, service.opensAtMinute),
      ...(needsCheckOut && checkOut
        ? {
            scheduledCheckOut: toDateTime(
              checkOut,
              service.checkoutCutoffMinute ?? service.closesAtMinute,
            ),
          }
        : {}),
      ...(addOnIds.length > 0 ? { addOnServiceIds: addOnIds } : {}),
    };
  }, [dogId, service, checkIn, checkOut, addOnIds]);

  const onReview = step === 4;

  const { data: quoteData, loading: quoting, error: quoteError } = useQuery(
    QUOTE_RESERVATION,
    {
      variables: { input: input! },
      skip: !onReview || !input,
      fetchPolicy: "network-only",
    },
  );

  const [createReservation, { loading: creating, error: createError }] = useMutation(
    CREATE_RESERVATION,
    {
      // Las dos pestañas del inicio leen esto.
      refetchQueries: [{ query: RESERVATIONS }],
      onCompleted: (result) =>
        navigate(`/reservas/${result.createReservation.id}`, { replace: true }),
    },
  );

  const canContinue = [
    dogId !== null,
    service !== null,
    checkIn !== undefined && (service?.type !== "HOTEL" || checkOut !== undefined),
    true, // los extras son opcionales
    input !== null && !quoting && !quoteError,
  ][step];

  const goBack = () => (step === 0 ? navigate(-1) : setStep(step - 1));

  return (
    <>
      <Helmet>
        <title>AdPaws | Reservar</title>
      </Helmet>

      <div className="flex shrink-0 items-center gap-3 px-4 py-4">
        <button
          type="button"
          onClick={goBack}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80"
          aria-label="Regresar"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="flex-1 pr-9 text-center text-base font-bold text-foreground">
          {STEPS[step]}
        </h1>
      </div>

      <div className="shrink-0 px-6">
        <div className="h-1 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-brandInfo-300 transition-all duration-300 ease-out"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-5">
        {step === 0 && (
          <DogStep
            dogs={dogs}
            loading={dogsLoading}
            selectedId={dogId}
            onSelect={setDogId}
          />
        )}

        {step === 1 && (
          <ServiceStep
            services={mainServices}
            loading={servicesLoading}
            selectedId={service?.id ?? null}
            coveredServiceIds={coveredServiceIds}
            onSelect={(next) => {
              setService(next);
              // Cambiar de servicio invalida las fechas: otro servicio tiene
              // otros días y otro horario.
              setCheckIn(undefined);
              setCheckOut(undefined);
            }}
          />
        )}

        {step === 2 && service && (
          <DatesStep
            service={service}
            checkIn={checkIn}
            checkOut={checkOut}
            onCheckIn={(date) => {
              setCheckIn(date);
              if (checkOut && date && checkOut <= date) setCheckOut(undefined);
            }}
            onCheckOut={setCheckOut}
          />
        )}

        {step === 3 && (
          <AddOnsStep
            addOns={addOns}
            selectedIds={addOnIds}
            onToggle={(id) =>
              setAddOnIds((current) =>
                current.includes(id)
                  ? current.filter((value) => value !== id)
                  : [...current, id],
              )
            }
          />
        )}

        {step === 4 && (
          <>
            <QuoteReview
              quote={quoteData?.quoteReservation}
              loading={quoting}
              dogName={dog?.name ?? ""}
            />
            {quoteError && (
              <p className="mt-4 text-sm text-destructive">{messageFor(quoteError)}</p>
            )}
            {createError && (
              <p className="mt-4 text-sm text-destructive">{messageFor(createError)}</p>
            )}
          </>
        )}
      </div>

      <div className="shrink-0 border-t border-border bg-background px-6 py-4">
        <Button
          type="button"
          size="lg"
          className="h-12 w-full rounded-full text-base font-semibold"
          disabled={!canContinue || creating}
          onClick={() => {
            if (!onReview) {
              setStep(step + 1);
              return;
            }
            if (input) void createReservation({ variables: { input } });
          }}
        >
          {creating ? <Spinner className="size-4" /> : onReview ? "Reservar" : "Continuar"}
        </Button>
      </div>
    </>
  );
}
