"use client";

import { useState } from "react";
import { PrimaryButton } from "../ui";

type Phase = "write" | "burn" | "done";

// Традиция: написать желание на бумажке и сжечь под бой курантов.
// Текст желания никуда не отправляется и не сохраняется.
export default function WishRitual({ onDone }: { onDone: () => void }) {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("write");

  function burn() {
    setPhase("burn");
    setTimeout(() => setPhase("done"), 2200);
  }

  return (
    <div className="text-center">
      <h2 className="font-display text-2xl font-bold">Загадай желание</h2>
      <p className="mt-1 text-snow/70">
        {phase === "done" ? "Желание отправлено куда надо ✨" : "Напиши на бумажке и сожги — как под куранты. Мы не подсматриваем."}
      </p>

      <div className="relative mx-auto mt-5 h-56 max-w-xs">
        {phase !== "done" && (
          <div
            className="absolute inset-0 rotate-[-1.5deg] rounded-md bg-[#fdf6e3] p-4 text-left text-night shadow-xl"
            style={phase === "burn" ? { animation: "burn 2.1s ease-in forwards" } : undefined}
          >
            <div className="h-full bg-[repeating-linear-gradient(transparent,transparent_27px,#d8cfb8_28px)]">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={phase !== "write"}
                maxLength={200}
                placeholder="Хочу, чтобы…"
                className="h-full w-full resize-none bg-transparent text-lg leading-7 outline-none placeholder:text-night/40"
                style={{ fontFamily: "'Comic Sans MS', 'Segoe Print', cursive" }}
              />
            </div>
          </div>
        )}

        {phase === "burn" &&
          ["🔥", "🔥", "✨", "🔥", "✨", "🔥"].map((f, i) => (
            <span
              key={i}
              className="absolute bottom-6 text-4xl"
              style={{ left: `${10 + i * 15}%`, animation: `flame 1.6s ease-out ${i * 0.15}s both` }}
            >
              {f}
            </span>
          ))}

        {phase === "done" && (
          <div className="animate-pop absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-7xl">🥂</div>
            <p className="mt-4 text-lg">Теперь оно точно сбудется.</p>
            <p className="text-snow/60">Только никому не рассказывай 🤫</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        {phase === "write" && (
          <PrimaryButton onClick={burn} disabled={!text.trim()}>
            Сжечь и загадать 🔥
          </PrimaryButton>
        )}
        {phase === "done" && <PrimaryButton onClick={onDone}>Дальше</PrimaryButton>}
      </div>
    </div>
  );
}
