"use client";

import { useEffect, useRef, useState } from "react";
import { PrimaryButton } from "../ui";

const GOAL = 12;
const SECONDS = 30;
const BAD = "🧊";
const BASKET_W = 64;

type Item = { id: number; x: number; y: number; v: number; emoji: string; bad: boolean };
type Phase = "ready" | "play" | "won" | "timeout";

export default function CatchGame({ items, onDone }: { items: string[]; onDone: () => void }) {
  const area = useRef<HTMLDivElement>(null);
  const state = useRef({ items: [] as Item[], basket: 0.5, score: 0, time: SECONDS, spawn: 0, id: 0 });
  const [phase, setPhase] = useState<Phase>("ready");
  const [, setTick] = useState(0);
  const [hit, setHit] = useState<"good" | "bad" | null>(null);

  useEffect(() => {
    if (phase !== "play") return;
    let raf = 0;
    let last = performance.now();
    const s = state.current;

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const el = area.current;
      if (!el) return;
      const W = el.clientWidth;
      const H = el.clientHeight;

      s.time -= dt;
      s.spawn -= dt;
      if (s.spawn <= 0) {
        s.spawn = 0.45 + Math.random() * 0.35;
        const bad = Math.random() < 0.22;
        s.items.push({
          id: s.id++,
          x: 0.08 + Math.random() * 0.84,
          y: -40,
          v: 150 + Math.random() * 110 + (SECONDS - s.time) * 4,
          emoji: bad ? BAD : items[Math.floor(Math.random() * items.length)],
          bad,
        });
      }

      const basketY = H - 56;
      s.items = s.items.filter((it) => {
        it.y += it.v * dt;
        const caught = it.y > basketY - 24 && it.y < basketY + 16 && Math.abs(it.x * W - s.basket * W) < BASKET_W / 2 + 10;
        if (caught) {
          s.score = it.bad ? Math.max(0, s.score - 2) : s.score + 1;
          setHit(it.bad ? "bad" : "good");
          return false;
        }
        return it.y < H + 40;
      });

      if (s.score >= GOAL) return setPhase("won");
      if (s.time <= 0) return setPhase("timeout");
      setTick((t) => t + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase, items]);

  useEffect(() => {
    if (!hit) return;
    const t = setTimeout(() => setHit(null), 250);
    return () => clearTimeout(t);
  }, [hit]);

  useEffect(() => {
    if (phase !== "play") return;
    const onKey = (e: KeyboardEvent) => {
      const s = state.current;
      if (e.key === "ArrowLeft") s.basket = Math.max(0.05, s.basket - 0.07);
      if (e.key === "ArrowRight") s.basket = Math.min(0.95, s.basket + 0.07);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  function move(e: React.PointerEvent) {
    const r = area.current?.getBoundingClientRect();
    if (!r) return;
    state.current.basket = Math.min(0.95, Math.max(0.05, (e.clientX - r.left) / r.width));
  }

  function start() {
    state.current = { items: [], basket: 0.5, score: 0, time: SECONDS, spawn: 0, id: 0 };
    setPhase("play");
  }

  const s = state.current;
  const preview = items.slice(0, 5).join(" ");

  return (
    <div className="text-center">
      <h2 className="font-display text-2xl font-bold">Лови подарки</h2>
      <p className="mt-1 text-snow/70">
        Води корзинкой пальцем или мышкой. Собери {GOAL}, а ледышки {BAD} не трогай.
      </p>

      <div
        ref={area}
        onPointerMove={move}
        onPointerDown={move}
        className="relative mt-4 h-[380px] touch-none select-none overflow-hidden rounded-2xl bg-gradient-to-b from-[#1d3270] to-[#0e1a3d] ring-1 ring-white/10"
      >
        {phase === "play" && (
          <>
            <div className="absolute left-3 top-3 rounded-full bg-black/30 px-3 py-1 text-sm font-bold">
              🎁 {s.score}/{GOAL}
            </div>
            <div className="absolute right-3 top-3 rounded-full bg-black/30 px-3 py-1 text-sm font-bold tabular-nums">
              ⏱ {Math.max(0, Math.ceil(s.time))}
            </div>
            {s.items.map((it) => (
              <span
                key={it.id}
                className="absolute text-3xl"
                style={{ left: `${it.x * 100}%`, top: 0, transform: `translate(-50%, ${it.y}px)` }}
              >
                {it.emoji}
              </span>
            ))}
            <div
              className={`absolute bottom-3 flex h-12 items-end justify-center text-5xl ${hit === "bad" ? "animate-shake" : ""}`}
              style={{ left: `calc(${s.basket * 100}% - ${BASKET_W / 2}px)`, width: BASKET_W }}
            >
              🧺
              {hit === "good" && <span className="animate-pop absolute -top-6 text-lg font-bold text-gold">+1</span>}
              {hit === "bad" && <span className="animate-pop absolute -top-6 text-lg font-bold text-berry">−2</span>}
            </div>
          </>
        )}

        {phase !== "play" && (
          <div className="animate-rise absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
            {phase === "ready" && (
              <>
                <div className="text-4xl">{preview}</div>
                <PrimaryButton onClick={start}>Старт!</PrimaryButton>
              </>
            )}
            {phase === "won" && (
              <>
                <div className="text-6xl">🧺✨</div>
                <p className="text-xl font-bold">Все подарки спасены!</p>
                <PrimaryButton onClick={onDone}>Дальше</PrimaryButton>
              </>
            )}
            {phase === "timeout" && (
              <>
                <div className="text-6xl">🎅</div>
                <p className="text-xl font-bold">Собрано {s.score} из {GOAL}</p>
                <p className="text-snow/70">Дед Мороз всё равно засчитал. Он сегодня добрый.</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button onClick={start} className="rounded-full px-5 py-3 ring-1 ring-white/25 hover:bg-white/10">
                    Ещё раз
                  </button>
                  <PrimaryButton onClick={onDone}>Дальше</PrimaryButton>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
