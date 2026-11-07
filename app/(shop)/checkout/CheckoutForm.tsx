"use client";

import { useState } from "react";

export default function CheckoutForm({ price, mock }: { price: number; mock: boolean }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Что-то пошло не так");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8">
      <label htmlFor="email" className="text-sm font-semibold text-snow/80">
        Email
      </label>
      <input
        id="email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="mt-2 w-full rounded-2xl bg-white/10 px-4 py-3 text-lg outline-none ring-1 ring-white/15 placeholder:text-snow/40 focus:ring-2 focus:ring-gold"
      />
      {error && <p className="mt-3 text-sm text-berry">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-gold px-6 py-4 text-lg font-bold text-night hover:brightness-110 disabled:opacity-50"
      >
        {loading ? "Переходим к оплате…" : `Оплатить ${price} ₽`}
      </button>
      {mock && (
        <p className="mt-4 rounded-xl bg-white/5 px-3 py-2 text-center text-xs text-snow/60">
          Тестовый режим: оплата пройдёт автоматически, без списания денег.
        </p>
      )}
    </form>
  );
}
