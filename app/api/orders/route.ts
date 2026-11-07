import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import { db } from "@/lib/db";
import { getPaymentProvider } from "@/lib/payments";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Проверьте адрес почты" }, { status: 400 });
  }

  const order = await db.order.create({ data: { email, amount: config.priceRub * 100 } });

  try {
    const payment = await getPaymentProvider().create(order);
    await db.order.update({ where: { id: order.id }, data: { paymentId: payment.paymentId } });
    return NextResponse.json({ url: payment.confirmationUrl });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Не удалось создать платёж, попробуйте ещё раз" }, { status: 502 });
  }
}
