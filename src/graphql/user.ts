import { graphql } from "@/generated";

/**
 * Primeros documentos migrados al schema nuevo.
 *
 * `me` reemplaza a la query `user { … company { … } }`, que ya no existe: la
 * empresa dejó de colgar del usuario y se resuelve por membresía.
 */
export const ME = graphql(`
  query Me {
    me {
      id
      email
      name
      lastname
      phone
      gender
      birthDate
      emailVerifiedAt
      status
    }
  }
`);

/** Las empresas del usuario, para el selector cuando hay más de una. */
export const MY_COMPANIES = graphql(`
  query MyCompanies {
    myCompanies {
      id
      name
      logoUrl
      slug
      timezone
      currency
    }
  }
`);
