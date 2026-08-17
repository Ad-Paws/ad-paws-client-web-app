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
    "\n  query MyDogs {\n    myDogs {\n      id\n      name\n      breed\n      imageUrl\n    }\n  }\n": typeof types.MyDogsDocument,
    "\n  query Dog($id: ID!) {\n    dog(id: $id) {\n      id\n      name\n      breed\n      birthDate\n      gender\n      color\n      size\n      weightKg\n      imageUrl\n      notes\n      primaryOwner {\n        id\n        name\n        lastname\n        email\n        phone\n      }\n    }\n  }\n": typeof types.DogDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      name\n      lastname\n      phone\n      gender\n      birthDate\n      emailVerifiedAt\n      status\n    }\n  }\n": typeof types.MeDocument,
    "\n  query MyCompanies {\n    myCompanies {\n      id\n      name\n      logoUrl\n      slug\n      timezone\n      currency\n    }\n  }\n": typeof types.MyCompaniesDocument,
};
const documents: Documents = {
    "\n  query MyDogs {\n    myDogs {\n      id\n      name\n      breed\n      imageUrl\n    }\n  }\n": types.MyDogsDocument,
    "\n  query Dog($id: ID!) {\n    dog(id: $id) {\n      id\n      name\n      breed\n      birthDate\n      gender\n      color\n      size\n      weightKg\n      imageUrl\n      notes\n      primaryOwner {\n        id\n        name\n        lastname\n        email\n        phone\n      }\n    }\n  }\n": types.DogDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      name\n      lastname\n      phone\n      gender\n      birthDate\n      emailVerifiedAt\n      status\n    }\n  }\n": types.MeDocument,
    "\n  query MyCompanies {\n    myCompanies {\n      id\n      name\n      logoUrl\n      slug\n      timezone\n      currency\n    }\n  }\n": types.MyCompaniesDocument,
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
export function graphql(source: "\n  query MyDogs {\n    myDogs {\n      id\n      name\n      breed\n      imageUrl\n    }\n  }\n"): (typeof documents)["\n  query MyDogs {\n    myDogs {\n      id\n      name\n      breed\n      imageUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Dog($id: ID!) {\n    dog(id: $id) {\n      id\n      name\n      breed\n      birthDate\n      gender\n      color\n      size\n      weightKg\n      imageUrl\n      notes\n      primaryOwner {\n        id\n        name\n        lastname\n        email\n        phone\n      }\n    }\n  }\n"): (typeof documents)["\n  query Dog($id: ID!) {\n    dog(id: $id) {\n      id\n      name\n      breed\n      birthDate\n      gender\n      color\n      size\n      weightKg\n      imageUrl\n      notes\n      primaryOwner {\n        id\n        name\n        lastname\n        email\n        phone\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      id\n      email\n      name\n      lastname\n      phone\n      gender\n      birthDate\n      emailVerifiedAt\n      status\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      id\n      email\n      name\n      lastname\n      phone\n      gender\n      birthDate\n      emailVerifiedAt\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MyCompanies {\n    myCompanies {\n      id\n      name\n      logoUrl\n      slug\n      timezone\n      currency\n    }\n  }\n"): (typeof documents)["\n  query MyCompanies {\n    myCompanies {\n      id\n      name\n      logoUrl\n      slug\n      timezone\n      currency\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;