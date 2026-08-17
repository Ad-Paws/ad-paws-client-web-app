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

/**
 * Un perro por llamada: `createDogs` en bulk ya no existe.
 *
 * `ownerUserId` se omite a propósito — un cliente que crea un perro siempre
 * queda como dueño, sin importar lo que mande. `weightKg` es un decimal en
 * string, como todo lo que en la base es Decimal.
 */
export const CREATE_DOG = graphql(`
  mutation CreateDog($input: CreateDogInput!) {
    createDog(input: $input) {
      id
      name
      breed
      imageUrl
    }
  }
`);
