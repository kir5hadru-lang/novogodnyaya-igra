"use client";

import { useEffect, useState } from "react";
import { INTERESTS, MAX_INTERESTS, MAX_NAME, VIBES, WISHES, YEARS } from "@/lib/scenario/questions";
import type { Answers, Interest, Vibe, Wish, Year } from "@/lib/scenario/types";
import { Card, OptionButton, PrimaryButton } from "./ui";

type Props = { onDone: (a: Answers) => void; saving: boolean; error: string; demo: boolean };

const STEPS = 6;
const AUTO_NEXT_MS = 900;

export default function Quiz({ onDone, saving, error, demo }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [year, setYear] = useState<Year | null>(null);
  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [wish, setWish] = useState<Wish | null>(null);
  const [from, setFrom] = useState("");
  const [reaction, setReaction] = useState<string | null>(null);

  const n = name.trim();
  const isLast = step === STEPS - 1;

  // После выбора варианта показываем реакцию и сами листаем дальше.
  useEffect(() => {
    if (!reaction) return;
    const t = setTimeout(() => {
      setReaction(null);
      setStep((s) => s + 1);
    }, AUTO_NEXT_MS);
    return () => clearTimeout(t);
  }, [reaction]);

  function choose<T>(set: (v: T) => void, value: T, text: string) {
    if (reaction) return;
    set(value);
    setReaction(text);
  }

  function next() {
    if (step === 0 && !n) return;
    if (isLast) {
      onDone({ name: n, year: year!, vibe: vibe!, interests, wish: wish!, from: from.trim() });
      return;
    }
    setStep(step + 1);
  }

  function toggleInterest(i: Interest) {
    setInterests((cur) =>
      cur.includes(i) ? cur.filter((x) => x !== i) : cur.length < MAX_INTERESTS ? [...cur, i] : cur,
    );
  }

  return (
    <Card>
      {demo && (
        <p className="mb-4 rounded-xl bg-gold/15 px-3 py-2 text-center text-sm text-gold">
          Демо: ответы нигде не сохраняются
        </p>
      )}

      <div className="mb-6 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gold transition-all duration-500"
            style={{ width: `${((step + (reaction ? 1 : 0)) / STEPS) * 100}%` }}
          />
        </div>
        <span className="text-sm tabular-nums text-snow/50">
          {step + 1}/{STEPS}
        </span>
      </div>

      <form
        key={step}
        className="animate-rise"
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
      >
        {step === 0 && (
          <>
            <Title emoji="👋" text="Привет! Как тебя зовут?" hint="Можно так, как зовут друзья" />
            <input
              autoFocus
              value={name}
              maxLength={MAX_NAME}
              onChange={(e) => setName(e.target.value)}
              placeholder="Имя"
              className="w-full rounded-2xl bg-white/10 px-4 py-4 text-center text-xl outline-none ring-1 ring-white/15 placeholder:text-snow/30 focus:ring-2 focus:ring-gold"
            />
          </>
        )}

        {step === 1 && (
          <>
            <Title emoji="📆" text={`${n}, каким был твой год?`} hint="Честно-честно" />
            <Options>
              {YEARS.map((o) => (
                <OptionButton key={o.value} active={year === o.value} onClick={() => choose(setYear, o.value, o.reaction)}>
                  <span className="text-2xl">{o.emoji}</span>
                  <span className="font-semibold">{o.label}</span>
                </OptionButton>
              ))}
            </Options>
          </>
        )}

        {step === 2 && (
          <>
            <Title emoji="🌙" text="Идеальное 31 декабря — это…" />
            <Options>
              {VIBES.map((o) => (
                <OptionButton key={o.value} active={vibe === o.value} onClick={() => choose(setVibe, o.value, o.reaction)}>
                  <span className="text-2xl">{o.emoji}</span>
                  <span className="font-semibold">{o.label}</span>
                </OptionButton>
              ))}
            </Options>
          </>
        )}

        {step === 3 && (
          <>
            <Title emoji="💛" text="Что тебя радует?" hint={`Выбери до ${MAX_INTERESTS} — из этого соберём игру`} />
            <div className="grid grid-cols-2 gap-2">
              {INTERESTS.map((i) => (
                <OptionButton
                  key={i.value}
                  active={interests.includes(i.value)}
                  disabled={!interests.includes(i.value) && interests.length >= MAX_INTERESTS}
                  onClick={() => toggleInterest(i.value)}
                >
                  <span className="text-xl">{i.emoji}</span>
                  <span className="text-sm font-semibold">{i.label}</span>
                </OptionButton>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <Title emoji="🌠" text="Чего хочется в новом году больше всего?" />
            <Options>
              {WISHES.map((o) => (
                <OptionButton key={o.value} active={wish === o.value} onClick={() => choose(setWish, o.value, o.reaction)}>
                  <span className="text-2xl">{o.emoji}</span>
                  <span className="font-semibold">{o.label}</span>
                </OptionButton>
              ))}
            </Options>
          </>
        )}

        {step === 5 && (
          <>
            <Title emoji="✍️" text="Подпиши открытку" hint="Например, «Дима» или «вся семья». Можно пропустить" />
            <input
              autoFocus
              value={from}
              maxLength={MAX_NAME}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="От кого"
              className="w-full rounded-2xl bg-white/10 px-4 py-4 text-center text-xl outline-none ring-1 ring-white/15 placeholder:text-snow/30 focus:ring-2 focus:ring-gold"
            />
          </>
        )}

        <div className="mt-5 h-7 text-center">
          {reaction && <p className="animate-pop font-semibold text-gold">{reaction}</p>}
          {error && <p className="text-sm text-berry">{error}</p>}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className={`rounded-full px-4 py-3 text-snow/60 hover:text-snow ${step === 0 || reaction ? "invisible" : ""}`}
          >
            ← Назад
          </button>
          {[0, 3, 5].includes(step) && (
            <PrimaryButton type="submit" disabled={(step === 0 && !n) || saving}>
              {saving ? "Собираем игру…" : isLast ? "Поехали! 🎄" : step === 3 && !interests.length ? "Пропустить" : "Дальше"}
            </PrimaryButton>
          )}
        </div>
      </form>
    </Card>
  );
}

function Options({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-2">{children}</div>;
}

function Title({ emoji, text, hint }: { emoji: string; text: string; hint?: string }) {
  return (
    <div className="mb-5 text-center">
      <div className="text-5xl">{emoji}</div>
      <h2 className="mt-3 font-display text-2xl font-bold leading-snug">{text}</h2>
      {hint && <p className="mt-1 text-sm text-snow/60">{hint}</p>}
    </div>
  );
}
