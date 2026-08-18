import { useQuery } from "@apollo/client/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Infinity as InfinityIcon, PackageOpen, Store } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DOG_PACKAGES, PACKAGES } from "@/graphql/packages";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const PACKAGE_TYPE_LABELS: Record<string, string> = {
  QUANTITY: "Por sesiones",
  UNLIMITED: "Ilimitado",
  SUBSCRIPTION: "Suscripción",
};

const shortDate = (iso: string) => format(new Date(iso), "d 'de' MMMM", { locale: es });

/**
 * Paquetes y saldos del perro.
 *
 * Lo que el dueño quiere saber es una sola cosa: cuántas visitas le quedan y
 * hasta cuándo. Todo lo demás —el ledger, el encadenamiento de renovaciones—
 * es contabilidad del negocio.
 */
export default function DogPackages({ dogId }: { dogId: string }) {
  const { data, loading } = useQuery(DOG_PACKAGES, { variables: { dogId } });

  const dogPackages = data?.dogPackages ?? [];

  if (loading) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Paquetes</h2>
        <Skeleton className="h-28 rounded-2xl" />
      </section>
    );
  }

  if (dogPackages.length === 0) return <PackageCatalog />;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-muted-foreground">Paquetes</h2>

      {dogPackages.map((dogPackage) => (
        <article
          key={dogPackage.id}
          className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">
                {dogPackage.package.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {PACKAGE_TYPE_LABELS[dogPackage.package.type] ?? dogPackage.package.type}
              </p>
            </div>
            {dogPackage.expiryDate && (
              <p className="shrink-0 text-right text-xs text-muted-foreground">
                Vence el
                <br />
                {shortDate(dogPackage.expiryDate)}
              </p>
            )}
          </div>

          <ul className="flex flex-col gap-2">
            {dogPackage.balances.map((balance) => {
              // null es ILIMITADO, no cero.
              const unlimited = balance.remainingQuantity === null;
              const remaining = balance.remainingQuantity ?? 0;
              const depleted = !unlimited && remaining === 0;

              return (
                <li
                  key={balance.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2.5"
                >
                  <p className="min-w-0 truncate text-sm text-foreground">
                    {balance.service.name}
                  </p>

                  {unlimited ? (
                    <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary">
                      <InfinityIcon className="h-3.5 w-3.5" /> Sin límite
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "shrink-0 text-sm font-bold",
                        depleted ? "text-muted-foreground" : "text-foreground",
                      )}
                    >
                      {remaining}
                      <span className="text-xs font-normal text-muted-foreground">
                        {" "}
                        {remaining === 1 ? "visita" : "visitas"}
                      </span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          {dogPackage.renewalDate && (
            <p className="text-xs text-muted-foreground">
              Se renueva el {shortDate(dogPackage.renewalDate)}
            </p>
          )}
        </article>
      ))}
    </section>
  );
}

/**
 * Catálogo, para cuando el perro no tiene ningún paquete.
 *
 * Termina en "pregunta en el mostrador" porque es la verdad: la app no cobra,
 * y un botón de comprar que no compra es peor que no tener botón.
 */
function PackageCatalog() {
  const { data, loading } = useQuery(PACKAGES);
  const packages = data?.packages ?? [];

  if (loading || packages.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-muted-foreground">
        Paquetes disponibles
      </h2>

      <p className="flex items-start gap-2 rounded-2xl border border-dashed border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <PackageOpen className="mt-0.5 h-4 w-4 shrink-0" />
        Con un paquete tus visitas salen más baratas y ya quedan pagadas.
      </p>

      {packages.map((pkg) => (
        <article
          key={pkg.id}
          className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">{pkg.name}</p>
              <p className="text-xs text-muted-foreground">
                {PACKAGE_TYPE_LABELS[pkg.type] ?? pkg.type}
                {pkg.validityDays ? ` · ${pkg.validityDays} días de vigencia` : ""}
              </p>
            </div>
            <p className="shrink-0 font-bold text-foreground">{formatMoney(pkg.price)}</p>
          </div>

          {pkg.description && (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {pkg.description}
            </p>
          )}

          <ul className="flex flex-col gap-1">
            {pkg.items.map((item) => (
              <li key={item.id} className="text-xs text-muted-foreground">
                · {item.service.name}
                {item.quantity === null ? " — sin límite" : ` — ${item.quantity} visitas`}
              </li>
            ))}
          </ul>
        </article>
      ))}

      <p className="flex items-start gap-2 px-1 text-xs leading-relaxed text-muted-foreground">
        <Store className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Los paquetes se compran en sucursal. Pregunta por ellos en tu próxima
        visita.
      </p>
    </section>
  );
}
