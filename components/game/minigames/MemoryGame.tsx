"use client";

import { useEffect, useMemo, useState } from "react";
import { PrimaryButton } from "../ui";

export default function MemoryGame({ emojis, onDone }: { emojis: string[]; onDone: () => void }) {
  const cards = useMemo(() => {
    const deck = [...emojis, ...emojis];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }, [emojis]);

  const [open, setOpen] = useState<number[]>([]);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (open.length !== 2) return;
    const [a, b] = open;
    if (cards[a] === cards[b]) {
      setFound((f) => new Set(f).add(cards[a]));
      setOpen([]);
      return;
    }
    const t = setTimeout(() => setOpen([]), 750);
    return () => clearTimeout(t);
  }, [open, cards]);

  function flip(i: number) {
    if (open.length === 2 || open.includes(i) || found.has(cards[i])) return;
    if (open.length === 1) setMoves((m) => m + 1);
    setOpen((o) => [...o, i]);
  }

  const won = found.size === emojis.length;

  return (
    <div className="text-center">
      <h2 className="font-display text-2xl font-bold">Найди пары</h2>
      <p className="mt-1 text-snow/70">
        {won ? `Готово за ${moves} ходов! Память — огонь 🔥` : `Открывай по две карточки. Найдено ${found.size} из ${emojis.length}`}
      </p>

      <div className="mx-auto mt-5 grid max-w-sm grid-cols-4 gap-2">
        {cards.map((emoji, i) => {
          const shown = open.includes(i) || found.has(emoji);
          return (
            <button
              key={i}
              onClick={() => flip(i)}
              aria-label={shown ? emoji : "Закрытая карточка"}
              className="aspect-square [perspective:600px]"
            >
              <span
                className="relative block h-full w-full transition-transform duration-300 [transform-style:preserve-3d]"
                style={{ transform: shown ? "rotateY(180deg)" : "none" }}
              >
                <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-berry to-[#a8243a] text-2xl ring-1 ring-white/20 [backface-visibility:hidden]">
                  ❄️
                </span>
                <span
                  className={`absolute inset-0 flex items-center justify-center rounded-xl text-3xl [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    found.has(emoji) ? "bg-pine/40 ring-2 ring-pine" : "bg-snow/90"
                  }`}
                >
                  {emoji}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {won && (
        <div className="animate-rise mt-6">
          <PrimaryButton onClick={onDone}>Дальше</PrimaryButton>
        </div>
      )}
    </div>
  );
}
