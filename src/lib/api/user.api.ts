// ⚠️ Documentos del backend ANTERIOR: firmas y campos ya no existen en el
// schema actual. Se migran a `src/graphql/` con el helper `graphql()` en
// F3–F6 — ver el plan, §6.1 (mapa de operaciones).
import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation SignInUser($input: SignInUserInput) {
    signUser(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

export const USER_QUERY = gql`
  query User {
    user {
      id
      email
      name
      company {
        id
        name
        uuid
        logoUrl
        ownerId
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation LogoutUser {
    logoutUser {
      success
    }
  }
`;

export const CREATE_USER_CLIENT = gql`
  mutation Mutation($input: CreateUserInput) {
    createUser(input: $input) {
      user {
        id
      }
      tokens {
        accessToken
        refreshToken
      }
    }
  }
`;

export const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      accessToken
      refreshToken
    }
  }
`;

export const USER_PROFILE_QUERY = gql`
  query UserProfile {
    user {
      id
      name
      lastname
      email
      phone
      gender
      birthDate
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
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
`;
