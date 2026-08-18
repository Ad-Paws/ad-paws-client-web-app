import { graphql } from "@/generated";

/**
 * Cotización antes de reservar.
 *
 * Corre exactamente las mismas validaciones y el mismo código de precio que la
 * reserva real, con la MISMA entrada — por eso el total que ve el cliente no
 * puede diferir del que se le cobra. Aquí ya no se arman `items` con precios
 * calculados en el navegador: eso era pedirle al cliente que se autocotizara.
 */
export const QUOTE_RESERVATION = graphql(`
  query QuoteReservation($input: CreateReservationInput!) {
    quoteReservation(input: $input) {
      subtotal
      total
      amountDue
      coveredDates
      warnings
      service {
        id
        name
        type
        pricingUnit
      }
      dates {
        date
        basePrice
        price
        exception {
          id
          name
          reason
        }
      }
      addOns {
        price
        coveredByPackage
        service {
          id
          name
        }
      }
    }
  }
`);

export const CREATE_RESERVATION = graphql(`
  mutation CreateReservation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      id
      status
      scheduledCheckIn
      scheduledCheckOut
      total
      dog {
        id
        name
      }
    }
  }
`);

/**
 * Reservas de la empresa activa. El staff las ve todas; un cliente sólo las de
 * sus perros, así que el mismo campo sirve para los dos.
 *
 * `first: 25` va como LITERAL, no como variable, y eso no es estilo: el
 * estimador de costo del backend no puede leer el valor de una variable en
 * tiempo de validación, así que asume el peor caso —100— y lo multiplica hacia
 * abajo. Con `items` sin paginar (50 asumidos) eso daba 100 × 50 × campos ≈
 * 26,000 nodos contra un límite de 10,000, y la query se rechazaba antes de
 * tocar la base.
 *
 * De `items` sólo se piden los tres campos que la lista usa, por la misma
 * razón: cada campo ahí dentro se cobra multiplicado.
 */
export const RESERVATIONS = graphql(`
  query Reservations($filter: ReservationFilter) {
    reservations(filter: $filter, first: 25) {
      id
      status
      scheduledCheckIn
      scheduledCheckOut
      total
      dog {
        id
        name
        imageUrl
      }
      items {
        id
        name
        kind
      }
    }
  }
`);

export const RESERVATION = graphql(`
  query Reservation($id: ID!) {
    reservation(id: $id) {
      id
      status
      scheduledCheckIn
      scheduledCheckOut
      actualCheckInAt
      actualCheckOutAt
      total
      notes
      createdAt
      dog {
        id
        name
        imageUrl
        breed
      }
      items {
        id
        name
        kind
        quantity
        unitPrice
        totalPrice
        sourceType
      }
      occupancy {
        id
        date
        kind
        sourceType
      }
      events {
        id
        type
        occurredAt
        notes
      }
    }
  }
`);

/**
 * Cancelar.
 *
 * El cliente sólo puede cancelar lo suyo, mientras siga PENDING y dentro de la
 * ventana que fija cada negocio; el motivo es obligatorio para él. El servidor
 * revisa las tres cosas — aquí se ocultan los botones que no aplican, que es
 * una decisión de interfaz, no una frontera.
 *
 * Devuelve los saldos del paquete al ledger; eso ya lo hacía y no cambia según
 * quién cancele.
 */
export const CANCEL_RESERVATION = graphql(`
  mutation CancelReservation($id: ID!, $reason: String) {
    cancelReservation(id: $id, reason: $reason) {
      id
      status
      total
    }
  }
`);
