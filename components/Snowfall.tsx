"use client";

import { useEffect, useState } from "react";

type Flake = { left: number; size: number; duration: number; delay: number; drift: number };

// Лёгкий снегопад на CSS, генерируется только на клиенте, чтобы не было рассинхрона гидрации.
export default function Snowfall({ count = 40 }: { count?: number }) {
  const [flakes, setFlakes] = useState<Flake[]>([]);

  useEffect(() => {
    setFlakes(
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 8 + Math.random() * 10,
        delay: -Math.random() * 18,
        drift: -30 + Math.random() * 60,
      })),
    );
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {flakes.map((f, i) => (
        <span
          key={i}
          className="absolute top-0 rounded-full bg-white/80"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            animation: `fall ${f.duration}s linear ${f.delay}s infinite`,
            ["--drift" as string]: `${f.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
