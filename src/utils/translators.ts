import type { DogFormValues } from "@/components/Form/Forms/ClientSignupStep2Form";

export const translateDogFormToBody = (dog: DogFormValues, ownerId: number) => {
  console.log("Dog to translate:", dog);
  const dogTranslated = {
    birthDate: dog.birthDate?.toISOString(),
    ownerId: ownerId,
    size: dog.size as "SMALL" | "MEDIUM" | "LARGE" | "GIGANTIC",
    gender: dog.gender as "Male" | "Female",
    weight: parseInt(dog.weight),
    breed: dog.breed,
    color: dog.color,
    name: dog.name,
    picture: dog.photo,
  };
  console.log("Dog translated:", dogTranslated);
  return dogTranslated;
};
