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
      contacts {
        id
        type
        name
        phone
        email
        relation
        notes
      }
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

/** `updateDog(input)` pasó a `updateDog(id, input)`: el id salió del input. */
export const UPDATE_DOG = graphql(`
  mutation UpdateDog($id: ID!, $input: UpdateDogInput!) {
    updateDog(id: $id, input: $input) {
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
    }
  }
`);

/**
 * La foto se sube aparte, cuando el perro ya tiene id — por eso no es parte de
 * `CreateDogInput`. Va como multipart, que es lo que exige el `UploadHttpLink`
 * con el header de preflight.
 */
export const UPLOAD_DOG_IMAGE = graphql(`
  mutation UploadDogImage($id: ID!, $file: Upload!) {
    uploadDogImage(id: $id, file: $file) {
      id
      imageUrl
    }
  }
`);

/**
 * Contactos del perro: veterinario, emergencia y quién puede recogerlo.
 *
 * Son datos que antes vivían en la cabeza de quien atiende el mostrador. Que
 * el dueño los cargue desde su app es la única forma de que estén cuando
 * hacen falta.
 */
export const ADD_DOG_CONTACT = graphql(`
  mutation AddDogContact($dogId: ID!, $input: DogContactInput!) {
    addDogContact(dogId: $dogId, input: $input) {
      id
      type
      name
      phone
      email
      relation
      notes
    }
  }
`);

export const REMOVE_DOG_CONTACT = graphql(`
  mutation RemoveDogContact($id: ID!) {
    removeDogContact(id: $id)
  }
`);
