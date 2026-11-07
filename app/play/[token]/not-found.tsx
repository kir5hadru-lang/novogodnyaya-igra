import Link from "next/link";

export default function NotFound() {
  return (
    <div className="animate-rise rounded-3xl bg-night-2/80 p-8 text-center ring-1 ring-white/10 backdrop-blur">
      <div className="text-5xl">🥶</div>
      <h1 className="mt-4 font-display text-2xl font-bold">Игра не найдена</h1>
      <p className="mt-2 text-snow/70">Проверьте ссылку из письма — возможно, она скопировалась не целиком.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-gold px-6 py-3 font-bold text-night">
        На главную
      </Link>
    </div>
  );
}
