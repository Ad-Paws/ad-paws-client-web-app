import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // `src/generated` es salida de codegen: se revisa por diff, no por lint.
  globalIgnores(["dist", "src/generated"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    ignores: ["src/components/ui/*.tsx"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      /**
       * `Money` viaja como "650.00" para que ningún double lo mangle: cada
       * columna monetaria en la base es Decimal, y convertir a número en el
       * cliente deshace esa decisión en el último paso. Los totales los calcula
       * el servidor; aquí sólo se formatean.
       *
       * `src/lib/money.ts` es la única excepción, y ahí el Number() sólo
       * alimenta a Intl.NumberFormat.
       */
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name='Number']",
          message:
            "No conviertas dinero a número. Formatea con formatMoney() de @/lib/money; " +
            "la aritmética de Money vive en el servidor.",
        },
        {
          selector: "CallExpression[callee.name=/^(parseInt|parseFloat)$/]",
          message:
            "Los ids son ID (string) y el dinero es Money (string). Si necesitas " +
            "un número, di por qué con un eslint-disable en la línea.",
        },
      ],
    },
  },
  {
    // El único lugar donde Number() es correcto.
    files: ["src/lib/money.ts"],
    rules: { "no-restricted-syntax": "off" },
  },
]);
