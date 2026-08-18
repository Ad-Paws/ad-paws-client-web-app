import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Pruebas de las reglas puras: dinero, horarios, reparto de reservas y la
 * traducción del formulario al input de la API. Sin DOM a propósito — lo que
 * se rompió en esta migración fueron reglas, no pintado.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
