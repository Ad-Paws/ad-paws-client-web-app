import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { Helmet } from "react-helmet-async";
import { Camera, ChevronLeft, PawPrint, Pencil } from "lucide-react";
import { DOG, UPDATE_DOG, UPLOAD_DOG_IMAGE } from "@/graphql/dogs";
import DogEditForm, { type DogEditValues } from "@/components/Dog/DogEditForm";
import DogContacts from "@/components/Dog/DogContacts";
import DogPackages from "@/components/Dog/DogPackages";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { DOG_BREEDS, cn, formatAgeFromBirthDate } from "@/lib/utils";
import { messageFor } from "@/lib/api/errors";

const pawColors = [
  "text-amber-300",
  "text-emerald-300",
  "text-sky-300",
  "text-violet-300",
  "text-rose-300",
  "text-orange-300",
];

const genderLabels: Record<string, string> = {
  MALE: "Macho",
  FEMALE: "Hembra",
  OTHER: "Otro",
};

const sizeLabels: Record<string, string> = {
  TOY: "Toy",
  SMALL: "Chico",
  MEDIUM: "Mediano",
  LARGE: "Grande",
  GIGANTIC: "X-Grande",
};

/** Límite del backend en `graphqlUploadExpress`: rechazar aquí evita el viaje. */
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function InfoCard({
  label,
  value,
  colorIndex,
}: {
  label: string;
  value: string;
  colorIndex: number;
}) {
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
  const fileInput = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // El id es ID (string) en el wire: se acabó el parseInt antes de mandarlo.
  const { data, loading } = useQuery(DOG, {
    variables: { id: dogId ?? "" },
    skip: !dogId,
  });

  const [updateDog, { loading: saving, error: saveError }] = useMutation(UPDATE_DOG, {
    onCompleted: () => setEditing(false),
  });

  const [uploadImage, { loading: uploading }] = useMutation(UPLOAD_DOG_IMAGE, {
    onError: (error) => setImageError(messageFor(error)),
  });

  const dog = data?.dog;

  const infoCards = dog
    ? [
        { label: "Sexo", value: genderLabels[dog.gender ?? ""] ?? "—" },
        { label: "Edad", value: formatAgeFromBirthDate(dog.birthDate) },
        { label: "Color", value: dog.color ?? "—" },
        { label: "Tamaño", value: sizeLabels[dog.size] ?? "—" },
        { label: "Peso", value: dog.weightKg ? `${dog.weightKg} kg` : "—" },
        {
          label: "Raza",
          value: DOG_BREEDS[dog.breed as keyof typeof DOG_BREEDS] ?? dog.breed ?? "—",
        },
      ]
    : [];

  const handleImagePicked = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // permite volver a elegir el mismo archivo
    if (!file || !dogId) return;

    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("La imagen pesa más de 10 MB. Elige una más ligera.");
      return;
    }

    setImageError(null);
    void uploadImage({ variables: { id: dogId, file } });
  };

  const handleSave = (values: DogEditValues) => {
    if (!dogId) return;
    void updateDog({
      variables: {
        id: dogId,
        input: {
          name: values.name,
          breed: values.breed || null,
          color: values.color || null,
          size: values.size || null,
          gender: values.gender || null,
          notes: values.notes || null,
          birthDate: values.birthDate?.toISOString() ?? null,
          // Coma por punto: un teclado en español ofrece coma, y el decimal
          // viaja como string.
          weightKg: values.weightKg ? values.weightKg.replace(",", ".") : null,
        },
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>AdPaws | {dog?.name ?? "Perfil"}</title>
      </Helmet>

      <div className="flex items-center gap-3 px-4 py-4 shrink-0">
        <button
          type="button"
          onClick={() => (editing ? setEditing(false) : navigate(-1))}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
          aria-label="Regresar"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-bold text-foreground flex-1 text-center pr-9">
          {editing ? `Editar a ${dog?.name}` : `Perfil de ${dog?.name ?? ""}`}
        </h1>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-8">
        {loading || !dog ? (
          <DogProfileSkeleton />
        ) : editing ? (
          <>
            <DogEditForm
              loading={saving}
              onCancel={() => setEditing(false)}
              onSubmit={handleSave}
              defaultValues={{
                name: dog.name,
                breed: dog.breed ?? "",
                color: dog.color ?? "",
                size: dog.size,
                gender: dog.gender ?? "",
                weightKg: dog.weightKg ?? "",
                birthDate: dog.birthDate ? new Date(dog.birthDate) : undefined,
                notes: dog.notes ?? "",
              }}
            />
            {saveError && (
              <p className="mt-3 text-sm text-destructive">{messageFor(saveError)}</p>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="group relative w-16 h-16 rounded-full overflow-hidden bg-primary/15 flex items-center justify-center shrink-0"
                aria-label="Cambiar foto"
              >
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
                <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
                  {uploading ? (
                    <Spinner className="size-5 text-white" />
                  ) : (
                    <Camera className="h-5 w-5 text-white" />
                  )}
                </span>
                {uploading && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/45">
                    <Spinner className="size-5 text-white" />
                  </span>
                )}
              </button>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImagePicked}
              />

              <div className="flex-1 min-w-0">
                <p className="font-bold text-lg text-foreground truncate">{dog.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {DOG_BREEDS[dog.breed as keyof typeof DOG_BREEDS] ?? dog.breed}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <Pencil className="h-3.5 w-3.5" /> Editar
              </button>
            </div>

            {imageError && <p className="text-sm text-destructive">{imageError}</p>}

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

            {dog.notes && (
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="mb-1 text-xs font-medium text-muted-foreground">Notas</p>
                <p className="text-sm leading-relaxed text-foreground">{dog.notes}</p>
              </div>
            )}

            <DogPackages dogId={dog.id} />

            <DogContacts dogId={dog.id} contacts={dog.contacts} />
          </div>
        )}
      </div>
    </>
  );
}
