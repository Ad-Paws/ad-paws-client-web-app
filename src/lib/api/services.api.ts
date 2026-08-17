// ⚠️ Documentos del backend ANTERIOR: firmas y campos ya no existen en el
// schema actual. Se migran a `src/graphql/` con el helper `graphql()` en
// F3–F6 — ver el plan, §6.1 (mapa de operaciones).
import { gql } from "@apollo/client";

export const SERVICES_BY_COMPANY = gql`
  query ServicesByCompany($input: ServicesByCompanyInput) {
    servicesByCompany(input: $input) {
      id
      name
      type
      category
      price
      pricingUnit
      duration
      startTime
      endTime
      daysAvailable
      active
      companyId
      createdAt
      status
    }
  }
`;

export const SERVICES_BY_COMPANY_AND_TYPE = gql`
  query ServicesByCompanyAndType(
    $type: ServiceType
    $companyId: Int
    $category: ServiceCategory
  ) {
    servicesByCompanyAndType(
      type: $type
      companyId: $companyId
      category: $category
    ) {
      id
      name
      type
      category
      price
      pricingUnit
      duration
      startTime
      endTime
      daysAvailable
      active
      companyId
      createdAt
      updatedAt
      status
    }
  }
`;

export type ServiceType = "HOTEL" | "DAYCARE" | "TRAINING" | "GROOMING";
export type ServiceCategory = "MAIN" | "ADDON";
export type PricingUnit =
  | "HOURLY"
  | "DAILY"
  | "NIGHTLY"
  | "SESSION"
  | "PACKAGE";

export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  category: ServiceCategory;
  price: number;
  pricingUnit: PricingUnit;
  duration: number;
  startTime: string;
  endTime: string;
  daysAvailable: string[];
  active: boolean;
  companyId: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ServicesByCompanyInput {
  companyId: number;
  active?: boolean;
  name?: string;
  category?: ServiceCategory;
}

export interface ServicesByCompanyAndTypeVariables {
  type: ServiceType;
  companyId: number;
  category?: ServiceCategory;
}
