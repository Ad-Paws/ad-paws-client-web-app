import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { DOG_BY_ID } from "@/lib/api/dogs.api";
import { DOG_BREEDS, cn, formatAgeFromBirthDate } from "@/lib/utils";
import { ChevronLeft, PawPrint } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet-async";
import type { Dog } from "@/types/Dog";

// Paw accent colors cycling per card
const pawColors = [
  "text-amber-300",
  "text-emerald-300",
  "text-sky-300",
  "text-violet-300",
  "text-rose-300",
  "text-orange-300",
];

const genderLabels: Record<string, string> = {
  Male: "Macho",
  Female: "Hembra",
  Other: "Otro",
};

const sizeLabels: Record<string, string> = {
  SMALL: "Chico",
  MEDIUM: "Mediano",
  LARGE: "Grande",
  GIGANTIC: "X-Grande",
  TOY: "Toy",
};

interface InfoCardProps {
  label: string;
  value: string;
  colorIndex: number;
}

function InfoCard({ label, value, colorIndex }: InfoCardProps) {
  return (
    <div className="relative bg-muted/60 rounded-2xl p-4 flex flex-col gap-1 overflow-hidden">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="text-base font-bold text-foreground">{value || "—"}</p>
      <PawPrint
        className={cn(
          "absolute -bottom-2 -right-2 w-12 h-12 opacity-40",
          pawColors[colorIndex % pawColors.length],
        )}
      />
    </div>
  );
}

function DogProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6 px-6 pt-4">
      <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="w-28 h-5 rounded-full" />
          <Skeleton className="w-20 h-3 rounded-full" />
        </div>
        <Skeleton className="w-16 h-9 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function DogProfile() {
  const { dogId } = useParams<{ dogId: string }>();
  const navigate = useNavigate();

  const { data, loading } = useQuery<{ dogById: Dog }>(DOG_BY_ID, {
    variables: { dogByIdId: parseInt(dogId ?? "0", 10) },
    skip: !dogId,
  });

  const dog = data?.dogById;

  const infoCards = dog
    ? [
        { label: "Género", value: genderLabels[dog.gender ?? ""] ?? "—" },
        { label: "Edad", value: formatAgeFromBirthDate(dog.birthDate) },
        { label: "Color", value: dog.color ?? "—" },
        { label: "Tamaño", value: sizeLabels[dog.size ?? ""] ?? "—" },
        { label: "Peso", value: dog.weight ? `${dog.weight} kg` : "—" },
        {
          label: "Raza",
          value:
            DOG_BREEDS[dog.breed as keyof typeof DOG_BREEDS] ??
            dog.breed ??
            "—",
        },
      ]
    : [];

  return (
    <>
      <Helmet>
        <title>AdPaws | {dog?.name ?? "Perfil"}</title>
      </Helmet>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 shrink-0">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
          aria-label="Regresar"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-bold text-foreground flex-1 text-center pr-9">
          Perfil de {dog?.name}
        </h1>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-8">
        {loading || !dog ? (
          <DogProfileSkeleton />
        ) : (
          <div className="flex flex-col gap-5">
            {/* Dog card */}
            <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/15 flex items-center justify-center shrink-0">
                {dog.imageUrl ? (
                  <img
                    src={dog.imageUrl}
                    alt={dog.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-primary">
                    {dog.name[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-lg text-foreground truncate">
                  {dog.name}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {DOG_BREEDS[dog.breed as keyof typeof DOG_BREEDS] ??
                    dog.breed}
                </p>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              {infoCards.map((card, i) => (
                <InfoCard
                  key={card.label}
                  label={card.label}
                  value={card.value}
                  colorIndex={i}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
