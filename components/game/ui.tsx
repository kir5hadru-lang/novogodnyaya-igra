import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-3xl bg-night-2/80 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur sm:p-8">
      {children}
    </div>
  );
}

export function PrimaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-full bg-gold px-6 py-3 font-bold text-night shadow-lg shadow-gold/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 ${props.className ?? ""}`}
    />
  );
}

export function OptionButton({
  active,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { active: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      {...rest}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left ring-1 transition disabled:opacity-40 ${
        active ? "bg-gold/20 ring-2 ring-gold" : "bg-white/5 ring-white/10 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}
