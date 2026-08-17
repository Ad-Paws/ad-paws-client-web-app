// ⚠️ Documentos del backend ANTERIOR: firmas y campos ya no existen en el
// schema actual. Se migran a `src/graphql/` con el helper `graphql()` en
// F3–F6 — ver el plan, §6.1 (mapa de operaciones).
import { gql } from "@apollo/client";

export const DOG_BY_ID = gql`
  query DogById($dogByIdId: Int) {
    dogById(id: $dogByIdId) {
      birthDate
      breed
      color
      id
      gender
      imageUrl
      name
      ownerId
      size
      weight
      owner {
        id
        gender
        profilePicture
        phone
        name
        lastname
        email
        birthDate
        status
      }
    }
  }
`;

export const GET_USER_DOGS = gql`
  query UserDogs {
    userDogs {
      id
      name
      breed
      imageUrl
    }
  }
`;
