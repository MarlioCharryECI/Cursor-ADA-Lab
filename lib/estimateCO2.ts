export const MAX_ACTIVITY_LENGTH = 4000;

export const UNRECOGNIZED_MESSAGE =
  "No pude identificar actividades con impacto de carbono";

export type DetectedItem = {
  label: string;
  kgCO2: number;
};

export type EstimateOutcome =
  | { status: "empty" }
  | { status: "too_long" }
  | { status: "unrecognized" }
  | { status: "success"; kgCO2: number; items: DetectedItem[] };

const FOOD_RED_MEAT_KG = 6;
const FOOD_POULTRY_OR_FISH_KG = 2;
const BUS_KG_PER_KM = 0.1;
const CAR_KG_PER_KM = 0.2;
const VAN_KG_PER_VEHICLE = 8;
const ELECTRICITY_KG_PER_KWH = 0.14;

const KM_PATTERN = /(\d+(?:[.,]\d+)?)\s*k(?:m|ilometros?)\b/g;
const KWH_PATTERN = /(\d+(?:[.,]\d+)?)\s*kwh\b/g;
const VAN_PATTERN = /(\d+(?:[.,]\d+)?)\s*camionetas?\b/g;

function normalizeActivityText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function containsStandaloneWord(normalized: string, word: string): boolean {
  const pattern = new RegExp(`(?:^|[^a-z])${word}(?:[^a-z]|$)`);
  return pattern.test(normalized);
}

function extractQuantity(normalized: string, pattern: RegExp): number {
  const matches = [...normalized.matchAll(pattern)];

  if (matches.length === 0) {
    return 0;
  }

  return matches.reduce((total, match) => {
    const parsed = Number.parseFloat(match[1].replace(",", "."));
    if (!Number.isFinite(parsed) || parsed < 0) {
      return total;
    }
    return total + parsed;
  }, 0);
}

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

export function estimateCO2(text: string): EstimateOutcome {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return { status: "empty" };
  }

  if (trimmed.length > MAX_ACTIVITY_LENGTH) {
    return { status: "too_long" };
  }

  const normalized = normalizeActivityText(trimmed);
  const items: DetectedItem[] = [];

  if (normalized.includes("carne")) {
    items.push({ label: "Carne roja", kgCO2: FOOD_RED_MEAT_KG });
  }

  if (normalized.includes("pollo") || normalized.includes("pescado")) {
    items.push({ label: "Pollo o pescado", kgCO2: FOOD_POULTRY_OR_FISH_KG });
  }

  const kilometers = extractQuantity(normalized, KM_PATTERN);
  const mentionsBus =
    normalized.includes("bus") || normalized.includes("transporte publico");
  const mentionsCar =
    containsStandaloneWord(normalized, "carro") ||
    containsStandaloneWord(normalized, "auto");
  const mentionsZeroImpact =
    normalized.includes("bicicleta") || normalized.includes("caminar");

  if (mentionsBus) {
    items.push({
      label: `${kilometers} km en bus`,
      kgCO2: roundToOneDecimal(BUS_KG_PER_KM * kilometers),
    });
  }

  if (mentionsCar) {
    items.push({
      label: `${kilometers} km en carro`,
      kgCO2: roundToOneDecimal(CAR_KG_PER_KM * kilometers),
    });
  }

  if (mentionsZeroImpact) {
    items.push({ label: "Bicicleta o caminata", kgCO2: 0 });
  }

  const vanCount = extractQuantity(normalized, VAN_PATTERN);
  if (vanCount > 0) {
    items.push({
      label: `${vanCount} camioneta(s) de reparto`,
      kgCO2: roundToOneDecimal(VAN_KG_PER_VEHICLE * vanCount),
    });
  }

  const kwh = extractQuantity(normalized, KWH_PATTERN);
  if (kwh > 0) {
    items.push({
      label: `${kwh} kWh de electricidad`,
      kgCO2: roundToOneDecimal(ELECTRICITY_KG_PER_KWH * kwh),
    });
  }

  if (items.length === 0) {
    return { status: "unrecognized" };
  }

  const kgCO2 = roundToOneDecimal(
    items.reduce((total, item) => total + item.kgCO2, 0)
  );

  return { status: "success", kgCO2, items };
}
