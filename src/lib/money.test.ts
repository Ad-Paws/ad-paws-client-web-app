import { describe, expect, it } from "vitest";
import { formatMoney, isFree } from "./money";

/**
 * Lo que se prueba aquí no es el formateador de Intl, es la promesa del
 * módulo: que el dinero entra y sale como string y nadie hace aritmética con
 * él por el camino.
 */
describe("formatMoney", () => {
  it("formatea en pesos mexicanos", () => {
    expect(formatMoney("650.00")).toContain("650");
    expect(formatMoney("650.00")).toMatch(/\$/);
  });

  it("conserva los centavos", () => {
    expect(formatMoney("1234.56")).toContain("1,234.56");
  });

  it("no redondea hacia arriba un valor con más precisión de la que muestra", () => {
    // El servidor manda dos decimales; si algún día mandara tres, mejor
    // enterarse por esta prueba que por un total que no cuadra.
    expect(formatMoney("0.01")).toContain("0.01");
  });
});

describe("isFree", () => {
  it("reconoce el cero en las formas en que llega", () => {
    expect(isFree("0")).toBe(true);
    expect(isFree("0.00")).toBe(true);
  });

  it("no confunde un monto pequeño con gratis", () => {
    expect(isFree("0.01")).toBe(false);
  });
});
