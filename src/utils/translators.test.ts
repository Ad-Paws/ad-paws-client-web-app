import { describe, expect, it } from "vitest";
import { toCreateDogInput } from "./translators";
import type { DogFormValues } from "@/components/Form/Forms/ClientSignupStep2Form";

const form = (overrides: Partial<DogFormValues> = {}): DogFormValues => ({
  id: "1",
  name: "Canela",
  breed: "labrador",
  color: "Café",
  size: "MEDIUM",
  gender: "FEMALE",
  weight: "8.4",
  birthDate: new Date(2022, 0, 15),
  ...overrides,
});

/**
 * La traducción del formulario al input es donde vivían tres errores del
 * backend viejo: el peso como entero, el género en minúsculas y el dueño
 * mandado desde el cliente.
 */
describe("toCreateDogInput", () => {
  it("manda el peso como string y conserva los gramos", () => {
    // El parseInt anterior guardaba 8.4 kg como 8.
    expect(toCreateDogInput(form()).weightKg).toBe("8.4");
  });

  it("no inventa un peso cuando el campo viene vacío", () => {
    expect(toCreateDogInput(form({ weight: "" })).weightKg).toBeNull();
  });

  it("manda el género tal cual, en el enum del schema", () => {
    expect(toCreateDogInput(form()).gender).toBe("FEMALE");
    expect(toCreateDogInput(form({ gender: "" })).gender).toBeNull();
  });

  it("convierte la fecha a ISO", () => {
    expect(toCreateDogInput(form()).birthDate).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("nunca manda ownerUserId: el dueño lo decide el servidor", () => {
    expect(toCreateDogInput(form())).not.toHaveProperty("ownerUserId");
  });

  it("convierte los opcionales vacíos en null, no en cadena vacía", () => {
    const input = toCreateDogInput(form({ breed: "", color: "" }));
    expect(input.breed).toBeNull();
    expect(input.color).toBeNull();
  });
});
