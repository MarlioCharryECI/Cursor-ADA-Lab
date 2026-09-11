export type HistoryEntry = {
  id: string;
  text: string;
  kgCO2: number;
  recordedAt: string;
};

const STORAGE_KEY = "ecotrack-history";
const MAX_STORED_ENTRIES = 20;

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === "string" &&
    typeof entry.text === "string" &&
    typeof entry.kgCO2 === "number" &&
    Number.isFinite(entry.kgCO2) &&
    typeof entry.recordedAt === "string"
  );
}

export function readHistory(): HistoryEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isHistoryEntry);
  } catch {
    return [];
  }
}

export function writeHistory(entries: HistoryEntry[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Quota or private-mode failures should not crash the estimate flow.
  }
}

export function prependHistoryEntry(
  previous: HistoryEntry[],
  entry: HistoryEntry
): HistoryEntry[] {
  return [entry, ...previous].slice(0, MAX_STORED_ENTRIES);
}

export function createHistoryEntry(text: string, kgCO2: number): HistoryEntry {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return {
    id,
    text,
    kgCO2,
    recordedAt: new Date().toISOString(),
  };
}
