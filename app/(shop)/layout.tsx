import Link from "next/link";
import Snowfall from "@/components/Snowfall";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <Snowfall count={30} />
      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="text-2xl">🎄</span> Ёлка-квест
        </Link>
        <Link href="/checkout" className="rounded-full bg-gold px-4 py-2 text-sm font-bold text-night hover:brightness-110">
          Заказать
        </Link>
      </header>
      <div className="relative z-10">{children}</div>
      <footer className="relative z-10 mx-auto max-w-5xl px-4 py-10 text-center text-sm text-snow/50">
        © {new Date().getFullYear()} Ёлка-квест · Новогодние игры-поздравления
      </footer>
    </div>
  );
}
