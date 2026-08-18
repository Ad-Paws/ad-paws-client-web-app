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
    "\n  query Dog($id: ID!) {\n    dog(id: $id) {\n      id\n      name\n      breed\n      birthDate\n      gender\n      color\n      size\n      weightKg\n      imageUrl\n      notes\n      contacts {\n        id\n        type\n        name\n        phone\n        email\n        relation\n        notes\n      }\n      primaryOwner {\n        id\n        name\n        lastname\n        email\n        phone\n      }\n    }\n  }\n": typeof types.DogDocument,
    "\n  mutation CreateDog($input: CreateDogInput!) {\n    createDog(input: $input) {\n      id\n      name\n      breed\n      imageUrl\n    }\n  }\n": typeof types.CreateDogDocument,
    "\n  mutation UpdateDog($id: ID!, $input: UpdateDogInput!) {\n    updateDog(id: $id, input: $input) {\n      id\n      name\n      breed\n      birthDate\n      gender\n      color\n      size\n      weightKg\n      imageUrl\n      notes\n    }\n  }\n": typeof types.UpdateDogDocument,
    "\n  mutation UploadDogImage($id: ID!, $file: Upload!) {\n    uploadDogImage(id: $id, file: $file) {\n      id\n      imageUrl\n    }\n  }\n": typeof types.UploadDogImageDocument,
    "\n  mutation AddDogContact($dogId: ID!, $input: DogContactInput!) {\n    addDogContact(dogId: $dogId, input: $input) {\n      id\n      type\n      name\n      phone\n      email\n      relation\n      notes\n    }\n  }\n": typeof types.AddDogContactDocument,
    "\n  mutation RemoveDogContact($id: ID!) {\n    removeDogContact(id: $id)\n  }\n": typeof types.RemoveDogContactDocument,
    "\n  query DogPackages($dogId: ID!) {\n    dogPackages(dogId: $dogId, activeOnly: true) {\n      id\n      status\n      purchaseDate\n      expiryDate\n      renewalDate\n      billingCycle\n      package {\n        id\n        name\n        type\n        validityDays\n      }\n      balances {\n        id\n        initialQuantity\n        remainingQuantity\n        usedQuantity\n        service {\n          id\n          name\n        }\n      }\n    }\n  }\n": typeof types.DogPackagesDocument,
    "\n  query Packages {\n    packages(activeOnly: true) {\n      id\n      name\n      description\n      price\n      type\n      validityDays\n      items {\n        id\n        quantity\n        service {\n          id\n          name\n        }\n      }\n    }\n  }\n": typeof types.PackagesDocument,
    "\n  query QuoteReservation($input: CreateReservationInput!) {\n    quoteReservation(input: $input) {\n      subtotal\n      total\n      amountDue\n      coveredDates\n      warnings\n      service {\n        id\n        name\n        type\n        pricingUnit\n      }\n      dates {\n        date\n        basePrice\n        price\n        exception {\n          id\n          name\n          reason\n        }\n      }\n      addOns {\n        price\n        coveredByPackage\n        service {\n          id\n          name\n        }\n      }\n    }\n  }\n": typeof types.QuoteReservationDocument,
    "\n  mutation CreateReservation($input: CreateReservationInput!) {\n    createReservation(input: $input) {\n      id\n      status\n      scheduledCheckIn\n      scheduledCheckOut\n      total\n      dog {\n        id\n        name\n      }\n    }\n  }\n": typeof types.CreateReservationDocument,
    "\n  query Reservations($filter: ReservationFilter) {\n    reservations(filter: $filter, first: 25) {\n      id\n      status\n      scheduledCheckIn\n      scheduledCheckOut\n      total\n      dog {\n        id\n        name\n        imageUrl\n      }\n      items {\n        id\n        name\n        kind\n      }\n    }\n  }\n": typeof types.ReservationsDocument,
    "\n  query Reservation($id: ID!) {\n    reservation(id: $id) {\n      id\n      status\n      scheduledCheckIn\n      scheduledCheckOut\n      actualCheckInAt\n      actualCheckOutAt\n      total\n      notes\n      createdAt\n      dog {\n        id\n        name\n        imageUrl\n        breed\n      }\n      items {\n        id\n        name\n        kind\n        quantity\n        unitPrice\n        totalPrice\n        sourceType\n      }\n      occupancy {\n        id\n        date\n        kind\n        sourceType\n      }\n      events {\n        id\n        type\n        occurredAt\n        notes\n      }\n    }\n  }\n": typeof types.ReservationDocument,
    "\n  mutation CancelReservation($id: ID!, $reason: String) {\n    cancelReservation(id: $id, reason: $reason) {\n      id\n      status\n      total\n    }\n  }\n": typeof types.CancelReservationDocument,
    "\n  query Services($type: ServiceType) {\n    services(type: $type, status: ACTIVE) {\n      id\n      name\n      description\n      type\n      category\n      price\n      currency\n      pricingUnit\n      durationMinutes\n      opensAtMinute\n      closesAtMinute\n      checkoutCutoffMinute\n      daysOfWeek\n      capacity\n    }\n  }\n": typeof types.ServicesDocument,
    "\n  query ServiceAvailability($serviceId: ID!, $date: DateTime!) {\n    serviceAvailability(serviceId: $serviceId, date: $date) {\n      bookable\n      reason\n    }\n  }\n": typeof types.ServiceAvailabilityDocument,
    "\n  query EffectivePriceRange($serviceId: ID!, $from: DateTime!, $to: DateTime!) {\n    effectivePriceRange(serviceId: $serviceId, from: $from, to: $to) {\n      date\n      basePrice\n      price\n      packagesAllowed\n      exception {\n        id\n        name\n        reason\n      }\n    }\n  }\n": typeof types.EffectivePriceRangeDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      name\n      lastname\n      phone\n      gender\n      birthDate\n      emailVerifiedAt\n      status\n    }\n  }\n": typeof types.MeDocument,
    "\n  query MyCompanies {\n    myCompanies {\n      id\n      name\n      logoUrl\n      slug\n      timezone\n      currency\n      cancellationWindowHours\n    }\n  }\n": typeof types.MyCompaniesDocument,
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
    "\n  query Dog($id: ID!) {\n    dog(id: $id) {\n      id\n      name\n      breed\n      birthDate\n      gender\n      color\n      size\n      weightKg\n      imageUrl\n      notes\n      contacts {\n        id\n        type\n        name\n        phone\n        email\n        relation\n        notes\n      }\n      primaryOwner {\n        id\n        name\n        lastname\n        email\n        phone\n      }\n    }\n  }\n": types.DogDocument,
    "\n  mutation CreateDog($input: CreateDogInput!) {\n    createDog(input: $input) {\n      id\n      name\n      breed\n      imageUrl\n    }\n  }\n": types.CreateDogDocument,
    "\n  mutation UpdateDog($id: ID!, $input: UpdateDogInput!) {\n    updateDog(id: $id, input: $input) {\n      id\n      name\n      breed\n      birthDate\n      gender\n      color\n      size\n      weightKg\n      imageUrl\n      notes\n    }\n  }\n": types.UpdateDogDocument,
    "\n  mutation UploadDogImage($id: ID!, $file: Upload!) {\n    uploadDogImage(id: $id, file: $file) {\n      id\n      imageUrl\n    }\n  }\n": types.UploadDogImageDocument,
    "\n  mutation AddDogContact($dogId: ID!, $input: DogContactInput!) {\n    addDogContact(dogId: $dogId, input: $input) {\n      id\n      type\n      name\n      phone\n      email\n      relation\n      notes\n    }\n  }\n": types.AddDogContactDocument,
    "\n  mutation RemoveDogContact($id: ID!) {\n    removeDogContact(id: $id)\n  }\n": types.RemoveDogContactDocument,
    "\n  query DogPackages($dogId: ID!) {\n    dogPackages(dogId: $dogId, activeOnly: true) {\n      id\n      status\n      purchaseDate\n      expiryDate\n      renewalDate\n      billingCycle\n      package {\n        id\n        name\n        type\n        validityDays\n      }\n      balances {\n        id\n        initialQuantity\n        remainingQuantity\n        usedQuantity\n        service {\n          id\n          name\n        }\n      }\n    }\n  }\n": types.DogPackagesDocument,
    "\n  query Packages {\n    packages(activeOnly: true) {\n      id\n      name\n      description\n      price\n      type\n      validityDays\n      items {\n        id\n        quantity\n        service {\n          id\n          name\n        }\n      }\n    }\n  }\n": types.PackagesDocument,
    "\n  query QuoteReservation($input: CreateReservationInput!) {\n    quoteReservation(input: $input) {\n      subtotal\n      total\n      amountDue\n      coveredDates\n      warnings\n      service {\n        id\n        name\n        type\n        pricingUnit\n      }\n      dates {\n        date\n        basePrice\n        price\n        exception {\n          id\n          name\n          reason\n        }\n      }\n      addOns {\n        price\n        coveredByPackage\n        service {\n          id\n          name\n        }\n      }\n    }\n  }\n": types.QuoteReservationDocument,
    "\n  mutation CreateReservation($input: CreateReservationInput!) {\n    createReservation(input: $input) {\n      id\n      status\n      scheduledCheckIn\n      scheduledCheckOut\n      total\n      dog {\n        id\n        name\n      }\n    }\n  }\n": types.CreateReservationDocument,
    "\n  query Reservations($filter: ReservationFilter) {\n    reservations(filter: $filter, first: 25) {\n      id\n      status\n      scheduledCheckIn\n      scheduledCheckOut\n      total\n      dog {\n        id\n        name\n        imageUrl\n      }\n      items {\n        id\n        name\n        kind\n      }\n    }\n  }\n": types.ReservationsDocument,
    "\n  query Reservation($id: ID!) {\n    reservation(id: $id) {\n      id\n      status\n      scheduledCheckIn\n      scheduledCheckOut\n      actualCheckInAt\n      actualCheckOutAt\n      total\n      notes\n      createdAt\n      dog {\n        id\n        name\n        imageUrl\n        breed\n      }\n      items {\n        id\n        name\n        kind\n        quantity\n        unitPrice\n        totalPrice\n        sourceType\n      }\n      occupancy {\n        id\n        date\n        kind\n        sourceType\n      }\n      events {\n        id\n        type\n        occurredAt\n        notes\n      }\n    }\n  }\n": types.ReservationDocument,
    "\n  mutation CancelReservation($id: ID!, $reason: String) {\n    cancelReservation(id: $id, reason: $reason) {\n      id\n      status\n      total\n    }\n  }\n": types.CancelReservationDocument,
    "\n  query Services($type: ServiceType) {\n    services(type: $type, status: ACTIVE) {\n      id\n      name\n      description\n      type\n      category\n      price\n      currency\n      pricingUnit\n      durationMinutes\n      opensAtMinute\n      closesAtMinute\n      checkoutCutoffMinute\n      daysOfWeek\n      capacity\n    }\n  }\n": types.ServicesDocument,
    "\n  query ServiceAvailability($serviceId: ID!, $date: DateTime!) {\n    serviceAvailability(serviceId: $serviceId, date: $date) {\n      bookable\n      reason\n    }\n  }\n": types.ServiceAvailabilityDocument,
    "\n  query EffectivePriceRange($serviceId: ID!, $from: DateTime!, $to: DateTime!) {\n    effectivePriceRange(serviceId: $serviceId, from: $from, to: $to) {\n      date\n      basePrice\n      price\n      packagesAllowed\n      exception {\n        id\n        name\n        reason\n      }\n    }\n  }\n": types.EffectivePriceRangeDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      name\n      lastname\n      phone\n      gender\n      birthDate\n      emailVerifiedAt\n      status\n    }\n  }\n": types.MeDocument,
    "\n  query MyCompanies {\n    myCompanies {\n      id\n      name\n      logoUrl\n      slug\n      timezone\n      currency\n      cancellationWindowHours\n    }\n  }\n": types.MyCompaniesDocument,
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
export function graphql(source: "\n  query Dog($id: ID!) {\n    dog(id: $id) {\n      id\n      name\n      breed\n      birthDate\n      gender\n      color\n      size\n      weightKg\n      imageUrl\n      notes\n      contacts {\n        id\n        type\n        name\n        phone\n        email\n        relation\n        notes\n      }\n      primaryOwner {\n        id\n        name\n        lastname\n        email\n        phone\n      }\n    }\n  }\n"): (typeof documents)["\n  query Dog($id: ID!) {\n    dog(id: $id) {\n      id\n      name\n      breed\n      birthDate\n      gender\n      color\n      size\n      weightKg\n      imageUrl\n      notes\n      contacts {\n        id\n        type\n        name\n        phone\n        email\n        relation\n        notes\n      }\n      primaryOwner {\n        id\n        name\n        lastname\n        email\n        phone\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateDog($input: CreateDogInput!) {\n    createDog(input: $input) {\n      id\n      name\n      breed\n      imageUrl\n    }\n  }\n"): (typeof documents)["\n  mutation CreateDog($input: CreateDogInput!) {\n    createDog(input: $input) {\n      id\n      name\n      breed\n      imageUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateDog($id: ID!, $input: UpdateDogInput!) {\n    updateDog(id: $id, input: $input) {\n      id\n      name\n      breed\n      birthDate\n      gender\n      color\n      size\n      weightKg\n      imageUrl\n      notes\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateDog($id: ID!, $input: UpdateDogInput!) {\n    updateDog(id: $id, input: $input) {\n      id\n      name\n      breed\n      birthDate\n      gender\n      color\n      size\n      weightKg\n      imageUrl\n      notes\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UploadDogImage($id: ID!, $file: Upload!) {\n    uploadDogImage(id: $id, file: $file) {\n      id\n      imageUrl\n    }\n  }\n"): (typeof documents)["\n  mutation UploadDogImage($id: ID!, $file: Upload!) {\n    uploadDogImage(id: $id, file: $file) {\n      id\n      imageUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddDogContact($dogId: ID!, $input: DogContactInput!) {\n    addDogContact(dogId: $dogId, input: $input) {\n      id\n      type\n      name\n      phone\n      email\n      relation\n      notes\n    }\n  }\n"): (typeof documents)["\n  mutation AddDogContact($dogId: ID!, $input: DogContactInput!) {\n    addDogContact(dogId: $dogId, input: $input) {\n      id\n      type\n      name\n      phone\n      email\n      relation\n      notes\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveDogContact($id: ID!) {\n    removeDogContact(id: $id)\n  }\n"): (typeof documents)["\n  mutation RemoveDogContact($id: ID!) {\n    removeDogContact(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DogPackages($dogId: ID!) {\n    dogPackages(dogId: $dogId, activeOnly: true) {\n      id\n      status\n      purchaseDate\n      expiryDate\n      renewalDate\n      billingCycle\n      package {\n        id\n        name\n        type\n        validityDays\n      }\n      balances {\n        id\n        initialQuantity\n        remainingQuantity\n        usedQuantity\n        service {\n          id\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query DogPackages($dogId: ID!) {\n    dogPackages(dogId: $dogId, activeOnly: true) {\n      id\n      status\n      purchaseDate\n      expiryDate\n      renewalDate\n      billingCycle\n      package {\n        id\n        name\n        type\n        validityDays\n      }\n      balances {\n        id\n        initialQuantity\n        remainingQuantity\n        usedQuantity\n        service {\n          id\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Packages {\n    packages(activeOnly: true) {\n      id\n      name\n      description\n      price\n      type\n      validityDays\n      items {\n        id\n        quantity\n        service {\n          id\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Packages {\n    packages(activeOnly: true) {\n      id\n      name\n      description\n      price\n      type\n      validityDays\n      items {\n        id\n        quantity\n        service {\n          id\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query QuoteReservation($input: CreateReservationInput!) {\n    quoteReservation(input: $input) {\n      subtotal\n      total\n      amountDue\n      coveredDates\n      warnings\n      service {\n        id\n        name\n        type\n        pricingUnit\n      }\n      dates {\n        date\n        basePrice\n        price\n        exception {\n          id\n          name\n          reason\n        }\n      }\n      addOns {\n        price\n        coveredByPackage\n        service {\n          id\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query QuoteReservation($input: CreateReservationInput!) {\n    quoteReservation(input: $input) {\n      subtotal\n      total\n      amountDue\n      coveredDates\n      warnings\n      service {\n        id\n        name\n        type\n        pricingUnit\n      }\n      dates {\n        date\n        basePrice\n        price\n        exception {\n          id\n          name\n          reason\n        }\n      }\n      addOns {\n        price\n        coveredByPackage\n        service {\n          id\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateReservation($input: CreateReservationInput!) {\n    createReservation(input: $input) {\n      id\n      status\n      scheduledCheckIn\n      scheduledCheckOut\n      total\n      dog {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateReservation($input: CreateReservationInput!) {\n    createReservation(input: $input) {\n      id\n      status\n      scheduledCheckIn\n      scheduledCheckOut\n      total\n      dog {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Reservations($filter: ReservationFilter) {\n    reservations(filter: $filter, first: 25) {\n      id\n      status\n      scheduledCheckIn\n      scheduledCheckOut\n      total\n      dog {\n        id\n        name\n        imageUrl\n      }\n      items {\n        id\n        name\n        kind\n      }\n    }\n  }\n"): (typeof documents)["\n  query Reservations($filter: ReservationFilter) {\n    reservations(filter: $filter, first: 25) {\n      id\n      status\n      scheduledCheckIn\n      scheduledCheckOut\n      total\n      dog {\n        id\n        name\n        imageUrl\n      }\n      items {\n        id\n        name\n        kind\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Reservation($id: ID!) {\n    reservation(id: $id) {\n      id\n      status\n      scheduledCheckIn\n      scheduledCheckOut\n      actualCheckInAt\n      actualCheckOutAt\n      total\n      notes\n      createdAt\n      dog {\n        id\n        name\n        imageUrl\n        breed\n      }\n      items {\n        id\n        name\n        kind\n        quantity\n        unitPrice\n        totalPrice\n        sourceType\n      }\n      occupancy {\n        id\n        date\n        kind\n        sourceType\n      }\n      events {\n        id\n        type\n        occurredAt\n        notes\n      }\n    }\n  }\n"): (typeof documents)["\n  query Reservation($id: ID!) {\n    reservation(id: $id) {\n      id\n      status\n      scheduledCheckIn\n      scheduledCheckOut\n      actualCheckInAt\n      actualCheckOutAt\n      total\n      notes\n      createdAt\n      dog {\n        id\n        name\n        imageUrl\n        breed\n      }\n      items {\n        id\n        name\n        kind\n        quantity\n        unitPrice\n        totalPrice\n        sourceType\n      }\n      occupancy {\n        id\n        date\n        kind\n        sourceType\n      }\n      events {\n        id\n        type\n        occurredAt\n        notes\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CancelReservation($id: ID!, $reason: String) {\n    cancelReservation(id: $id, reason: $reason) {\n      id\n      status\n      total\n    }\n  }\n"): (typeof documents)["\n  mutation CancelReservation($id: ID!, $reason: String) {\n    cancelReservation(id: $id, reason: $reason) {\n      id\n      status\n      total\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Services($type: ServiceType) {\n    services(type: $type, status: ACTIVE) {\n      id\n      name\n      description\n      type\n      category\n      price\n      currency\n      pricingUnit\n      durationMinutes\n      opensAtMinute\n      closesAtMinute\n      checkoutCutoffMinute\n      daysOfWeek\n      capacity\n    }\n  }\n"): (typeof documents)["\n  query Services($type: ServiceType) {\n    services(type: $type, status: ACTIVE) {\n      id\n      name\n      description\n      type\n      category\n      price\n      currency\n      pricingUnit\n      durationMinutes\n      opensAtMinute\n      closesAtMinute\n      checkoutCutoffMinute\n      daysOfWeek\n      capacity\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ServiceAvailability($serviceId: ID!, $date: DateTime!) {\n    serviceAvailability(serviceId: $serviceId, date: $date) {\n      bookable\n      reason\n    }\n  }\n"): (typeof documents)["\n  query ServiceAvailability($serviceId: ID!, $date: DateTime!) {\n    serviceAvailability(serviceId: $serviceId, date: $date) {\n      bookable\n      reason\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EffectivePriceRange($serviceId: ID!, $from: DateTime!, $to: DateTime!) {\n    effectivePriceRange(serviceId: $serviceId, from: $from, to: $to) {\n      date\n      basePrice\n      price\n      packagesAllowed\n      exception {\n        id\n        name\n        reason\n      }\n    }\n  }\n"): (typeof documents)["\n  query EffectivePriceRange($serviceId: ID!, $from: DateTime!, $to: DateTime!) {\n    effectivePriceRange(serviceId: $serviceId, from: $from, to: $to) {\n      date\n      basePrice\n      price\n      packagesAllowed\n      exception {\n        id\n        name\n        reason\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      id\n      email\n      name\n      lastname\n      phone\n      gender\n      birthDate\n      emailVerifiedAt\n      status\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      id\n      email\n      name\n      lastname\n      phone\n      gender\n      birthDate\n      emailVerifiedAt\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MyCompanies {\n    myCompanies {\n      id\n      name\n      logoUrl\n      slug\n      timezone\n      currency\n      cancellationWindowHours\n    }\n  }\n"): (typeof documents)["\n  query MyCompanies {\n    myCompanies {\n      id\n      name\n      logoUrl\n      slug\n      timezone\n      currency\n      cancellationWindowHours\n    }\n  }\n"];
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