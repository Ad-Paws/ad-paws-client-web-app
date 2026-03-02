import { useAuth } from "@/contexts/AuthContext";
import { GET_USER_DOGS } from "@/lib/api/dogs.api";
import { useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarX2, HistoryIcon, WrenchIcon } from "lucide-react";
import { useStatsigClient } from "@statsig/react-bindings";
import DashboardDogsCarousel from "./DashboardDogsCarousel";
import type { Dog } from "@/types/Dog";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ComingSoon() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 px-8 text-center">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted">
        <WrenchIcon className="w-9 h-9 text-muted-foreground/60" />
      </div>
      <div className="space-y-1.5">
        <p className="text-lg font-semibold text-foreground">
          Estamos trabajando en ello
        </p>
        <p className="text-sm text-muted-foreground max-w-[240px] leading-relaxed">
          Esta sección estará disponible muy pronto. ¡Gracias por tu paciencia!
        </p>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 px-6 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
        {icon}
      </div>
      <p className="font-semibold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground max-w-[220px] leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function Dashboard() {
  useAuth();
  const navigate = useNavigate();
  const { data: userDogs, loading: dogsLoading } = useQuery<{
    userDogs: Partial<Dog>[];
  }>(GET_USER_DOGS);
  const dogs = userDogs?.userDogs ?? [];

  const handleDogPress = (dog: Partial<Dog>) => {
    if (dog.id) navigate(`/mis-perros/${dog.id}`);
  };

  const { client } = useStatsigClient();
  const isDashboardEnabled = client.checkGate("dashboard_feature");

  return (
    <>
      <Helmet>
        <title>AdPaws | Inicio</title>
      </Helmet>
      <div className="h-full px-6 py-4 overflow-auto">
        <DashboardDogsCarousel loading={dogsLoading} data={dogs} onDogPress={handleDogPress} />
        <section className="mt-6">
          {!isDashboardEnabled && <ComingSoon />}
          {isDashboardEnabled && (
            <Tabs defaultValue="upcoming-bookings">
              <TabsList className="w-full">
                <TabsTrigger value="upcoming-bookings">
                  Próximas reservas
                </TabsTrigger>
                <TabsTrigger value="previous-bookings">
                  Reservas pasadas
                </TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming-bookings">
                <EmptyState
                  icon={
                    <CalendarX2 className="w-10 h-10 text-muted-foreground/50" />
                  }
                  title="Sin reservas próximas"
                  description="Cuando tengas una reserva activa aparecerá aquí."
                />
              </TabsContent>
              <TabsContent value="previous-bookings">
                <EmptyState
                  icon={
                    <HistoryIcon className="w-10 h-10 text-muted-foreground/50" />
                  }
                  title="Sin historial"
                  description="Tus reservas completadas aparecerán aquí."
                />
              </TabsContent>
            </Tabs>
          )}
        </section>
      </div>
    </>
  );
}
