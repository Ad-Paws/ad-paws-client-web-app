import type { DogFormValues } from "@/components/Form/Forms/ClientSignupStep2Form";
import type { CreateDogInput } from "@/generated/schema-types";

/**
 * Del formulario a `CreateDogInput`.
 *
 * Tres cosas cambiaron con el backend nuevo y las tres se resuelven aquí:
 *
 * - `weight: Float` pasó a `weightKg: String`. Es un decimal, y mandarlo como
 *   número es exactamente lo que la base evita usando Decimal. El
 *   `parseInt` anterior además tiraba los gramos: 8.4 kg se guardaba como 8.
 * - `ownerId` ya no se manda: un cliente que crea un perro siempre queda como
 *   dueño, lo decida el servidor y no la petición.
 * - `picture` no existe en el input. La foto se sube aparte con
 *   `uploadDogImage`, una vez que el perro tiene id.
 */
export const toCreateDogInput = (dog: DogFormValues): CreateDogInput => ({
  name: dog.name,
  size: dog.size as CreateDogInput["size"],
  breed: dog.breed || null,
  color: dog.color || null,
  gender: dog.gender || null,
  birthDate: dog.birthDate ? dog.birthDate.toISOString() : null,
  weightKg: dog.weight ? String(dog.weight).trim() : null,
});
