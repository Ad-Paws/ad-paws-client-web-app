import { graphql } from "@/generated";

/**
 * `myDogs` reemplaza a `userDogs`. Nota: es de las pocas operaciones que
 * funcionan SIN empresa activa (`@auth` a secas), así que el dashboard puede
 * pintar las mascotas aunque la cuenta aún no esté vinculada a un negocio.
 */
export const MY_DOGS = graphql(`
  query MyDogs {
    myDogs {
      id
      name
      breed
      imageUrl
    }
  }
`);

/** `dog(id:)` reemplaza a `dogById(id:)`. `weight` pasó a ser `weightKg: String`. */
export const DOG = graphql(`
  query Dog($id: ID!) {
    dog(id: $id) {
      id
      name
      breed
      birthDate
      gender
      color
      size
      weightKg
      imageUrl
      notes
      primaryOwner {
        id
        name
        lastname
        email
        phone
      }
    }
  }
`);
