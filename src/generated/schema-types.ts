export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** ISO-8601 date and time. */
  DateTime: { input: string; output: string; }
  /**
   * A monetary amount as a fixed-point decimal string, e.g. "650.00".
   *
   * Never a JSON number. Doubles cannot represent decimal currency exactly, and
   * serialising as Float would undo at the last step the reason every monetary
   * column is Decimal in the database.
   */
  Money: { input: string; output: string; }
  /** File upload, used by the dog image mutations. */
  Upload: { input: File; output: File; }
};

export type Address = {
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  latitude?: Maybe<Scalars['String']['output']>;
  longitude?: Maybe<Scalars['String']['output']>;
  neighborhood?: Maybe<Scalars['String']['output']>;
  state: Scalars['String']['output'];
  streetOne: Scalars['String']['output'];
  streetTwo?: Maybe<Scalars['String']['output']>;
  zip: Scalars['String']['output'];
};

export type AddressInput = {
  city: Scalars['String']['input'];
  country?: InputMaybe<Scalars['String']['input']>;
  neighborhood?: InputMaybe<Scalars['String']['input']>;
  state: Scalars['String']['input'];
  streetOne: Scalars['String']['input'];
  streetTwo?: InputMaybe<Scalars['String']['input']>;
  zip: Scalars['String']['input'];
};

/** A qué aplicación vuelve el usuario desde un correo. */
export type AppAudience =
  /** App del negocio. */
  | 'BUSINESS'
  /** App de clientes finales. */
  | 'CLIENT';

