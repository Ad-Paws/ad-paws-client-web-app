import { DogAvatarList } from "@/components/DogAvatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Dog } from "@/types/Dog";

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
      <p className="text-sm font-semibold text-muted-foreground mb-3">
        Tus mascotas
      </p>
      {loading ? (
        <DashboardDogsCarouselSkeleton />
      ) : (
        <DogAvatarList dogs={data ?? []} onDogPress={onDogPress} />
      )}
    </section>
  );
};

export default DashboardDogsCarousel;
