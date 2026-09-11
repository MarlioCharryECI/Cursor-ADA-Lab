"use client";

import { useEffect, useState } from "react";
import { ActivityInput } from "@/components/ActivityInput";
import { CalculateButton } from "@/components/CalculateButton";
import { FootprintResult } from "@/components/FootprintResult";
import { HistoryList } from "@/components/HistoryList";
import { estimateCO2, type EstimateOutcome } from "@/lib/estimateCO2";
import {
  createHistoryEntry,
  prependHistoryEntry,
  readHistory,
  writeHistory,
  type HistoryEntry,
} from "@/lib/historyStorage";

export function EcoTrackApp() {
  const [activityText, setActivityText] = useState("");
  const [outcome, setOutcome] = useState<EstimateOutcome | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(readHistory());
  }, []);

  function handleCalculate() {
    const nextOutcome = estimateCO2(activityText);
    setOutcome(nextOutcome);
    setAnimationKey((current) => current + 1);

    if (nextOutcome.status !== "success") {
      return;
    }

    const entry = createHistoryEntry(activityText.trim(), nextOutcome.kgCO2);
    const nextHistory = prependHistoryEntry(history, entry);
    setHistory(nextHistory);
    writeHistory(nextHistory);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center gap-10 px-6 py-16">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-sage-700">
          Sostenibilidad
        </p>
        <h1 className="text-4xl font-light tracking-tight text-stone-800">
          EcoTrack
        </h1>
        <p className="max-w-md text-base leading-relaxed text-stone-500">
          Describe tu día en una frase. Estimamos una huella de carbono simple
          para ayudarte a notar el impacto de lo cotidiano.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <ActivityInput
          value={activityText}
          onChange={setActivityText}
        />
        <CalculateButton onClick={handleCalculate} />
      </section>

      <section className="min-h-[7rem]">
        <FootprintResult
          key={animationKey}
          outcome={outcome}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-stone-600">Historial</h2>
        <HistoryList entries={history} />
      </section>
    </main>
  );
}
