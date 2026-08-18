import type { CreateDogInput } from "@/generated/schema-types";

/**
 * Perros capturados en el alta que todavía no se pueden guardar.
 *
 * `createDog` exige empresa activa. Cuando alguien se registra sin el link del
 * negocio —sin `?empresa=<slug>`— la cuenta nace sin membresía, así que los
 * perros que acaba de capturar no tienen dónde ir todavía. Antes se perdían en
 * silencio: el formulario los pedía, la pantalla decía "todo listo", y no
 * existían. Aquí esperan hasta que la cuenta se vincula.
 *
 * En `sessionStorage` y no en `localStorage` a propósito: si la persona
 * abandona y vuelve días después, prefiero que capture sus perros de nuevo a
 * resucitar datos de los que ya no se acuerda.
 *
 * Las fotos van en memoria, no en `sessionStorage`: un `File` no es
 * serializable, y convertirlo a base64 metería megabytes en un almacén de ~5 MB
 * para llenarlo con la primera foto de un teléfono moderno. Sobreviven a
 * navegar dentro de la app, que es el caso real (registro -> vincular), pero no
 * a recargar. Si se pierden, el perro se crea igual y la foto se agrega desde
 * su perfil — perder la foto es molesto; perder el perro, no.
 */

const KEY = "adpaws.pendingDogs";

let pendingPhotos: (File | null)[] = [];

export function savePendingDogs(
  dogs: CreateDogInput[],
  photos: (File | null)[] = [],
): void {
  if (dogs.length === 0) return;
  pendingPhotos = photos;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(dogs));
  } catch {
    // Sin almacenamiento se pierden, que es el comportamiento anterior. No
    // vale la pena romper el alta por esto.
  }
}

export function readPendingDogs(): CreateDogInput[] {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CreateDogInput[]) : [];
  } catch {
    return [];
  }
}

/** Foto del perro pendiente en esa posición, si sigue en memoria. */
export function readPendingPhoto(index: number): File | null {
  return pendingPhotos[index] ?? null;
}

export function clearPendingDogs(): void {
  pendingPhotos = [];
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ídem */
  }
}
