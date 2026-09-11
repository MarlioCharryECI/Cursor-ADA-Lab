import type { HistoryEntry } from "@/lib/historyStorage";

type HistoryListProps = {
  entries: HistoryEntry[];
};

function formatTimestamp(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return "Fecha no disponible";
  }

  return parsed.toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function HistoryList({ entries }: HistoryListProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-stone-500">
        Todavía no hay cálculos guardados.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className="rounded-2xl border border-stone-200 bg-white px-4 py-3"
        >
          <p className="text-sm leading-relaxed text-stone-700">{entry.text}</p>
          <p className="mt-2 text-xs text-stone-500">
            {entry.kgCO2.toLocaleString("es-ES", {
              maximumFractionDigits: 1,
            })}{" "}
            kg de CO₂ · {formatTimestamp(entry.recordedAt)}
          </p>
        </li>
      ))}
    </ul>
  );
}
