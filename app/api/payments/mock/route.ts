import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import { db } from "@/lib/db";
import { fulfillOrder } from "@/lib/orders";

// Имитация успешной оплаты. Отключается, как только PAYMENT_PROVIDER != mock.
export async function GET(req: Request) {
  if (config.paymentProvider !== "mock") return new NextResponse("Not found", { status: 404 });

  const orderId = new URL(req.url).searchParams.get("order") ?? "";
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) return new NextResponse("Заказ не найден", { status: 404 });

  const game = await fulfillOrder(order.id);
  // В тестовом режиме писем может не быть, поэтому ссылку сразу показываем на странице.
  return NextResponse.redirect(new URL(`/success?play=${encodeURIComponent(game.token)}`, req.url), 303);
}
