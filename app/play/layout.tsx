import Snowfall from "@/components/Snowfall";

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-[radial-gradient(ellipse_at_top,_#1d3270_0%,_#0b1530_60%)]">
      <Snowfall count={50} />
      <main className="relative mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-4 py-10">
        {children}
      </main>
    </div>
  );
}
