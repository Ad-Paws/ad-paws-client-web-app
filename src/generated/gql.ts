/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query CompanyBySlug($slug: String!) {\n    companyBySlug(slug: $slug) {\n      id\n      slug\n      name\n      logoUrl\n    }\n  }\n": typeof types.CompanyBySlugDocument,
    "\n  mutation JoinCompany($slug: String!) {\n    joinCompany(slug: $slug) {\n      id\n      role\n      status\n      company {\n        id\n        name\n        slug\n        logoUrl\n      }\n    }\n  }\n": typeof types.JoinCompanyDocument,
    "\n  query MyDogs {\n    myDogs {\n      id\n      name\n      breed\n      imageUrl\n    }\n  }\n": typeof types.MyDogsDocument,
    "\n  query Dog($id: ID!) {\n    dog(id: $id) {\n      id\n      name\n      breed\n      birthDate\n      gender\n      color\n      size\n      weightKg\n      imageUrl\n      notes\n      primaryOwner {\n        id\n        name\n        lastname\n        email\n        phone\n      }\n    }\n  }\n": typeof types.DogDocument,
    "\n  mutation CreateDog($input: CreateDogInput!) {\n    createDog(input: $input) {\n      id\n      name\n      breed\n      imageUrl\n    }\n  }\n": typeof types.CreateDogDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      name\n      lastname\n      phone\n      gender\n      birthDate\n      emailVerifiedAt\n      status\n    }\n  }\n": typeof types.MeDocument,
    "\n  query MyCompanies {\n    myCompanies {\n      id\n      name\n      logoUrl\n      slug\n      timezone\n      currency\n    }\n  }\n": typeof types.MyCompaniesDocument,
    "\n  mutation SignInUser($input: SignInUserInput!) {\n    signUser(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n": typeof types.SignInUserDocument,
    "\n  mutation LogoutUser($refreshToken: String) {\n    logoutUser(refreshToken: $refreshToken) {\n      success\n    }\n  }\n": typeof types.LogoutUserDocument,
    "\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      user {\n        id\n        email\n        name\n      }\n      tokens {\n        accessToken\n        refreshToken\n      }\n    }\n  }\n": typeof types.CreateUserDocument,
    "\n  mutation VerifyEmail($token: String!) {\n    verifyEmail(token: $token) {\n      accessToken\n      refreshToken\n    }\n  }\n": typeof types.VerifyEmailDocument,
    "\n  mutation UpdateUser($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      id\n      name\n      lastname\n      email\n      phone\n      gender\n      birthDate\n    }\n  }\n": typeof types.UpdateUserDocument,
    "\n  mutation RequestPasswordReset($input: RequestPasswordResetInput!) {\n    requestPasswordReset(input: $input)\n  }\n": typeof types.RequestPasswordResetDocument,
    "\n  mutation ConfirmPasswordReset($input: ConfirmPasswordResetInput!) {\n    confirmPasswordReset(input: $input)\n  }\n": typeof types.ConfirmPasswordResetDocument,
    "\n  mutation ChangePassword($input: ChangePasswordInput!) {\n    changePassword(input: $input)\n  }\n": typeof types.ChangePasswordDocument,
};
const documents: Documents = {
    "\n  query CompanyBySlug($slug: String!) {\n    companyBySlug(slug: $slug) {\n      id\n      slug\n      name\n      logoUrl\n    }\n  }\n": types.CompanyBySlugDocument,
    "\n  mutation JoinCompany($slug: String!) {\n    joinCompany(slug: $slug) {\n      id\n      role\n      status\n      company {\n        id\n        name\n        slug\n        logoUrl\n      }\n    }\n  }\n": types.JoinCompanyDocument,
    "\n  query MyDogs {\n    myDogs {\n      id\n      name\n      breed\n      imageUrl\n    }\n  }\n": types.MyDogsDocument,
    "\n  query Dog($id: ID!) {\n    dog(id: $id) {\n      id\n      name\n      breed\n      birthDate\n      gender\n      color\n      size\n      weightKg\n      imageUrl\n      notes\n      primaryOwner {\n        id\n        name\n        lastname\n        email\n        phone\n      }\n    }\n  }\n": types.DogDocument,
    "\n  mutation CreateDog($input: CreateDogInput!) {\n    createDog(input: $input) {\n      id\n      name\n      breed\n      imageUrl\n    }\n  }\n": types.CreateDogDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      name\n      lastname\n      phone\n      gender\n      birthDate\n      emailVerifiedAt\n      status\n    }\n  }\n": types.MeDocument,
    "\n  query MyCompanies {\n    myCompanies {\n      id\n      name\n      logoUrl\n      slug\n      timezone\n      currency\n    }\n  }\n": types.MyCompaniesDocument,
    "\n  mutation SignInUser($input: SignInUserInput!) {\n    signUser(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n": types.SignInUserDocument,
    "\n  mutation LogoutUser($refreshToken: String) {\n    logoutUser(refreshToken: $refreshToken) {\n      success\n    }\n  }\n": types.LogoutUserDocument,
    "\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      user {\n        id\n        email\n        name\n      }\n      tokens {\n        accessToken\n        refreshToken\n      }\n    }\n  }\n": types.CreateUserDocument,
    "\n  mutation VerifyEmail($token: String!) {\n    verifyEmail(token: $token) {\n      accessToken\n      refreshToken\n    }\n  }\n": types.VerifyEmailDocument,
    "\n  mutation UpdateUser($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      id\n      name\n      lastname\n      email\n      phone\n      gender\n      birthDate\n    }\n  }\n": types.UpdateUserDocument,
    "\n  mutation RequestPasswordReset($input: RequestPasswordResetInput!) {\n    requestPasswordReset(input: $input)\n  }\n": types.RequestPasswordResetDocument,
    "\n  mutation ConfirmPasswordReset($input: ConfirmPasswordResetInput!) {\n    confirmPasswordReset(input: $input)\n  }\n": types.ConfirmPasswordResetDocument,
    "\n  mutation ChangePassword($input: ChangePasswordInput!) {\n    changePassword(input: $input)\n  }\n": types.ChangePasswordDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CompanyBySlug($slug: String!) {\n    companyBySlug(slug: $slug) {\n      id\n      slug\n      name\n      logoUrl\n    }\n  }\n"): (typeof documents)["\n  query CompanyBySlug($slug: String!) {\n    companyBySlug(slug: $slug) {\n      id\n      slug\n      name\n      logoUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation JoinCompany($slug: String!) {\n    joinCompany(slug: $slug) {\n      id\n      role\n      status\n      company {\n        id\n        name\n        slug\n        logoUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation JoinCompany($slug: String!) {\n    joinCompany(slug: $slug) {\n      id\n      role\n      status\n      company {\n        id\n        name\n        slug\n        logoUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MyDogs {\n    myDogs {\n      id\n      name\n      breed\n      imageUrl\n    }\n  }\n"): (typeof documents)["\n  query MyDogs {\n    myDogs {\n      id\n      name\n      breed\n      imageUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Dog($id: ID!) {\n    dog(id: $id) {\n      id\n      name\n      breed\n      birthDate\n      gender\n      color\n      size\n      weightKg\n      imageUrl\n      notes\n      primaryOwner {\n        id\n        name\n        lastname\n        email\n        phone\n      }\n    }\n  }\n"): (typeof documents)["\n  query Dog($id: ID!) {\n    dog(id: $id) {\n      id\n      name\n      breed\n      birthDate\n      gender\n      color\n      size\n      weightKg\n      imageUrl\n      notes\n      primaryOwner {\n        id\n        name\n        lastname\n        email\n        phone\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateDog($input: CreateDogInput!) {\n    createDog(input: $input) {\n      id\n      name\n      breed\n      imageUrl\n    }\n  }\n"): (typeof documents)["\n  mutation CreateDog($input: CreateDogInput!) {\n    createDog(input: $input) {\n      id\n      name\n      breed\n      imageUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      id\n      email\n      name\n      lastname\n      phone\n      gender\n      birthDate\n      emailVerifiedAt\n      status\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      id\n      email\n      name\n      lastname\n      phone\n      gender\n      birthDate\n      emailVerifiedAt\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MyCompanies {\n    myCompanies {\n      id\n      name\n      logoUrl\n      slug\n      timezone\n      currency\n    }\n  }\n"): (typeof documents)["\n  query MyCompanies {\n    myCompanies {\n      id\n      name\n      logoUrl\n      slug\n      timezone\n      currency\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignInUser($input: SignInUserInput!) {\n    signUser(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  mutation SignInUser($input: SignInUserInput!) {\n    signUser(input: $input) {\n      accessToken\n      refreshToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LogoutUser($refreshToken: String) {\n    logoutUser(refreshToken: $refreshToken) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation LogoutUser($refreshToken: String) {\n    logoutUser(refreshToken: $refreshToken) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      user {\n        id\n        email\n        name\n      }\n      tokens {\n        accessToken\n        refreshToken\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      user {\n        id\n        email\n        name\n      }\n      tokens {\n        accessToken\n        refreshToken\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation VerifyEmail($token: String!) {\n    verifyEmail(token: $token) {\n      accessToken\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  mutation VerifyEmail($token: String!) {\n    verifyEmail(token: $token) {\n      accessToken\n      refreshToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateUser($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      id\n      name\n      lastname\n      email\n      phone\n      gender\n      birthDate\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUser($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      id\n      name\n      lastname\n      email\n      phone\n      gender\n      birthDate\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RequestPasswordReset($input: RequestPasswordResetInput!) {\n    requestPasswordReset(input: $input)\n  }\n"): (typeof documents)["\n  mutation RequestPasswordReset($input: RequestPasswordResetInput!) {\n    requestPasswordReset(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ConfirmPasswordReset($input: ConfirmPasswordResetInput!) {\n    confirmPasswordReset(input: $input)\n  }\n"): (typeof documents)["\n  mutation ConfirmPasswordReset($input: ConfirmPasswordResetInput!) {\n    confirmPasswordReset(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ChangePassword($input: ChangePasswordInput!) {\n    changePassword(input: $input)\n  }\n"): (typeof documents)["\n  mutation ChangePassword($input: ChangePasswordInput!) {\n    changePassword(input: $input)\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;