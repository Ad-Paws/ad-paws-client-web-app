import { graphql } from "@/generated";

/**
 * Paquetes que tiene un perro, con sus saldos.
 *
 * `remainingQuantity` en null significa ILIMITADO, no cero: el paquete permite
 * usar ese servicio sin tope dentro de su vigencia. Confundir los dos casos en
 * la UI sería decirle a alguien que se le acabó algo que no se acaba.
 *
 * `ledger` existe y a propósito no se pide: el movimiento a movimiento es
 * material de mostrador, no de la app del dueño, y cuesta nodos.
 */
export const DOG_PACKAGES = graphql(`
  query DogPackages($dogId: ID!) {
    dogPackages(dogId: $dogId, activeOnly: true) {
      id
      status
      purchaseDate
      expiryDate
      renewalDate
      billingCycle
      package {
        id
        name
        type
        validityDays
      }
      balances {
        id
        initialQuantity
        remainingQuantity
        usedQuantity
        service {
          id
          name
        }
      }
    }
  }
`);

/**
 * El catálogo que vende el negocio.
 *
 * Comprar NO es posible desde aquí: `purchasePackage` es staff-only porque el
 * cobro ocurre en sucursal. Se muestra para que el cliente sepa qué existe y
 * lo pida, no para simular una tienda que no puede cobrar.
 */
export const PACKAGES = graphql(`
  query Packages {
    packages(activeOnly: true) {
      id
      name
      description
      price
      type
      validityDays
      items {
        id
        quantity
        service {
          id
          name
        }
      }
    }
  }
`);
