#!/usr/bin/env node
/**
 * La app de cliente es exclusiva para clientes.
 *
 * El backend ya lo garantiza: cada campo raíz declara @auth con los roles que
 * lo pueden llamar, y un CLIENT que pida `guestStats` recibe FORBIDDEN sin
 * importar lo que haga el frontend. Este script no cuida la seguridad — cuida
 * el ALCANCE del producto.
 *
 * Existe porque este repo nació como copia del app de negocio y arrastró
 * durante meses el modal de check-in, el alta de servicios y las queries de
 * propietarios. Nada de eso se veía, pero seguía en el bundle y en la cabeza de
 * quien leía el código. Cuando alguien vuelva a pegar aquí una operación de
 * mostrador, esto falla en CI en vez de descubrirse en revisión.
 *
 * Los documentos se PARSEAN en vez de buscarse con texto: `occupancy` es a la
 * vez una query staff-only y un campo legítimo de `Reservation`, y un grep no
 * distingue los dos. Sólo cuentan las selecciones en la raíz de la operación.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { parse } from "graphql";

/** Operaciones que el backend reserva a OWNER / ADMIN / STAFF. */
const STAFF_ONLY = new Set([
  // Mostrador
  "checkInReservation",
  "checkOutReservation",
  "markReservationPaid",
  "reservationsOn",
  "occupancy",
  // Paquetes: venderlos y ajustarlos es del negocio
  "purchasePackage",
  "renewDogPackage",
  "cancelDogPackage",
  "adjustBalance",
  "createPackage",
  "deactivatePackage",
  // Catálogo y precios
  "createService",
  "updateService",
  "archiveService",
  "priceExceptions",
  "createPriceException",
  "updatePriceException",
  "deletePriceException",
  // Reportes
  "guestStats",
  "revenueStats",
  "pendingPayments",
  // Personas
  "companyClients",
  "companyStaff",
  "companyMembers",
  "inviteMember",
  "revokeMembership",
  "changeMemberRole",
  // Empresa y perros ajenos
  "createCompany",
  "updateCompany",
  "archiveDog",
  "updateDogCompanyNotes",
]);

const ROOTS = ["src/graphql", "src/lib/api"];

function filesIn(dir) {
  let found = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return found; // la carpeta puede no existir: lib/api se vació al migrar
  }
  for (const entry of entries) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) found = found.concat(filesIn(path));
    else if (path.endsWith(".ts") || path.endsWith(".tsx")) found.push(path);
  }
  return found;
}

/**
 * Cuerpos de `graphql(\`…\`)`, `gql\`…\`` y de los documentos sueltos que van
 * en un `fetch` a mano — el refresh de sesión es uno.
 *
 * El lookbehind evita el falso positivo obvio: la URL `${API_URL}/graphql`
 * termina en "graphql" seguido de una comilla invertida.
 */
function documentsIn(source) {
  const documents = [];
  const pattern = /(?<![\w/])(?:graphql|gql|query:)\s*(?:\(\s*)?`([\s\S]*?)`/g;
  let match;
  while ((match = pattern.exec(source)) !== null) documents.push(match[1]);
  return documents;
}

const offences = [];
let operationCount = 0;

for (const root of ROOTS) {
  for (const file of filesIn(root)) {
    for (const document of documentsIn(readFileSync(file, "utf8"))) {
      let ast;
      try {
        ast = parse(document);
      } catch {
        offences.push(`  ${file}  documento GraphQL que no parsea`);
        continue;
      }

      for (const definition of ast.definitions) {
        if (definition.kind !== "OperationDefinition") continue;
        operationCount += 1;

        for (const selection of definition.selectionSet.selections) {
          if (selection.kind !== "Field") continue;
          if (STAFF_ONLY.has(selection.name.value)) {
            const name = definition.name?.value ?? "(anónima)";
            offences.push(`  ${file}  ${name} → ${selection.name.value}`);
          }
        }
      }
    }
  }
}

if (offences.length > 0) {
  console.error(
    `\nOperaciones de mostrador en la app de cliente (${offences.length}):\n\n` +
      offences.join("\n") +
      `\n\nEsta app es exclusiva para clientes finales. Si el negocio necesita\n` +
      `esta operación, va en el app de negocio.\n`,
  );
  process.exit(1);
}

console.log(
  `✓ ${operationCount} operaciones revisadas, ninguna staff-only ` +
    `(${STAFF_ONLY.size} vigiladas)`,
);
