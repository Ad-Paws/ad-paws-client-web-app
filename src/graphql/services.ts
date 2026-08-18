import { graphql } from "@/generated";

/**
 * Catálogo del negocio activo.
 *
 * `servicesByCompany(companyId:)` desapareció: la empresa ya no es un
 * argumento, sale de la sesión. Un cliente ve el mismo campo que el mostrador.
 *
 * Los horarios llegan como minutos desde medianoche en la zona horaria del
 * negocio (480 = 08:00) y los días como máscara de 7 bits, con `daysOfWeek`
 * expandido para no tener que interpretarla en el cliente.
 */
export const SERVICES = graphql(`
  query Services($type: ServiceType) {
    services(type: $type, status: ACTIVE) {
      id
      name
      description
      type
      category
      price
      currency
      pricingUnit
      durationMinutes
      opensAtMinute
      closesAtMinute
      checkoutCutoffMinute
      daysOfWeek
      capacity
    }
  }
`);

/** Si el servicio corre ese día. Disponibilidad, no precio. */
export const SERVICE_AVAILABILITY = graphql(`
  query ServiceAvailability($serviceId: ID!, $date: DateTime!) {
    serviceAvailability(serviceId: $serviceId, date: $date) {
      bookable
      reason
    }
  }
`);

/**
 * Lo que cuesta cada fecha del rango, ya con las excepciones de temporada
 * aplicadas. Es lo que permite pintar un calendario donde el fin de semana
 * cuesta distinto sin que el cliente tenga que adivinar por qué.
 */
export const EFFECTIVE_PRICE_RANGE = graphql(`
  query EffectivePriceRange($serviceId: ID!, $from: DateTime!, $to: DateTime!) {
    effectivePriceRange(serviceId: $serviceId, from: $from, to: $to) {
      date
      basePrice
      price
      packagesAllowed
      exception {
        id
        name
        reason
      }
    }
  }
`);
