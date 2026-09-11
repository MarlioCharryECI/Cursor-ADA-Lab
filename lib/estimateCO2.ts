export const MAX_ACTIVITY_LENGTH = 4000;

export const UNRECOGNIZED_MESSAGE =
  "No pude identificar actividades con impacto de carbono";

export type EstimateOutcome =
  | { status: "empty" }
  | { status: "too_long" }
  | { status: "unrecognized" }
  | { status: "success"; kgCO2: number };

const FOOD_RED_MEAT_KG = 6;
const FOOD_POULTRY_OR_FISH_KG = 2;
const BUS_KG_PER_KM = 0.1;
const CAR_KG_PER_KM = 0.2;

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

function extractKilometers(normalized: string): number {
  const matches = [
    ...normalized.matchAll(/(\d+(?:[.,]\d+)?)\s*k(?:m|ilometros?)\b/g),
  ];

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
  let kgCO2 = 0;
  let recognized = false;

  if (normalized.includes("carne")) {
    kgCO2 += FOOD_RED_MEAT_KG;
    recognized = true;
  }

  if (normalized.includes("pollo") || normalized.includes("pescado")) {
    kgCO2 += FOOD_POULTRY_OR_FISH_KG;
    recognized = true;
  }

  const kilometers = extractKilometers(normalized);
  const mentionsBus =
    normalized.includes("bus") || normalized.includes("transporte publico");
  const mentionsCar =
    containsStandaloneWord(normalized, "carro") ||
    containsStandaloneWord(normalized, "auto");
  const mentionsZeroImpact =
    normalized.includes("bicicleta") || normalized.includes("caminar");

  if (mentionsBus) {
    kgCO2 += BUS_KG_PER_KM * kilometers;
    recognized = true;
  }

  if (mentionsCar) {
    kgCO2 += CAR_KG_PER_KM * kilometers;
    recognized = true;
  }

  if (mentionsZeroImpact) {
    recognized = true;
  }

  if (!recognized) {
    return { status: "unrecognized" };
  }

  return { status: "success", kgCO2: roundToOneDecimal(kgCO2) };
}
