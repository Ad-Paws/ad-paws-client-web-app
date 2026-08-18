/**
 * Reparto de reservas entre "próximas" y "pasadas".
 *
 * Vive aparte del componente porque es una regla, no una vista: se puede
 * probar sin montar React, y las dos veces que estuvo mal —el corte por reloj
 * exacto y el estado ignorado— fueron errores de lógica que una prueba habría
 * atrapado antes que un usuario.
 */

export interface SplittableReservation {
  status: string;
  scheduledCheckIn: string;
  scheduledCheckOut?: string | null;
}

/** El final de la estancia manda: una salida futura sigue siendo futura. */
function referenceTime(reservation: SplittableReservation): number {
  return new Date(reservation.scheduledCheckOut ?? reservation.scheduledCheckIn).getTime();
}

/** Sólo PENDING y CHECKED_IN siguen vivas; el resto ya terminó de un modo u otro. */
function isLive(reservation: SplittableReservation): boolean {
  return reservation.status === "PENDING" || reservation.status === "CHECKED_IN";
}

/**
 * @param today milisegundos del INICIO de hoy, no del instante actual.
 *   Con el reloj exacto, una reserva de hoy caía al historial en cuanto pasaba
 *   su hora de entrada: quien reservaba la guardería del mismo día ya no
 *   encontraba su reserva. El día es la granularidad con la que la gente piensa.
 */
export function splitReservations<T extends SplittableReservation>(
  reservations: readonly T[],
  today: number,
): { upcoming: T[]; past: T[] } {
  return {
    upcoming: reservations
      .filter((r) => isLive(r) && referenceTime(r) >= today)
      .sort((a, b) => referenceTime(a) - referenceTime(b)),
    past: reservations
      .filter((r) => !isLive(r) || referenceTime(r) < today)
      .sort((a, b) => referenceTime(b) - referenceTime(a)),
  };
}
