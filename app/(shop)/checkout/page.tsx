import { config } from "@/lib/config";
import CheckoutForm from "./CheckoutForm";

export const metadata = { title: "Заказать игру · Ёлка-квест" };

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-3xl bg-night-2/80 p-8 ring-1 ring-white/10 backdrop-blur">
        <div className="text-center text-5xl">📧</div>
        <h1 className="mt-4 text-center font-display text-3xl font-bold">Куда отправить игру?</h1>
        <p className="mt-2 text-center text-snow/70">
          После оплаты на эту почту придёт ссылка на вашу игру.
        </p>
        <CheckoutForm price={config.priceRub} mock={config.paymentProvider === "mock"} />
      </div>
    </main>
  );
}
