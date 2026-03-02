import { useAuth } from "@/contexts/AuthContext";
import { GET_USER_DOGS } from "@/lib/api/dogs.api";
import { useQuery } from "@apollo/client/react";
import { Helmet } from "react-helmet-async";
import { DogAvatarList } from "@/components/DogAvatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarX2, HistoryIcon } from "lucide-react";

interface Dog {
  id: string;
  name: string;
  imageUrl?: string | null;
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
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
  const { data: userDogs } = useQuery<{ userDogs: Dog[] }>(GET_USER_DOGS);
  const dogs = userDogs?.userDogs ?? [];

  return (
    <>
      <Helmet>
        <title>AdPaws | Inicio</title>
      </Helmet>
      <div className="h-full px-6 py-4 overflow-auto">
        {/* <p className="text-2xl font-bold mb-6">
          ¡{getTimeOfDay()}, {user?.name}!
        </p> */}

        {dogs.length > 0 && (
          <section>
            <p className="text-sm font-semibold text-muted-foreground mb-3">
              Tus mascotas
            </p>
            <DogAvatarList dogs={dogs} />
          </section>
        )}

        <section className="mt-6">
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
                icon={<CalendarX2 className="w-10 h-10 text-muted-foreground/50" />}
                title="Sin reservas próximas"
                description="Cuando tengas una reserva activa aparecerá aquí."
              />
            </TabsContent>
            <TabsContent value="previous-bookings">
              <EmptyState
                icon={<HistoryIcon className="w-10 h-10 text-muted-foreground/50" />}
                title="Sin historial"
                description="Tus reservas completadas aparecerán aquí."
              />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </>
  );
}
