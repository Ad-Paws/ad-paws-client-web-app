import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { DogAvatarList } from "@/components/DogAvatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Dog } from "@/generated/schema-types";

interface DashboardDogsCarouselProps {
  loading: boolean;
  data: Partial<Dog>[];
  onDogPress?: (dog: Partial<Dog>) => void;
}

const DashboardDogsCarouselSkeleton = () => {
  return (
    <div className="flex gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2 shrink-0">
          <Skeleton key={i} className="w-14 h-14 rounded-full" />
          <Skeleton key={i} className="w-12 h-3 rounded-full" />
        </div>
      ))}
    </div>
  );
};

const DashboardDogsCarousel = ({
  loading,
  data,
  onDogPress,
}: DashboardDogsCarouselProps) => {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">Tus mascotas</p>
        <Link
          to="/mis-perros/nuevo"
          className="flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          <Plus className="h-4 w-4" /> Agregar
        </Link>
      </div>
      {loading ? (
        <DashboardDogsCarouselSkeleton />
      ) : data.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-4 py-5 text-center text-sm leading-relaxed text-muted-foreground">
          Todavía no tienes perros registrados. Agrega al primero para poder
          reservar.
        </p>
      ) : (
        <DogAvatarList dogs={data} onDogPress={onDogPress} />
      )}
    </section>
  );
};

export default DashboardDogsCarousel;
