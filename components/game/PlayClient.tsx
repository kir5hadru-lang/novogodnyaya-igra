"use client";

import { useState } from "react";
import { buildScenario } from "@/lib/scenario/build";
import type { Answers, Scenario } from "@/lib/scenario/types";
import Game from "./Game";
import Quiz from "./Quiz";

type Props = { token: string; demo: boolean; initialScenario: Scenario | null };

export default function PlayClient({ token, demo, initialScenario }: Props) {
  const [scenario, setScenario] = useState<Scenario | null>(initialScenario);
  const [retake, setRetake] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(answers: Answers) {
    setError("");
    if (demo) {
      setScenario(buildScenario(answers, `${token}-${Date.now()}`));
      setRetake(false);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/games/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка");
      setScenario(data.scenario);
      setRetake(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не получилось сохранить, попробуйте ещё раз");
    } finally {
      setSaving(false);
    }
  }

  if (scenario && !retake) {
    return <Game scenario={scenario} onRetake={() => setRetake(true)} />;
  }
  return <Quiz onDone={submit} saving={saving} error={error} demo={demo} />;
}
