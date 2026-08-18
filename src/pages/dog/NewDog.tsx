import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { Helmet } from "react-helmet-async";
import { ChevronLeft } from "lucide-react";
import DogEditForm, { type DogEditValues } from "@/components/Dog/DogEditForm";
import { CREATE_DOG, MY_DOGS } from "@/graphql/dogs";
import { messageFor } from "@/lib/api/errors";

/**
 * Alta de un perro desde dentro de la app.
 *
 * Hacía falta por dos caminos distintos: quien adopta un segundo perro después
 * de registrarse, y quien capturó perros en el alta y alguno no se guardó. Sin
 * esta pantalla, ambos casos terminaban en "escríbele a la guardería".
 */
export default function NewDog() {
  const navigate = useNavigate();

  const [createDog, { loading, error }] = useMutation(CREATE_DOG, {
    // `myDogs` es lo que pinta el carrusel del inicio: sin esto el perro
    // recién creado no aparece hasta recargar.
    refetchQueries: [{ query: MY_DOGS }],
    onCompleted: (result) => navigate(`/mis-perros/${result.createDog.id}`, { replace: true }),
  });

  const handleSubmit = (values: DogEditValues) => {
    if (!values.size) return; // `size` es obligatorio en CreateDogInput
    void createDog({
      variables: {
        input: {
          name: values.name,
          size: values.size,
          breed: values.breed || null,
          color: values.color || null,
          gender: values.gender || null,
          notes: values.notes || null,
          birthDate: values.birthDate?.toISOString() ?? null,
          weightKg: values.weightKg ? values.weightKg.replace(",", ".") : null,
        },
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>AdPaws | Agregar perro</title>
      </Helmet>

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
          Agregar un perro
        </h1>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-8">
        <DogEditForm
          loading={loading}
          onCancel={() => navigate(-1)}
          onSubmit={handleSubmit}
          defaultValues={{
            name: "",
            breed: "",
            color: "",
            size: "",
            gender: "",
            weightKg: "",
            birthDate: undefined,
            notes: "",
          }}
        />
        {error && <p className="mt-3 text-sm text-destructive">{messageFor(error)}</p>}
      </div>
    </>
  );
}
