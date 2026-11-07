"use client";

import { useRef, useState } from "react";
import { PrimaryButton } from "../ui";

const GOAL = 8;
const COLORS = ["#e2445c", "#f5c35b", "#4ea8ff", "#c77dff", "#ff8a3d", "#f4f7ff"];

// Ёлка из трёх ярусов (координаты во viewBox 200×240).
const TIERS: [number, number][][] = [
  [[100, 20], [55, 95], [145, 95]],
  [[100, 60], [35, 150], [165, 150]],
  [[100, 105], [15, 205], [185, 205]],
];

const LIGHTS = [
  [80, 70], [118, 78], [65, 118], [100, 112], [138, 124], [50, 170], [82, 162], [118, 176], [150, 166], [100, 190],
];

function inTriangle(px: number, py: number, [[x1, y1], [x2, y2], [x3, y3]]: [number, number][]) {
  const d = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number) =>
    (ax - cx) * (by - cy) - (bx - cx) * (ay - cy);
  const d1 = d(px, py, x1, y1, x2, y2);
  const d2 = d(px, py, x2, y2, x3, y3);
  const d3 = d(px, py, x3, y3, x1, y1);
  return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
}

type Ball = { x: number; y: number; color: string };

export default function TreeGame({ onDone }: { onDone: () => void }) {
  const svg = useRef<SVGSVGElement>(null);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [color, setColor] = useState(COLORS[0]);
  const [lit, setLit] = useState(false);
  const [miss, setMiss] = useState(0);

  function place(e: React.PointerEvent<SVGSVGElement>) {
    if (lit || balls.length >= GOAL || !svg.current) return;
    const r = svg.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 200;
    const y = ((e.clientY - r.top) / r.height) * 240;
    if (!TIERS.some((t) => inTriangle(x, y, t))) {
      setMiss((m) => m + 1);
      return;
    }
    setBalls((b) => [...b, { x, y, color }]);
    setColor(COLORS[(COLORS.indexOf(color) + 1) % COLORS.length]);
  }

  const done = balls.length >= GOAL;

  return (
    <div className="text-center">
      <h2 className="font-display text-2xl font-bold">Наряди ёлку</h2>
      <p className="mt-1 text-snow/70">
        {lit ? "Вот теперь — красота 🥹" : done ? "Осталось включить гирлянду" : `Тапай по ёлке — вешай шарики. ${balls.length} из ${GOAL}`}
      </p>

      <svg
        ref={svg}
        viewBox="0 0 200 240"
        onPointerDown={place}
        className={`mx-auto mt-4 w-full max-w-[300px] select-none touch-none ${done ? "" : "cursor-pointer"}`}
        role="img"
        aria-label="Ёлка"
      >
        <rect x="88" y="203" width="24" height="28" rx="3" fill="#7a4a2a" />
        {TIERS.map((t, i) => (
          <polygon key={i} points={t.map((p) => p.join(",")).join(" ")} fill={["#2fa36b", "#25915e", "#1f8a5b"][i]} />
        ))}

        {lit &&
          LIGHTS.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="#ffe9a8"
              className="animate-twinkle"
              style={{ animationDelay: `${(i % 4) * 0.4}s`, filter: "drop-shadow(0 0 4px #ffd36b)" }}
            />
          ))}

        {balls.map((b, i) => (
          <g key={i} className="animate-pop" style={{ transformOrigin: `${b.x}px ${b.y}px`, transformBox: "view-box" }}>
            <line x1={b.x} y1={b.y - 9} x2={b.x} y2={b.y - 6} stroke="#d9d9d9" strokeWidth="1" />
            <circle cx={b.x} cy={b.y} r="6.5" fill={b.color} />
            <circle cx={b.x - 2} cy={b.y - 2} r="1.8" fill="white" opacity="0.6" />
          </g>
        ))}

        <text
          x="100"
          y="26"
          textAnchor="middle"
          fontSize={lit ? 30 : 22}
          className={lit ? "animate-glow" : ""}
          style={{ opacity: lit ? 1 : 0.35, transition: "all .4s" }}
        >
          ⭐
        </text>
      </svg>

      {!done && (
        <div className="mt-3 flex justify-center gap-2" aria-label="Цвет шарика">
          {COLORS.map((c) => (
            <button
              key={c}
              aria-label="Выбрать цвет"
              onClick={() => setColor(c)}
              className={`h-8 w-8 rounded-full ring-2 transition ${c === color ? "scale-110 ring-white" : "ring-transparent"}`}
              style={{ background: c }}
            />
          ))}
        </div>
      )}
      {miss > 2 && !done && <p className="mt-2 text-sm text-snow/50">Шарики висят только на ветках 🙂</p>}

      <div className="mt-6">
        {done && !lit && <PrimaryButton onClick={() => setLit(true)}>Включить гирлянду 💡</PrimaryButton>}
        {lit && <PrimaryButton onClick={onDone}>Дальше</PrimaryButton>}
      </div>
    </div>
  );
}
