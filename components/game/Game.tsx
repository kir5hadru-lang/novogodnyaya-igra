"use client";

import { useCallback, useState } from "react";
import type { Scenario, Step } from "@/lib/scenario/types";
import CatchGame from "./minigames/CatchGame";
import GiftUnwrap from "./minigames/GiftUnwrap";
import MemoryGame from "./minigames/MemoryGame";
import TreeGame from "./minigames/TreeGame";
import WishRitual from "./minigames/WishRitual";
import { Card, PrimaryButton } from "./ui";

type Props = { scenario: Scenario; onRetake: () => void };

const STEP_ICONS: Partial<Record<Step["kind"], string>> = {
  tree: "🎄",
  catch: "🧺",
  memory: "🃏",
  wish: "🔥",
  gift: "🎁",
};

export default function Game({ scenario, onRetake }: Props) {
  const [index, setIndex] = useState(-1); // -1 — заставка
  const next = useCallback(() => setIndex((i) => i + 1), []);

  const { steps } = scenario;

  if (index === -1) {
    return (
      <Card>
        <div className="animate-rise text-center">
          <div className="animate-twinkle text-6xl">🎄</div>
          <p className="mt-4 text-sm uppercase tracking-widest text-gold">{scenario.name}, это для тебя</p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{scenario.title}</h1>
          <p className="mx-auto mt-3 max-w-xs text-snow/70">
            Пять маленьких заданий и сюрприз в конце. Займёт минут пять — налей чаю ☕
          </p>
          <div className="mt-4 flex justify-center gap-2 text-2xl">
            {Object.values(STEP_ICONS).map((e) => (
              <span key={e}>{e}</span>
            ))}
          </div>
          <PrimaryButton className="mt-8" onClick={next}>
            Начать
          </PrimaryButton>
        </div>
      </Card>
    );
  }

  if (index >= steps.length) {
    return <Final scenario={scenario} onReplay={() => setIndex(-1)} onRetake={onRetake} />;
  }

  const step = steps[index];
  const tasks = steps.filter((s) => s.kind !== "story");
  const doneTasks = steps.slice(0, index).filter((s) => s.kind !== "story").length;

  return (
    <Card>
      <div className="mb-5 flex items-center justify-center gap-2" aria-label={`Заданий пройдено: ${doneTasks} из ${tasks.length}`}>
        {tasks.map((t, i) => (
          <span
            key={i}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-lg transition ${
              i < doneTasks ? "bg-gold/25 ring-2 ring-gold" : i === doneTasks ? "bg-white/10 ring-1 ring-white/40" : "bg-white/5 opacity-40"
            }`}
          >
            {i < doneTasks ? "✓" : STEP_ICONS[t.kind]}
          </span>
        ))}
      </div>

      <div key={index} className="animate-rise">
        <StepView step={step} onDone={next} />
      </div>
    </Card>
  );
}

function StepView({ step, onDone }: { step: Step; onDone: () => void }) {
  switch (step.kind) {
    case "story":
      return (
        <div className="text-center">
          <div className="text-6xl">{step.emoji}</div>
          <p className="mt-5 text-lg leading-relaxed sm:text-xl">{step.text}</p>
          <PrimaryButton className="mt-8" onClick={onDone}>
            {step.button}
          </PrimaryButton>
        </div>
      );
    case "tree":
      return <TreeGame onDone={onDone} />;
    case "catch":
      return <CatchGame items={step.items} onDone={onDone} />;
    case "memory":
      return <MemoryGame emojis={step.emojis} onDone={onDone} />;
    case "wish":
      return <WishRitual onDone={onDone} />;
    case "gift":
      return <GiftUnwrap text={step.text} onDone={onDone} />;
  }
}

function Final({ scenario, onReplay, onRetake }: { scenario: Scenario; onReplay: () => void; onRetake: () => void }) {
  const { final } = scenario;
  return (
    <div className="relative">
      <Sparkles />
      <div className="animate-pop relative rounded-3xl bg-[#fdf6e3] p-7 text-night shadow-2xl sm:p-9">
        <div className="text-center text-5xl">💌</div>
        <h1 className="mt-4 text-center font-display text-3xl font-bold text-berry sm:text-4xl">{final.heading}</h1>
        <p className="mt-5 text-lg leading-relaxed">{final.text}</p>
        <p className="mt-6 text-right font-display text-xl italic">{final.signature}</p>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <PrimaryButton onClick={onReplay}>Сыграть ещё раз</PrimaryButton>
        <button onClick={onRetake} className="rounded-full px-5 py-3 text-snow/80 ring-1 ring-white/25 hover:text-snow">
          Пройти тест заново
        </button>
      </div>
    </div>
  );
}

function Sparkles() {
  const items = ["✨", "⭐", "🎉", "❄️", "✨", "🎊", "⭐", "❄️"];
  return (
    <div aria-hidden className="pointer-events-none absolute -inset-4">
      {items.map((s, i) => (
        <span
          key={i}
          className="animate-twinkle absolute text-2xl"
          style={{ left: `${(i * 37) % 95}%`, top: `${(i * 53) % 95}%`, animationDelay: `${i * 0.3}s` }}
        >
          {s}
        </span>
      ))}
    </div>
  );
}
