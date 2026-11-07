import { randomUUID } from "node:crypto";
import { config } from "../config";
import type { PaymentProvider } from "./index";

const API = "https://api.yookassa.ru/v3";

function auth() {
  const id = process.env.YOOKASSA_SHOP_ID;
  const key = process.env.YOOKASSA_SECRET_KEY;
  if (!id || !key) throw new Error("Не заданы YOOKASSA_SHOP_ID / YOOKASSA_SECRET_KEY");
  return "Basic " + Buffer.from(`${id}:${key}`).toString("base64");
}

export type YooPayment = {
  id: string;
  status: "pending" | "waiting_for_capture" | "succeeded" | "canceled";
  metadata?: { orderId?: string };
};

export const yookassaProvider: PaymentProvider = {
  async create(order) {
    const value = (order.amount / 100).toFixed(2);
    const res = await fetch(`${API}/payments`, {
      method: "POST",
      headers: {
        Authorization: auth(),
        "Idempotence-Key": randomUUID(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: { value, currency: "RUB" },
        capture: true,
        confirmation: { type: "redirect", return_url: `${config.appUrl}/success` },
        description: "Новогодняя игра-поздравление",
        metadata: { orderId: order.id },
        // Чек по 54-ФЗ (нужен, если в ЮKassa подключена онлайн-касса или «Мой налог»).
        receipt: {
          customer: { email: order.email },
          items: [
            {
              description: "Новогодняя игра-поздравление",
              quantity: "1.00",
              amount: { value, currency: "RUB" },
              vat_code: 1,
              payment_mode: "full_payment",
              payment_subject: "service",
            },
          ],
        },
      }),
    });
    if (!res.ok) throw new Error(`ЮKassa: ${res.status} ${await res.text()}`);
    const data = (await res.json()) as { id: string; confirmation: { confirmation_url: string } };
    return { paymentId: data.id, confirmationUrl: data.confirmation.confirmation_url };
  },
};

/** Запрашивает платёж напрямую у ЮKassa — так мы не доверяем телу вебхука вслепую. */
export async function fetchYooPayment(id: string): Promise<YooPayment> {
  const res = await fetch(`${API}/payments/${encodeURIComponent(id)}`, {
    headers: { Authorization: auth() },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`ЮKassa: ${res.status}`);
  return res.json();
}
