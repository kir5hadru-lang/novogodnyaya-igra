import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fulfillOrder } from "@/lib/orders";
import { fetchYooPayment } from "@/lib/payments/yookassa";

// Вебхук ЮKassa. Указать в личном кабинете: https://<домен>/api/payments/webhook, событие payment.succeeded.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const paymentId: unknown = body?.object?.id;
  if (body?.event !== "payment.succeeded" || typeof paymentId !== "string") {
    return NextResponse.json({ ok: true });
  }

  // Перепроверяем статус через API, чтобы поддельный запрос не выдал игру бесплатно.
  const payment = await fetchYooPayment(paymentId);
  if (payment.status !== "succeeded") return NextResponse.json({ ok: true });

  const order = await db.order.findUnique({ where: { paymentId } });
  if (!order) return NextResponse.json({ ok: true });

  await fulfillOrder(order.id);
  return NextResponse.json({ ok: true });
}
