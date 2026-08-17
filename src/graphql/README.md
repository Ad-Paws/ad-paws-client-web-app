# Documentos GraphQL

Aquí viven las operaciones que consume la app, escritas con el helper
`graphql()` que genera codegen (`src/generated/`). Cada pantalla migrada en
F3–F6 trae sus documentos a esta carpeta.

```ts
import { graphql } from "@/generated";

export const MyDogs = graphql(`
  query MyDogs {
    myDogs { id name breed imageUrl }
  }
`);
```

Regla: ningún tipo de GraphQL se escribe a mano. Si un campo no está en
`schema.graphql`, no existe en el backend.

Lo que queda en `src/lib/api/*.api.ts` son las operaciones del backend
anterior, pendientes de migrar — ver el plan, §6.1.
