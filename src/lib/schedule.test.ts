import { describe, expect, it } from "vitest";
import {
  atMinuteOfDay,
  closedWeekdays,
  formatMinuteOfDay,
  nightsBetween,
  toDateTime,
} from "./schedule";

describe("formatMinuteOfDay", () => {
  it("traduce minutos desde medianoche a hora legible", () => {
    expect(formatMinuteOfDay(480)).toBe("08:00");
    expect(formatMinuteOfDay(1_290)).toBe("21:30");
  });

  it("rellena con ceros para que la hora no baile en la lista", () => {
    expect(formatMinuteOfDay(65)).toBe("01:05");
    expect(formatMinuteOfDay(0)).toBe("00:00");
  });
});

describe("closedWeekdays", () => {
  it("devuelve los días en que NO corre el servicio", () => {
    // react-day-picker deshabilita por índice, con domingo en 0.
    expect(closedWeekdays(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]))
      .toEqual([0, 6]);
  });

  it("no cierra ninguno cuando el servicio corre todos los días", () => {
    expect(
      closedWeekdays([
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
      ]),
    ).toEqual([]);
  });
});

describe("atMinuteOfDay", () => {
  it("pone la hora sin mover el día", () => {
    const date = new Date(2026, 7, 18, 23, 45);
    const result = atMinuteOfDay(date, 480);

    expect(result.getDate()).toBe(18);
    expect(result.getHours()).toBe(8);
    expect(result.getMinutes()).toBe(0);
  });

  it("no muta la fecha que recibe", () => {
    const date = new Date(2026, 7, 18, 23, 45);
    atMinuteOfDay(date, 480);

    expect(date.getHours()).toBe(23);
  });
});

describe("toDateTime", () => {
  it("produce un ISO, que es como viaja DateTime", () => {
    expect(toDateTime(new Date(2026, 7, 18), 480)).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    );
  });
});

describe("nightsBetween", () => {
  it("no cuenta el día de salida como noche", () => {
    // Miércoles a domingo son cuatro noches, no cinco.
    expect(nightsBetween(new Date(2026, 7, 19), new Date(2026, 7, 23))).toBe(4);
  });

  it("da una noche al mínimo hospedaje posible", () => {
    expect(nightsBetween(new Date(2026, 7, 19), new Date(2026, 7, 20))).toBe(1);
  });

  it("no devuelve negativos si las fechas vienen al revés", () => {
    expect(nightsBetween(new Date(2026, 7, 23), new Date(2026, 7, 19))).toBe(0);
  });
});
