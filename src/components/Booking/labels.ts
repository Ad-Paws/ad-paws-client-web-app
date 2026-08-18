/**
 * Etiquetas del catálogo, en un archivo aparte porque exportar constantes
 * junto a componentes rompe el fast refresh de Vite.
 */

const SERVICE_TYPE_LABELS: Record<string, string> = {
  HOTEL: "Hotel",
  DAYCARE: "Guardería",
  GROOMING: "Estética",
  TRAINING: "Entrenamiento",
};

export const PRICING_UNIT_LABELS: Record<string, string> = {
  NIGHTLY: "por noche",
  DAILY: "por día",
  HOURLY: "por hora",
  SESSION: "por sesión",
  PACKAGE: "por paquete",
};

export function serviceTypeLabel(type: string): string {
  return SERVICE_TYPE_LABELS[type] ?? type;
}
