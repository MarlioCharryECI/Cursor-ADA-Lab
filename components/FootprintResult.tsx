import { UNRECOGNIZED_MESSAGE, type EstimateOutcome } from "@/lib/estimateCO2";

type FootprintResultProps = {
  outcome: EstimateOutcome | null;
};

function messageForOutcome(outcome: EstimateOutcome): string {
  switch (outcome.status) {
    case "empty":
      return "Escribe una actividad para estimar tu huella.";
    case "too_long":
      return "El texto es demasiado largo. Resume tus actividades en un párrafo más corto.";
    case "unrecognized":
      return UNRECOGNIZED_MESSAGE;
    case "success":
      return "";
  }
}

export function FootprintResult({ outcome }: FootprintResultProps) {
  if (!outcome) {
    return (
      <p className="text-sm text-stone-500">
        El estimado de CO₂ aparecerá aquí.
      </p>
    );
  }

  if (outcome.status !== "success") {
    return (
      <p
        className="animate-result rounded-2xl border border-stone-200 bg-white px-5 py-4 text-sm leading-relaxed text-stone-600"
        role="status"
      >
        {messageForOutcome(outcome)}
      </p>
    );
  }

  return (
    <div
      className="animate-result rounded-2xl border border-sage-200 bg-white px-5 py-6"
      role="status"
    >
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-sage-700">
        Estimado del día
      </p>
      <p className="mt-3 text-4xl font-light tracking-tight text-stone-800">
        {outcome.kgCO2.toLocaleString("es-ES", {
          minimumFractionDigits: outcome.kgCO2 % 1 === 0 ? 0 : 1,
          maximumFractionDigits: 1,
        })}
        <span className="ml-2 text-base font-normal text-stone-500">
          kg de CO₂
        </span>
      </p>

      <div className="mt-5 border-t border-stone-100 pt-4">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-stone-400">
          Actividades detectadas en tu texto
        </p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {outcome.items.map((item, index) => (
            <li
              key={`${item.label}-${index}`}
              className="flex items-baseline justify-between gap-4 text-sm text-stone-600"
            >
              <span>{item.label}</span>
              <span className="whitespace-nowrap text-stone-500">
                {item.kgCO2.toLocaleString("es-ES", {
                  minimumFractionDigits: item.kgCO2 % 1 === 0 ? 0 : 1,
                  maximumFractionDigits: 1,
                })}{" "}
                kg
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
