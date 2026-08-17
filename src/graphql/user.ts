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

/**
 * Alta pública.
 *
 * `companySlug` es lo que convierte la cuenta en cliente de un negocio: sin
 * él el usuario queda sin membresía y toda operación con datos de negocio
 * responde TENANT_CONTEXT_REQUIRED. `app: CLIENT` decide a dónde apunta el
 * link del correo de verificación, que con dos frontends no puede ser fijo.
 */
export const CREATE_USER = graphql(`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        id
        email
        name
      }
      tokens {
        accessToken
        refreshToken
      }
    }
  }
`);

export const VERIFY_EMAIL = graphql(`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      accessToken
      refreshToken
    }
  }
`);

/** Sin email ni contraseña: el primero no se edita y la segunda tiene su propia mutación. */
export const UPDATE_USER = graphql(`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      name
      lastname
      email
      phone
      gender
      birthDate
    }
  }
`);

/** Devuelve true exista o no la cuenta: lo contrario delataría qué correos hay registrados. */
export const REQUEST_PASSWORD_RESET = graphql(`
  mutation RequestPasswordReset($input: RequestPasswordResetInput!) {
    requestPasswordReset(input: $input)
  }
`);

export const CONFIRM_PASSWORD_RESET = graphql(`
  mutation ConfirmPasswordReset($input: ConfirmPasswordResetInput!) {
    confirmPasswordReset(input: $input)
  }
`);

/** Cambiar una contraseña conocida exige demostrar que se conoce. */
export const CHANGE_PASSWORD = graphql(`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`);
