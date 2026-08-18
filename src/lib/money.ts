/**
 * Dinero.
 *
 * `Money` cruza el cable como `"650.00"` precisamente para que un double no lo
 * mangle: cada columna monetaria en la base es `Decimal`, y convertir a número
 * en el cliente deshace esa decisión en el último paso.
 *
 * Aquí sólo se FORMATEA. No hay suma, resta ni multiplicación de dinero en
 * esta app — los totales los calcula el servidor, que es donde vive el precio.
 * Si alguna vez hace falta aritmética, va en enteros de centavos o en
 * decimal.js, nunca en `Number()`.
 */

const formatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

/** El `Number()` de aquí es seguro: sólo alimenta al formateador. */
export function formatMoney(amount: string): string {
  return formatter.format(Number(amount));
}

/** True cuando no hay nada que cobrar — un paquete cubrió todo. */
export function isFree(amount: string): boolean {
  return Number(amount) === 0;
}
