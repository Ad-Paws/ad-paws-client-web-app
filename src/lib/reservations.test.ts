import { describe, expect, it } from "vitest";
import { splitReservations } from "./reservations";

/**
 * El reparto de pestañas se equivocó dos veces en producción, las dos por
 * mezclar "cuándo" con "en qué estado está". Cada caso de aquí es uno de esos
 * errores.
 *
 * Fechas fijas, no relativas al reloj: una prueba de calendario escrita con
 * `Date.now()` pasa de día y falla sola a las once de la noche, y entonces
 * nadie vuelve a creerle a la suite.
 */

const TODAY = new Date(2026, 7, 18).getTime(); // 18 ago 2026, 00:00
const iso = (day: number, hour = 8) =>
  new Date(2026, 7, day, hour, 0).toISOString();

describe("splitReservations", () => {
  it("deja en próximas una reserva de HOY cuya hora ya pasó", () => {
    // El bug original: reservar la guardería del mismo día a las 10 de la
    // noche hacía que la reserva naciera en el historial.
    const reservation = { status: "PENDING", scheduledCheckIn: iso(18, 8) };
    const { upcoming, past } = splitReservations([reservation], TODAY);

    expect(upcoming).toHaveLength(1);
    expect(past).toHaveLength(0);
  });

  it("manda al historial una reserva de ayer que nadie usó", () => {
    const reservation = { status: "PENDING", scheduledCheckIn: iso(17) };
    const { upcoming, past } = splitReservations([reservation], TODAY);

    expect(upcoming).toHaveLength(0);
    expect(past).toHaveLength(1);
  });

  it("manda al historial una cancelada aunque su fecha sea futura", () => {
    const reservation = { status: "CANCELLED", scheduledCheckIn: iso(25) };
    const { upcoming, past } = splitReservations([reservation], TODAY);

    expect(upcoming).toHaveLength(0);
    expect(past).toHaveLength(1);
  });

  it("mantiene en próximas un perro que ya está adentro", () => {
    const reservation = {
      status: "CHECKED_IN",
      scheduledCheckIn: iso(16),
      scheduledCheckOut: iso(20),
    };

    expect(splitReservations([reservation], TODAY).upcoming).toHaveLength(1);
  });

  it("usa la salida, no la llegada, para decidir si ya terminó", () => {
    const stay = {
      status: "PENDING",
      scheduledCheckIn: iso(15),
      scheduledCheckOut: iso(22),
    };

    expect(splitReservations([stay], TODAY).upcoming).toHaveLength(1);
  });

  it("ordena las próximas de más cercana a más lejana", () => {
    const far = { status: "PENDING", scheduledCheckIn: iso(30) };
    const near = { status: "PENDING", scheduledCheckIn: iso(20) };

    const { upcoming } = splitReservations([far, near], TODAY);

    expect(upcoming.map((r) => r.scheduledCheckIn)).toEqual([
      near.scheduledCheckIn,
      far.scheduledCheckIn,
    ]);
  });

  it("ordena el historial de más reciente a más antigua", () => {
    const old = { status: "COMPLETED", scheduledCheckIn: iso(1) };
    const recent = { status: "COMPLETED", scheduledCheckIn: iso(15) };

    const { past } = splitReservations([old, recent], TODAY);

    expect(past.map((r) => r.scheduledCheckIn)).toEqual([
      recent.scheduledCheckIn,
      old.scheduledCheckIn,
    ]);
  });
});
