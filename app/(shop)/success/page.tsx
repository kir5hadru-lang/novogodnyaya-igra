import Link from "next/link";
import { config } from "@/lib/config";

export const metadata = { title: "Спасибо за заказ · Ёлка-квест" };

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ play?: string }> }) {
  const { play } = await searchParams;
  // Ссылку показываем только в тестовом режиме. При настоящей оплате она приходит на почту.
  const testLink = config.paymentProvider === "mock" && play ? `/play/${encodeURIComponent(play)}` : null;

  return (
    <main className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="rounded-3xl bg-night-2/80 p-8 ring-1 ring-white/10 backdrop-blur">
        <div className="text-6xl">🎉</div>
        <h1 className="mt-4 font-display text-3xl font-bold">Спасибо за заказ!</h1>
        <p className="mt-3 text-snow/75">
          Ссылка на игру уже летит к вам на почту. Если письма нет в течение пары минут — загляните в «Спам».
        </p>
        {testLink && (
          <div className="mt-6 rounded-2xl bg-gold/10 p-4 ring-1 ring-gold/40">
            <p className="text-sm text-gold">Тестовый режим: вот ваша ссылка</p>
            <Link href={testLink} className="mt-3 inline-block rounded-full bg-gold px-6 py-3 font-bold text-night hover:brightness-110">
              Открыть игру 🎄
            </Link>
          </div>
        )}
        <Link href="/" className="mt-8 inline-block rounded-full px-6 py-3 ring-1 ring-white/25 hover:bg-white/10">
          На главную
        </Link>
      </div>
    </main>
  );
}
