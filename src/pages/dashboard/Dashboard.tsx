import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MY_DOGS } from "@/graphql/dogs";
import { startOfToday } from "@/lib/schedule";
import { splitReservations } from "@/lib/reservations";
import { RESERVATIONS } from "@/graphql/reservations";
import DashboardDogsCarousel from "./DashboardDogsCarousel";
import { ReservationList } from "./ReservationList";
import type { Dog } from "@/generated/schema-types";

/**
 * Inicio.
 *
 * Las dos pestañas llevaban meses vacías con un EmptyState escrito a mano
 * detrás de un feature flag. Ahora leen `reservations`, que se limita sola a
 * los perros del cliente: el mismo campo sirve al mostrador y al dueño, y el
 * servidor decide qué ve cada quién.
 */
export default function Dashboard() {
  const navigate = useNavigate();

  const { data: dogsData, loading: dogsLoading } = useQuery(MY_DOGS);
  const {
    data: reservationsData,
    loading: reservationsLoading,
    error: reservationsError,
  } = useQuery(RESERVATIONS, { fetchPolicy: "cache-and-network" });

  const dogs = dogsData?.myDogs ?? [];

  /**
   * El corte se fija una vez al montar, al INICIO DE HOY.
   *
   * Comparar contra el reloj exacto mandaba al historial una reserva de hoy en
   * cuanto pasaba su hora de entrada: alguien que reserva a las 10 de la noche
   * la guardería de mañana veía bien, pero quien reservaba el mismo día ya no
   * encontraba su reserva. Un día es la granularidad con la que la gente piensa
   * en esto.
   *
   * Leer el reloj dentro del `useMemo` sería impuro y el compilador de React lo
   * rechaza con razón; congelarlo además evita que una reserva salte de pestaña
   * sola mientras alguien mira la pantalla.
   */
  const [today] = useState(() => startOfToday().getTime());

  // La regla vive en src/lib/reservations.ts, donde se puede probar.
  const { upcoming, past } = useMemo(
    () => splitReservations(reservationsData?.reservations ?? [], today),
    [reservationsData, today],
  );

  const handleDogPress = (dog: Partial<Dog>) => {
    if (dog.id) navigate(`/mis-perros/${dog.id}`);
  };

  return (
    <>
      <Helmet>
        <title>AdPaws | Inicio</title>
      </Helmet>

      <div className="h-full overflow-auto px-6 py-4">
        <DashboardDogsCarousel
          loading={dogsLoading}
          data={dogs}
          onDogPress={handleDogPress}
        />

        <section className="mt-6">
          <Tabs defaultValue="upcoming-bookings">
            <TabsList className="w-full">
              <TabsTrigger value="upcoming-bookings">Próximas reservas</TabsTrigger>
              <TabsTrigger value="previous-bookings">Reservas pasadas</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming-bookings">
              <ReservationList
                reservations={upcoming}
                loading={reservationsLoading && !reservationsData}
                error={reservationsError}
                variant="upcoming"
              />
            </TabsContent>

            <TabsContent value="previous-bookings">
              <ReservationList
                reservations={past}
                loading={reservationsLoading && !reservationsData}
                error={reservationsError}
                variant="past"
              />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </>
  );
}
