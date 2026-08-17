import type { CodegenConfig } from "@graphql-codegen/cli";

/**
 * Contrato de tipos con el backend.
 *
 * La fuente de verdad es `schema.graphql`, copiado del backend con
 * `pnpm schema:pull`. Está commiteado a propósito: un cambio de schema aparece
 * como diff en el PR, y CI puede generar tipos sin servidor corriendo.
 *
 * Dos salidas, por una razón concreta:
 *
 * 1. `src/generated/schema-types.ts` — tipos del schema (enums, inputs, objetos).
 *    No depende de documentos, así que sirve HOY, mientras las queries viejas
 *    siguen apuntando al backend anterior. Es lo que reemplaza al `src/types/Dog.ts`
 *    escrito a mano, que ya había divergido del schema real.
 *
 * 2. `src/generated/` con el preset `client` — tipos derivados de CADA operación.
 *    Sus documentos viven en `src/graphql/`, que arranca vacío y se llena
 *    conforme F3–F6 migran pantalla por pantalla. `ignoreNoDocuments` permite
 *    que el paso corra en verde mientras tanto.
 *
 * Los escalares NO son los de por defecto — ver docs/FRONTEND_TYPES.md del backend:
 * `DateTime` y `Money` son strings en el wire. Tipar `DateTime` como `Date`
 * compila y luego entrega un string en runtime; tratar `Money` como número
 * deshace la razón de que cada columna monetaria sea `Decimal` en la base.
 */

const scalars = {
  DateTime: "string",
  Money: "string",
  Upload: "File",
} as const;

const config: CodegenConfig = {
  schema: "./schema.graphql",
  ignoreNoDocuments: true,
  generates: {
    "./src/generated/schema-types.ts": {
      plugins: ["typescript"],
      config: {
        scalars,
        useTypeImports: true,
        skipTypename: true,
        enumsAsTypes: true,
      },
    },
    "./src/generated/": {
      preset: "client",
      documents: ["src/graphql/**/*.ts"],
      config: {
        scalars,
        useTypeImports: true,
      },
    },
  },
};

export default config;
