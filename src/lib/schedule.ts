import type { DayOfWeek } from "@/generated/schema-types";

/**
 * Horarios y días de los servicios.
 *
 * El backend guarda las horas como minutos desde medianoche (480 = 08:00) y
 * los días como máscara de 7 bits, con `daysOfWeek` ya expandido para el
 * cliente. Esas dos representaciones son de la ZONA HORARIA DEL NEGOCIO.
 *
 * Aquí se construyen fechas en la zona del navegador, que para un negocio y un
 * cliente mexicanos es la misma. Si algún día hay clientes reservando desde
 * otro huso, esto tiene que pasar por la `timezone` de la empresa —está en
 * `myCompany`— porque una reserva de guardería que se corre un día es un perro
 * que llega cuando no lo esperan.
 */

const DAY_INDEX: Record<DayOfWeek, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

/** 480 -> "08:00" */
export function formatMinuteOfDay(minute: number): string {
  const hours = Math.floor(minute / 60);
  const minutes = minute % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** Copia de la fecha con la hora puesta en ese minuto del día. */
export function atMinuteOfDay(date: Date, minute: number): Date {
  const result = new Date(date);
  result.setHours(Math.floor(minute / 60), minute % 60, 0, 0);
  return result;
}

/** ISO-8601, que es como viaja `DateTime`. */
export function toDateTime(date: Date, minute: number): string {
  return atMinuteOfDay(date, minute).toISOString();
}

/** Los días de la semana en que NO corre el servicio, para el calendario. */
export function closedWeekdays(daysOfWeek: readonly DayOfWeek[]): number[] {
  const open = new Set(daysOfWeek.map((day) => DAY_INDEX[day]));
  return [0, 1, 2, 3, 4, 5, 6].filter((index) => !open.has(index));
}

export function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/** Noches entre dos fechas. La de salida no es noche. */
export function nightsBetween(from: Date, to: Date): number {
  const ms = atMinuteOfDay(to, 0).getTime() - atMinuteOfDay(from, 0).getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}