export type AuthResponse = {
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type BillingCycle =
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'WEEKLY'
  | 'YEARLY';

export type ChangePasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type Company = {
  address?: Maybe<Address>;
  /**
   * Hours before arrival that a client may still cancel on their own. The app
   * needs it to say "hasta 24 horas antes" instead of guessing.
   */
  cancellationWindowHours: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  logoUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  slug?: Maybe<Scalars['String']['output']>;
  status: CompanyStatus;
  timezone: Scalars['String']['output'];
  uuid: Scalars['String']['output'];
};

export type CompanyMembership = {
  company: Company;
  id: Scalars['ID']['output'];
  joinedAt: Scalars['DateTime']['output'];
  role: MembershipRole;
  status: MembershipStatus;
  /** The member. Without this, companyMembers returns roles nobody can attribute. */
  user: User;
};

export type CompanyStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'PENDING'
  | 'SUSPENDED';

export type ConfirmPasswordResetInput = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type ContactType =
  | 'AUTHORIZED_PICKUP'
  | 'EMERGENCY'
  | 'VETERINARIAN';

export type CreateCompanyInput = {
  address?: InputMaybe<AddressInput>;
  currency?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  slug?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
};

export type CreateDogInput = {
  birthDate?: InputMaybe<Scalars['DateTime']['input']>;
  breed?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  contacts?: InputMaybe<Array<DogContactInput>>;
  gender?: InputMaybe<Gender>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  /**
   * Owner of the dog. Staff omit it to register a dog for the client they are
   * serving; a client creating their own dog always becomes the owner regardless
   * of what is sent.
   */
  ownerUserId?: InputMaybe<Scalars['ID']['input']>;
  size: DogSize;
  /** Decimal string, e.g. "18.40". */
  weightKg?: InputMaybe<Scalars['String']['input']>;
};

export type CreateLeadInput = {
  email: Scalars['String']['input'];
  howManyDogs?: InputMaybe<Scalars['Int']['input']>;
  phone: Scalars['String']['input'];
  source?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePackageInput = {
  /** Required for SUBSCRIPTION, forbidden otherwise. */
  billingCycle?: InputMaybe<BillingCycle>;
  description?: InputMaybe<Scalars['String']['input']>;
  items: Array<PackageItemInput>;
  name: Scalars['String']['input'];
  price: Scalars['Money']['input'];
  type?: InputMaybe<PackageType>;
  /**
   * Required for UNLIMITED and whenever any item is unlimited (subscriptions are
   * bounded by their cycle instead).
   */
  validityDays?: InputMaybe<Scalars['Int']['input']>;
};

export type CreatePriceExceptionInput = {
  blockPackageUse?: InputMaybe<Scalars['Boolean']['input']>;
  daysMask?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate: Scalars['DateTime']['input'];
  isRecurring?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  priority?: InputMaybe<Scalars['Int']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  requireFullPrice?: InputMaybe<Scalars['Boolean']['input']>;
  serviceId: Scalars['ID']['input'];
  specialPrice: Scalars['Money']['input'];
  startDate: Scalars['DateTime']['input'];
};

export type CreateReservationInput = {
  addOnServiceIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  dogId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  scheduledCheckIn: Scalars['DateTime']['input'];
  /** Required for HOTEL: a stay must contain at least one night. */
  scheduledCheckOut?: InputMaybe<Scalars['DateTime']['input']>;
  serviceId: Scalars['ID']['input'];
};

export type CreateServiceInput = {
  capacity?: InputMaybe<Scalars['Int']['input']>;
  category?: InputMaybe<ServiceCategory>;
  checkoutCutoffMinute?: InputMaybe<Scalars['Int']['input']>;
  closesAtMinute?: InputMaybe<Scalars['Int']['input']>;
  daysMask?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  durationMinutes: Scalars['Int']['input'];
  lateCheckoutServiceId?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  opensAtMinute?: InputMaybe<Scalars['Int']['input']>;
  price: Scalars['Money']['input'];
  pricingUnit?: InputMaybe<PricingUnit>;
  type: ServiceType;
};

export type CreateUserInput = {
  /** Which app the signup came from. Decides where the verification email points. */
  app?: InputMaybe<AppAudience>;
  birthDate?: InputMaybe<Scalars['DateTime']['input']>;
  /**
   * Links the account as a CLIENT of the business with that slug, in the same
   * transaction that creates the user. Omitting it creates an account with no
   * company — which is how a business owner signs up before `createCompany`.
   *
   * It can only ever produce a CLIENT membership. No public input decides a role.
   */
  companySlug?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  gender?: InputMaybe<Gender>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type CreatedUser = {
  tokens: AuthResponse;
  user: User;
};

export type DayOfWeek =
  | 'FRIDAY'
  | 'MONDAY'
  | 'SATURDAY'
  | 'SUNDAY'
  | 'THURSDAY'
  | 'TUESDAY'
  | 'WEDNESDAY';

export type Dog = {
  birthDate?: Maybe<Scalars['DateTime']['output']>;
  breed?: Maybe<Scalars['String']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  /** This dog's relationship with the active company. */
  companyProfile?: Maybe<DogCompanyProfile>;
  contacts: Array<DogContact>;
  createdAt: Scalars['DateTime']['output'];
  gender?: Maybe<Gender>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  /** Operational notes. Structured facts belong in their own fields. */
  notes?: Maybe<Scalars['String']['output']>;
  owners: Array<DogOwnership>;
  primaryOwner?: Maybe<User>;
  size: DogSize;
  /** Kilograms, as a decimal string. */
  weightKg?: Maybe<Scalars['String']['output']>;
};

export type DogBalance = {
  amount: Scalars['Money']['output'];
  dog: Dog;
  reservations: Scalars['Int']['output'];
};

/** Per-business record: when the dog first came, and notes only this company sees. */
export type DogCompanyProfile = {
  active: Scalars['Boolean']['output'];
  firstVisitAt: Scalars['DateTime']['output'];
  lastVisitAt?: Maybe<Scalars['DateTime']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
};

export type DogContact = {
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  phone: Scalars['String']['output'];
  relation?: Maybe<Scalars['String']['output']>;
  type: ContactType;
};

export type DogContactInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  phone: Scalars['String']['input'];
  relation?: InputMaybe<Scalars['String']['input']>;
  type: ContactType;
};

export type DogOwnership = {
  isPrimary: Scalars['Boolean']['output'];
  user: User;
};

/** One purchased package, belonging to one dog. */
export type DogPackage = {
  /** One per included service, so it inherits the bound on Package.items. */
  balances: Array<DogPackageBalance>;
  billingCycle?: Maybe<BillingCycle>;
  cancellationReason?: Maybe<Scalars['String']['output']>;
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  dog: Dog;
  expiryDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  package: Package;
  purchaseDate: Scalars['DateTime']['output'];
  /** When the next cycle is due. Only on subscriptions. */
  renewalDate?: Maybe<Scalars['DateTime']['output']>;
  /**
   * Renewal chain. Renewing creates a NEW DogPackage rather than resetting
   * balances, so every cycle keeps its own ledger.
   */
  renewedFrom?: Maybe<DogPackage>;
  renewedTo?: Maybe<DogPackage>;
  status: DogPackageStatus;
};

export type DogPackageBalance = {
  /**
   * Copied from the template at purchase time, so editing the package later never
   * changes the terms of one already sold.
   */
  daysMask: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  /** Null means unlimited. */
  initialQuantity?: Maybe<Scalars['Int']['output']>;
  /** Every movement, with who made it and why. */
  ledger: Array<PackageLedgerEntry>;
  /** Derived: initialQuantity - usedQuantity. Null when unlimited. */
  remainingQuantity?: Maybe<Scalars['Int']['output']>;
  service: Service;
  usedQuantity: Scalars['Int']['output'];
};

export type DogPackageStatus =
  | 'ACTIVE'
  | 'CANCELLED'
  | 'DEPLETED'
  | 'EXPIRED';

export type DogSize =
  | 'GIGANTIC'
  | 'LARGE'
  | 'MEDIUM'
  | 'SMALL'
  | 'TOY';

/**
 * What a service costs on a date, after exceptions.
 *
 * `basePrice` is the list price and `price` is what will be charged; when they
 * differ, `exception` says why.
 */
export type EffectivePrice = {
  basePrice: Scalars['Money']['output'];
  date: Scalars['DateTime']['output'];
  /** False when the winning exception forbids discounts on this date. */
  discountsAllowed: Scalars['Boolean']['output'];
  exception?: Maybe<ServicePriceException>;
  /** False when the winning exception blocks package balances on this date. */
  packagesAllowed: Scalars['Boolean']['output'];
  price: Scalars['Money']['output'];
};

/** Biological sex, as recorded for a person or a dog. */
export type Gender =
  | 'FEMALE'
  | 'MALE'
  | 'OTHER';

export type GuestStats = {
  arrivingToday: Scalars['Int']['output'];
  checkedInNow: Scalars['Int']['output'];
  departingToday: Scalars['Int']['output'];
  newDogsThisMonth: Scalars['Int']['output'];
  totalDogs: Scalars['Int']['output'];
};

/**
 * Invites a person to the active company.
 *
 * Replaces `addEmployee`, which created a user with `role: "ADMIN"` hardcoded and
 * no way to express any other relationship. The role is now explicit and the
 * membership is a row that can be revoked without touching the user.
 */
export type InviteMemberInput = {
  email: Scalars['String']['input'];
  lastname?: InputMaybe<Scalars['String']['input']>;
  /** Only used when the email does not already belong to an account. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Temporary password for a newly created account. Ignored for existing users. */
  password?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  role: MembershipRole;
};

export type InviteMemberPayload = {
  membership: CompanyMembership;
  user: User;
  /** True when a new account was created rather than an existing one linked. */
  userCreated: Scalars['Boolean']['output'];
};

export type LedgerReason =
  | 'EXPIRY_WRITEOFF'
  | 'MANUAL_ADJUSTMENT'
  | 'PACKAGE_CANCELLED'
  | 'RESERVATION_BOOKED'
  | 'RESERVATION_CANCELLED';

export type LogoutResponse = {
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

/**
 * Roles a user may hold within one company. Mirrors the Prisma enum.
 * A user holds these per company, not globally.
 */
export type MembershipRole =
  | 'ADMIN'
  | 'CLIENT'
  | 'OWNER'
  | 'STAFF';

export type MembershipStatus =
  | 'ACTIVE'
  | 'REVOKED'
  | 'SUSPENDED';

export type Mutation = {
  _empty?: Maybe<Scalars['String']['output']>;
  addDogContact: DogContact;
  /** Manual correction. Always recorded in the ledger with who made it. */
  adjustBalance: DogPackageBalance;
  /** Soft delete. Reservation history is preserved. */
  archiveDog: Dog;
  /** Soft delete. Past reservations keep their price snapshots. */
  archiveService: Service;
  cancelDogPackage: DogPackage;
  /**
   * Frees the dates and voids the charges. Never deletes billing history.
   *
   * A client may cancel their OWN reservation, while it is still PENDING and
   * before the company's cancellation window closes; `reason` is required for
   * them. Staff cancel anything, at any time, with the customer in front of
   * them — that conversation already happened.
   */
  cancelReservation: Reservation;
  changeMemberRole: CompanyMembership;
  changePassword: Scalars['Boolean']['output'];
  /**
   * Records the arrival. The hour is judged HERE, not at booking: until the dog
   * turns up nobody knows when that was. An arrival outside opening hours is
   * never refused — it is recorded on the event log. `at` is for registering a
   * drop-off that happened earlier.
   */
  checkInReservation: Reservation;
  /**
   * Records the departure and, past the service's cutoff, bills a late-checkout
   * day. Evaluated here rather than at booking because until now nobody knew when
   * the dog would actually leave.
   */
  checkOutReservation: Reservation;
  /** Resets the password and invalidates every existing session for that user. */
  confirmPasswordReset: Scalars['Boolean']['output'];
  /**
   * Registers a business and makes the caller its OWNER.
   *
   * Available to any authenticated user with no company yet — this is how a new
   * business onboards. It replaces createCompanyWithOwner, which created the
   * owner account too and could be called by anyone.
   */
  createCompany: Company;
  createDog: Dog;
  /** Captures a marketing lead from the public site. */
  createLead: Scalars['Boolean']['output'];
  createPackage: Package;
  createPriceException: ServicePriceException;
  createReservation: Reservation;
  createService: Service;
  /** Public signup. Creates an account with no company membership. */
  createUser: CreatedUser;
  deactivatePackage: Package;
  deletePriceException: Scalars['Boolean']['output'];
  inviteMember: InviteMemberPayload;
  /**
   * Links the authenticated user as a CLIENT of the business with that slug.
   *
   * Idempotent: if they are already a client there it returns the existing
   * membership instead of failing — retrying is not an error. A revoked
   * membership is reactivated, so its history stays attached to the same row.
   *
   * `@auth` with no `requires`: the caller has no role in that company yet, which
   * is the whole point.
   */
  joinCompany: CompanyMembership;
  /** Ends every session on every device. */
  logoutAllSessions: LogoutResponse;
  /**
   * Ends the session on THIS device.
   *
   * With a cookie it destroys the session; with a bearer token it revokes the
   * refresh token presented. Sending both is valid and is what a client that
   * supports both does. Previously this required an express session, so a
   * bearer-only client could never sign out.
   */
  logoutUser: LogoutResponse;
  /**
   * Records that payment was taken outside the platform (the business's card
   * terminal or cash). The platform processes no money; `method` and `reference`
   * (e.g. the terminal's approval code) go to the PAYMENT_RECORDED event so the
   * reservation can be matched against the terminal's settlement report.
   */
  markReservationPaid: Reservation;
  /** Sells a package to a dog. Payment, package and balances in one transaction. */
  purchasePackage: DogPackage;
  /** Exchanges a refresh token for a new pair. The presented token is revoked. */
  refreshSession: AuthResponse;
  removeDogContact: Scalars['Boolean']['output'];
  /**
   * Renews a purchased package by creating a NEW DogPackage linked to the one it
   * replaces. Balances are never reset: each cycle keeps its own ledger. By
   * default the new cycle starts when the old one ends (or now, if it already
   * ended); startDate overrides that for a renewal agreed on a different date.
   */
  renewDogPackage: DogPackage;
  requestPasswordReset: Scalars['Boolean']['output'];
  /** Revokes a membership. The user account itself is untouched. */
  revokeMembership: CompanyMembership;
  signUser: AuthResponse;
  updateCompany: Company;
  updateDog: Dog;
  /** Per-business notes. Never visible to another company boarding the same dog. */
  updateDogCompanyNotes: Dog;
  updatePriceException: ServicePriceException;
  updateService: Service;
  updateUser: User;
  uploadDogImage: Dog;
  verifyEmail: AuthResponse;
};


export type MutationAddDogContactArgs = {
  dogId: Scalars['ID']['input'];
  input: DogContactInput;
};


export type MutationAdjustBalanceArgs = {
  balanceId: Scalars['ID']['input'];
  delta: Scalars['Int']['input'];
  notes: Scalars['String']['input'];
};


export type MutationArchiveDogArgs = {
  id: Scalars['ID']['input'];
};


export type MutationArchiveServiceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelDogPackageArgs = {
  id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCancelReservationArgs = {
  id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationChangeMemberRoleArgs = {
  from: MembershipRole;
  to: MembershipRole;
  userId: Scalars['ID']['input'];
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationCheckInReservationArgs = {
  at?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['ID']['input'];
};


export type MutationCheckOutReservationArgs = {
  at?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['ID']['input'];
};


export type MutationConfirmPasswordResetArgs = {
  input: ConfirmPasswordResetInput;
};


export type MutationCreateCompanyArgs = {
  input: CreateCompanyInput;
};


export type MutationCreateDogArgs = {
  input: CreateDogInput;
};


export type MutationCreateLeadArgs = {
  input: CreateLeadInput;
};


export type MutationCreatePackageArgs = {
  input: CreatePackageInput;
};


export type MutationCreatePriceExceptionArgs = {
  input: CreatePriceExceptionInput;
};


export type MutationCreateReservationArgs = {
  input: CreateReservationInput;
};


export type MutationCreateServiceArgs = {
  input: CreateServiceInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeactivatePackageArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePriceExceptionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationInviteMemberArgs = {
  input: InviteMemberInput;
};


export type MutationJoinCompanyArgs = {
  slug: Scalars['String']['input'];
};


export type MutationLogoutUserArgs = {
  refreshToken?: InputMaybe<Scalars['String']['input']>;
};


export type MutationMarkReservationPaidArgs = {
  id: Scalars['ID']['input'];
  method?: InputMaybe<Scalars['String']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
};


export type MutationPurchasePackageArgs = {
  input: PurchasePackageInput;
};


export type MutationRefreshSessionArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRemoveDogContactArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRenewDogPackageArgs = {
  id: Scalars['ID']['input'];
  markPaid?: InputMaybe<Scalars['Boolean']['input']>;
  paymentMethod?: InputMaybe<PaymentMethod>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type MutationRequestPasswordResetArgs = {
  input: RequestPasswordResetInput;
};


export type MutationRevokeMembershipArgs = {
  role: MembershipRole;
  userId: Scalars['ID']['input'];
};


export type MutationSignUserArgs = {
  input: SignInUserInput;
};


export type MutationUpdateCompanyArgs = {
  input: UpdateCompanyInput;
};


export type MutationUpdateDogArgs = {
  id: Scalars['ID']['input'];
  input: UpdateDogInput;
};


export type MutationUpdateDogCompanyNotesArgs = {
  id: Scalars['ID']['input'];
  notes: Scalars['String']['input'];
};


export type MutationUpdatePriceExceptionArgs = {
  id: Scalars['ID']['input'];
  input: UpdatePriceExceptionInput;
};


export type MutationUpdateServiceArgs = {
  id: Scalars['ID']['input'];
  input: UpdateServiceInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUploadDogImageArgs = {
  file: Scalars['Upload']['input'];
  id: Scalars['ID']['input'];
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String']['input'];
};

/** How full a service is on a date. Drives the availability calendar. */
export type OccupancyCount = {
  booked: Scalars['Int']['output'];
  capacity?: Maybe<Scalars['Int']['output']>;
  date: Scalars['DateTime']['output'];
};

export type OccupancyKind =
  /** A dated day of attendance: daycare, or a billed late-checkout day. */
  | 'DAY'
  /** An overnight stay. The departure date is not a NIGHT. */
  | 'NIGHT';

export type OccupancySourceType =
  | 'DIRECT'
  | 'EXCEPTION'
  | 'PACKAGE'
  | 'PACKAGE_WITH_EXCEPTION';

export type Package = {
  active: Scalars['Boolean']['output'];
  /** Only on SUBSCRIPTION packages. Each renewal creates a new DogPackage. */
  billingCycle?: Maybe<BillingCycle>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** The services it includes. Bounded by the domain: a handful per package. */
  items: Array<PackageItem>;
  name: Scalars['String']['output'];
  price: Scalars['Money']['output'];
  type: PackageType;
  /** Days of validity from purchase. Null means it never expires. */
  validityDays?: Maybe<Scalars['Int']['output']>;
};

export type PackageItem = {
  /** Days of the week this service is covered. 7-bit mask, bit 0 = Sunday. */
  daysMask: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  /**
   * Null means unlimited. Per item, so one package can mix a fixed allowance of
   * one service with unlimited use of another.
   */
  quantity?: Maybe<Scalars['Int']['output']>;
  service: Service;
};

export type PackageItemInput = {
  /** 7-bit mask, bit 0 = Sunday. Defaults to 127 (every day). */
  daysMask?: InputMaybe<Scalars['Int']['input']>;
  /** Omit for unlimited. Per item: fixed and unlimited services can coexist. */
  quantity?: InputMaybe<Scalars['Int']['input']>;
  serviceId: Scalars['ID']['input'];
};

/**
 * Append-only record of balance movements. Without it, usedQuantity is a number
 * nobody can explain.
 */
export type PackageLedgerEntry = {
  actor?: Maybe<User>;
  createdAt: Scalars['DateTime']['output'];
  /** Negative when consumed, positive when returned. */
  delta: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  reason: LedgerReason;
};

export type PackageType =
  /** Fixed number of sessions. Balances track what remains. */
  | 'QUANTITY'
  /** Recurring. Renews on a billing cycle. */
  | 'SUBSCRIPTION'
  /** Unlimited use within the validity window. Usage is recorded, never blocked. */
  | 'UNLIMITED';

export type PaymentMethod =
  | 'CARD'
  | 'CASH'
  | 'OTHER'
  | 'TRANSFER';

export type PaymentStatus =
  | 'PAID'
  | 'PARTIALLY_PAID'
  | 'REFUNDED'
  | 'UNPAID';

export type PricingUnit =
  | 'DAILY'
  | 'HOURLY'
  | 'NIGHTLY'
  | 'PACKAGE'
  | 'SESSION';

/**
 * Public face of a business: the minimum for someone to confirm they are
 * signing up at the right place.
 *
 * Deliberately NOT `Company`. That type carries email, phone, status and
 * address; returning it from a `@public` field would hand the business's whole
 * record to anyone who guesses a slug.
 */
export type PublicCompany = {
  id: Scalars['ID']['output'];
  logoUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
};

export type PurchasePackageInput = {
  dogId: Scalars['ID']['input'];
  /** Marks the transaction COMPLETED. Otherwise it stays PENDING. */
  markPaid?: InputMaybe<Scalars['Boolean']['input']>;
  packageId: Scalars['ID']['input'];
  paymentMethod?: InputMaybe<PaymentMethod>;
};

export type Query = {
  _empty?: Maybe<Scalars['String']['output']>;
  /**
   * A business by slug, for the client signup screen. Null when it does not
   * exist or is not active — a 404 and a null carry the same information, and
   * the null spares the caller from telling them apart.
   */
  companyBySlug?: Maybe<PublicCompany>;
  /**
   * Customers of the active company. Staff-only: this is the client list.
   * Replaces `companyDogOwners`, which took companyId as an argument and
   * verified nothing.
   */
  companyClients: Array<User>;
  /** Members of the active company, optionally filtered by role. */
  companyMembers: Array<CompanyMembership>;
  /** Staff of the active company. */
  companyStaff: Array<User>;
  /**
   * Which balance, if any, would cover this service on this date. Answers "is
   * this night already paid for" before booking.
   */
  coveringBalance?: Maybe<DogPackageBalance>;
  dog?: Maybe<Dog>;
  /** Packages a dog holds. Clients may only ask about their own dogs. */
  dogPackages: Array<DogPackage>;
  /**
   * Dogs of the active company. Staff see all of them; a client sees only their
   * own, so the same field is safe for both audiences.
   */
  dogs: Array<Dog>;
  /** What a service costs on one date, after price exceptions. */
  effectivePrice: EffectivePrice;
  /** What each date in a range costs. Use this to quote a stay. */
  effectivePriceRange: Array<EffectivePrice>;
  guestStats: GuestStats;
  /** The authenticated user. */
  me?: Maybe<User>;
  /** Every company the caller is a member of, for a company switcher. */
  myCompanies: Array<Company>;
  /** The company this request is scoped to. */
  myCompany?: Maybe<Company>;
  /** Dogs owned by the authenticated user. */
  myDogs: Array<Dog>;
  /** How full a service is across a range. */
  occupancy: Array<OccupancyCount>;
  package?: Maybe<Package>;
  /** Packages the active company sells. */
  packages: Array<Package>;
  /** What each dog still owes, largest first. */
  pendingPayments: Array<DogBalance>;
  priceExceptions: Array<ServicePriceException>;
  /** Price a booking before making it. Runs every validation the real one does. */
  quoteReservation: ReservationQuote;
  reservation?: Maybe<Reservation>;
  /**
   * Reservations of the active company. Staff see all of them; a client sees only
   * their own dogs', so the same field serves both.
   */
  reservations: Array<Reservation>;
  /** Arrivals and departures for a date. The daily operations board. */
  reservationsOn: Array<Reservation>;
  revenueStats: RevenueStats;
  service?: Maybe<Service>;
  /** Whether a service runs at all on a date. Availability, not price. */
  serviceAvailability: ServiceAvailability;
  /** Services offered by the active company. */
  services: Array<Service>;
};


export type QueryCompanyBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryCompanyClientsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCompanyMembersArgs = {
  role?: InputMaybe<MembershipRole>;
};


export type QueryCoveringBalanceArgs = {
  date: Scalars['DateTime']['input'];
  dogId: Scalars['ID']['input'];
  serviceId: Scalars['ID']['input'];
};


export type QueryDogArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDogPackagesArgs = {
  activeOnly?: InputMaybe<Scalars['Boolean']['input']>;
  dogId: Scalars['ID']['input'];
};


export type QueryDogsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryEffectivePriceArgs = {
  date: Scalars['DateTime']['input'];
  serviceId: Scalars['ID']['input'];
};


export type QueryEffectivePriceRangeArgs = {
  from: Scalars['DateTime']['input'];
  serviceId: Scalars['ID']['input'];
  to: Scalars['DateTime']['input'];
};


export type QueryGuestStatsArgs = {
  date?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryOccupancyArgs = {
  from: Scalars['DateTime']['input'];
  serviceId: Scalars['ID']['input'];
  to: Scalars['DateTime']['input'];
};


export type QueryPackageArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPackagesArgs = {
  activeOnly?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryPriceExceptionsArgs = {
  activeOnly?: InputMaybe<Scalars['Boolean']['input']>;
  serviceId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryQuoteReservationArgs = {
  input: CreateReservationInput;
};


export type QueryReservationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryReservationsArgs = {
  filter?: InputMaybe<ReservationFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryReservationsOnArgs = {
  date: Scalars['DateTime']['input'];
};


export type QueryRevenueStatsArgs = {
  date?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryServiceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryServiceAvailabilityArgs = {
  date: Scalars['DateTime']['input'];
  serviceId: Scalars['ID']['input'];
};


export type QueryServicesArgs = {
  status?: InputMaybe<ServiceStatus>;
  type?: InputMaybe<ServiceType>;
};

export type QuotedAddOn = {
  /** True when a package balance covers this add-on and it is billed at zero. */
  coveredByPackage: Scalars['Boolean']['output'];
  price: Scalars['Money']['output'];
  service: Service;
};

export type RequestPasswordResetInput = {
  /** Defaults to BUSINESS, which is the previous behaviour. */
  app?: InputMaybe<AppAudience>;
  email: Scalars['String']['input'];
};

export type Reservation = {
  /** What actually happened. These settle a billing dispute. */
  actualCheckInAt?: Maybe<Scalars['DateTime']['output']>;
  actualCheckOutAt?: Maybe<Scalars['DateTime']['output']>;
  checkedInBy?: Maybe<User>;
  checkedOutBy?: Maybe<User>;
  createdAt: Scalars['DateTime']['output'];
  dog: Dog;
  /** Append-only history: who checked the dog in, who cancelled, when. */
  events: Array<ReservationEvent>;
  id: Scalars['ID']['output'];
  /** Charge lines. Voided lines are excluded unless includeVoided is set. */
  items: Array<ReservationItem>;
  notes?: Maybe<Scalars['String']['output']>;
  /** Dates this reservation occupies. */
  occupancy: Array<ReservationOccupancy>;
  paymentStatus: PaymentStatus;
  /** What the customer booked. */
  scheduledCheckIn: Scalars['DateTime']['output'];
  scheduledCheckOut?: Maybe<Scalars['DateTime']['output']>;
  status: ReservationStatus;
  /** Sum of non-voided lines. */
  total: Scalars['Money']['output'];
};


export type ReservationItemsArgs = {
  includeVoided?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ReservationEvent = {
  actor?: Maybe<User>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  occurredAt: Scalars['DateTime']['output'];
  type: ReservationEventType;
};

export type ReservationEventType =
  | 'CANCELLED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'COMPLETED'
  | 'CREATED'
  | 'ITEM_ADDED'
  | 'ITEM_VOIDED'
  | 'NOTE_ADDED'
  | 'NO_SHOW'
  | 'PAYMENT_RECORDED'
  | 'REFUND_ISSUED'
  | 'UPDATED';

export type ReservationFilter = {
  dogId?: InputMaybe<Scalars['ID']['input']>;
  from?: InputMaybe<Scalars['DateTime']['input']>;
  serviceId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<ReservationStatus>;
  to?: InputMaybe<Scalars['DateTime']['input']>;
};

export type ReservationItem = {
  currency: Scalars['String']['output'];
  discountReason?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  kind: ReservationItemKind;
  /** Snapshot of the service name at the time of sale. */
  name: Scalars['String']['output'];
  /** The date this line pays for. Null for add-ons, fees and discounts. */
  occupancy?: Maybe<ReservationOccupancy>;
  quantity: Scalars['Int']['output'];
  service?: Maybe<Service>;
  sourceType: ReservationItemSourceType;
  totalPrice: Scalars['Money']['output'];
  unitPrice: Scalars['Money']['output'];
  voidedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ReservationItemKind =
  | 'ADDON'
  | 'DISCOUNT'
  | 'FEE'
  | 'MAIN';

export type ReservationItemSourceType =
  | 'DIRECT'
  | 'EXCEPTION'
  | 'PACKAGE';

export type ReservationOccupancy = {
  date: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  /** The charge for this date, if there is one. */
  item?: Maybe<ReservationItem>;
  kind: OccupancyKind;
  priceException?: Maybe<ServicePriceException>;
  service: Service;
  sourceType: OccupancySourceType;
};

/**
 * What a booking would cost, priced exactly as it will be billed — the same code
 * path, so the quote cannot drift from the invoice.
 */
export type ReservationQuote = {
  addOns: Array<QuotedAddOn>;
  /**
   * What the customer actually pays after package coverage. A stay can mix both:
   * nights inside the package's covered days come from the balance, the rest are
   * billed cash.
   */
  amountDue: Scalars['Money']['output'];
  /** Dates a package balance will cover, decided per date at booking. */
  coveredDates: Array<Scalars['DateTime']['output']>;
  /** One entry per occupied date, with the exception that applied, if any. */
  dates: Array<EffectivePrice>;
  service: Service;
  subtotal: Scalars['Money']['output'];
  /** Everything, priced as if no package existed. */
  total: Scalars['Money']['output'];
  /** Conditions accepted rather than refused, surfaced for staff to see. */
  warnings: Array<Scalars['String']['output']>;
};

export type ReservationStatus =
  | 'CANCELLED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'COMPLETED'
  | 'NO_SHOW'
  | 'PENDING';

export type RevenueByServiceType = {
  amount: Scalars['Money']['output'];
  serviceType: Scalars['String']['output'];
};

export type RevenueStats = {
  byServiceType: Array<RevenueByServiceType>;
  paid: Scalars['Money']['output'];
  /** Owed from before today. What the front desk should be chasing. */
  previousUnpaid: Scalars['Money']['output'];
  total: Scalars['Money']['output'];
  unpaid: Scalars['Money']['output'];
};

export type Service = {
  /** Maximum dogs on a single date. Null means unlimited. */
  capacity?: Maybe<Scalars['Int']['output']>;
  category: ServiceCategory;
  /** HOTEL only. Minute of day for free collection on the departure day. */
  checkoutCutoffMinute?: Maybe<Scalars['Int']['output']>;
  closesAtMinute: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** Inherited from the company. Services do not price in mixed currencies. */
  currency: Scalars['String']['output'];
  /** 7-bit mask. Bit 0 = Sunday. 127 = every day. */
  daysMask: Scalars['Int']['output'];
  /** Days this service runs, expanded from daysMask for convenience. */
  daysOfWeek: Array<DayOfWeek>;
  description?: Maybe<Scalars['String']['output']>;
  durationMinutes: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  /**
   * What is billed when a dog is collected after the cutoff — normally the
   * daycare service. Because it is an ordinary service line, package coverage and
   * price exceptions apply to it automatically.
   */
  lateCheckoutService?: Maybe<Service>;
  name: Scalars['String']['output'];
  /** Minutes from midnight in the company's timezone. 480 = 08:00. */
  opensAtMinute: Scalars['Int']['output'];
  price: Scalars['Money']['output'];
  priceExceptions: Array<ServicePriceException>;
  pricingUnit: PricingUnit;
  status: ServiceStatus;
  type: ServiceType;
};

export type ServiceAvailability = {
  bookable: Scalars['Boolean']['output'];
  reason?: Maybe<Scalars['String']['output']>;
};

export type ServiceCategory =
  /** An extra billed alongside a MAIN item: swimming, extra playtime. */
  | 'ADDON'
  /** A primary service: a stay, a day of daycare, a grooming session. */
  | 'MAIN';

export type ServicePriceException = {
  active: Scalars['Boolean']['output'];
  /** When true, package balances may not be spent on these dates. */
  blockPackageUse: Scalars['Boolean']['output'];
  daysMask: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  endDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  /**
   * When true, startDate and endDate bound the SEASON within which daysMask
   * repeats — so "weekend surcharge, all of 2026" is one row, not 104.
   */
  isRecurring: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  /** Highest wins when two exceptions overlap. Ties break on most recent. */
  priority: Scalars['Int']['output'];
  /** Short machine-readable motive: HIGH_SEASON, HOLIDAY, WEEKEND. */
  reason?: Maybe<Scalars['String']['output']>;
  /** When true, no discount line may be applied on these dates. */
  requireFullPrice: Scalars['Boolean']['output'];
  service: Service;
  specialPrice: Scalars['Money']['output'];
  startDate: Scalars['DateTime']['output'];
};

export type ServiceStatus =
  | 'ACTIVE'
  | 'ARCHIVED'
  | 'INACTIVE';

export type ServiceType =
  | 'DAYCARE'
  | 'GROOMING'
  | 'HOTEL'
  | 'TRAINING';

export type SignInUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type UpdateCompanyInput = {
  address?: InputMaybe<AddressInput>;
  email?: InputMaybe<Scalars['String']['input']>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateDogInput = {
  birthDate?: InputMaybe<Scalars['DateTime']['input']>;
  breed?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Gender>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<DogSize>;
  weightKg?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePriceExceptionInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  blockPackageUse?: InputMaybe<Scalars['Boolean']['input']>;
  daysMask?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  isRecurring?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  requireFullPrice?: InputMaybe<Scalars['Boolean']['input']>;
  specialPrice?: InputMaybe<Scalars['Money']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdateServiceInput = {
  capacity?: InputMaybe<Scalars['Int']['input']>;
  checkoutCutoffMinute?: InputMaybe<Scalars['Int']['input']>;
  closesAtMinute?: InputMaybe<Scalars['Int']['input']>;
  daysMask?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  durationMinutes?: InputMaybe<Scalars['Int']['input']>;
  lateCheckoutServiceId?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  opensAtMinute?: InputMaybe<Scalars['Int']['input']>;
  price?: InputMaybe<Scalars['Money']['input']>;
  pricingUnit?: InputMaybe<PricingUnit>;
  status?: InputMaybe<ServiceStatus>;
};

/**
 * Self-service profile edits only.
 *
 * `companyId` and `clientOfId` used to be accepted here, which let any user
 * attach themselves to any company — privilege escalation in one mutation.
 * Membership changes now go through inviteMember / revokeMembership, which are
 * role-gated. `password` is not here either: changing it requires the current
 * password, so it has its own mutation.
 */
export type UpdateUserInput = {
  birthDate?: InputMaybe<Scalars['DateTime']['input']>;
  gender?: InputMaybe<Gender>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  birthDate?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** Dogs this user owns. */
  dogs: Array<Dog>;
  email: Scalars['String']['output'];
  emailVerifiedAt?: Maybe<Scalars['DateTime']['output']>;
  gender?: Maybe<Gender>;
  id: Scalars['ID']['output'];
  lastname?: Maybe<Scalars['String']['output']>;
  /** Memberships visible to the caller, scoped to their company. */
  memberships: Array<CompanyMembership>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  status: UserStatus;
};

/** Lifecycle of a user account, independent of any company membership. */
export type UserStatus =
  | 'ACTIVE'
  | 'BLOCKED'
  | 'DELETED'
  | 'INACTIVE'
  /** Registered but email not yet verified. */
  | 'INCOMPLETE';
