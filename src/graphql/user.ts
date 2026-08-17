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

/**
 * Operaciones de sesión.
 *
 * `signUser` devuelve el par de tokens; con Bearer la app los guarda en vez de
 * descartarlos como hacía antes, cuando dependía sólo de la cookie.
 */
export const SIGN_IN = graphql(`
  mutation SignInUser($input: SignInUserInput!) {
    signUser(input: $input) {
      accessToken
      refreshToken
    }
  }
`);

/**
 * `refreshToken` es opcional en el schema pero obligatorio en la práctica para
 * un cliente Bearer: sin él el servidor no tiene qué revocar y la sesión de
 * este dispositivo seguiría viva hasta que expire el refresh.
 */
export const LOGOUT = graphql(`
  mutation LogoutUser($refreshToken: String) {
    logoutUser(refreshToken: $refreshToken) {
      success
    }
  }
`);
