"use client";

import { useEffect, useState } from "react";

const TAPS = 6;
const HINTS = ["Тапни по подарку", "Ещё!", "Лента поддаётся…", "Почти!", "Ну же!", "Последний раз!"];
const BURST = ["🎉", "✨", "🎊", "⭐", "❄️", "💛", "🎉", "✨", "🎊", "⭐", "❄️", "💛"];

export default function GiftUnwrap({ text, onDone }: { text: string; onDone: () => void }) {
  const [taps, setTaps] = useState(0);
  const opened = taps >= TAPS;

  useEffect(() => {
    if (!opened) return;
    const t = setTimeout(onDone, 1300);
    return () => clearTimeout(t);
  }, [opened, onDone]);

  return (
    <div className="text-center">
      <p className="text-lg leading-relaxed">{text}</p>
      <button
        onClick={() => !opened && setTaps((t) => t + 1)}
        aria-label="Открыть подарок"
        className="relative mx-auto mt-6 block h-52 w-52 select-none"
      >
        {!opened ? (
          <span
            key={taps}
            className={`block text-[150px] leading-none ${taps ? "animate-wiggle" : "animate-twinkle"}`}
            style={{ transform: `scale(${1 + taps * 0.05})` }}
          >
            🎁
          </span>
        ) : (
          <>
            <span className="animate-pop block text-[120px] leading-none">💌</span>
            {BURST.map((e, i) => {
              const a = (i / BURST.length) * Math.PI * 2;
              return (
                <span
                  key={i}
                  className="absolute left-1/2 top-1/2 text-3xl"
                  style={{
                    animation: "burst 1s ease-out both",
                    ["--dx" as string]: `${Math.cos(a) * 130}px`,
                    ["--dy" as string]: `${Math.sin(a) * 130}px`,
                  }}
                >
                  {e}
                </span>
              );
            })}
          </>
        )}
      </button>
      {!opened && (
        <div className="mt-2">
          <p className="font-semibold text-gold">{HINTS[taps]}</p>
          <div className="mx-auto mt-3 h-2 max-w-[180px] overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-gold transition-all" style={{ width: `${(taps / TAPS) * 100}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
