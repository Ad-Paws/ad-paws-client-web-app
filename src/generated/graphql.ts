/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type DogSize =
  | 'GIGANTIC'
  | 'LARGE'
  | 'MEDIUM'
  | 'SMALL'
  | 'TOY';

/** Biological sex, as recorded for a person or a dog. */
export type Gender =
  | 'FEMALE'
  | 'MALE'
  | 'OTHER';

/** Lifecycle of a user account, independent of any company membership. */
export type UserStatus =
  | 'ACTIVE'
  | 'BLOCKED'
  | 'DELETED'
  | 'INACTIVE'
  /** Registered but email not yet verified. */
  | 'INCOMPLETE';

export type MyDogsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyDogsQuery = { myDogs: Array<{ id: string, name: string, breed: string | null, imageUrl: string | null }> };

export type DogQueryVariables = Exact<{
  id: string | number;
}>;


export type DogQuery = { dog: { id: string, name: string, breed: string | null, birthDate: string | null, gender: Gender | null, color: string | null, size: DogSize, weightKg: string | null, imageUrl: string | null, notes: string | null, primaryOwner: { id: string, name: string | null, lastname: string | null, email: string, phone: string | null } | null } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: string, email: string, name: string | null, lastname: string | null, phone: string | null, gender: Gender | null, birthDate: string | null, emailVerifiedAt: string | null, status: UserStatus } | null };

export type MyCompaniesQueryVariables = Exact<{ [key: string]: never; }>;


export type MyCompaniesQuery = { myCompanies: Array<{ id: string, name: string, logoUrl: string | null, slug: string | null, timezone: string, currency: string }> };


export const MyDogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyDogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myDogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"breed"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]}}]} as unknown as DocumentNode<MyDogsQuery, MyDogsQueryVariables>;
export const DogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Dog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"breed"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"weightKg"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"primaryOwner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]} as unknown as DocumentNode<DogQuery, DogQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const MyCompaniesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyCompanies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myCompanies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}}]}}]}}]} as unknown as DocumentNode<MyCompaniesQuery, MyCompaniesQueryVariables>;