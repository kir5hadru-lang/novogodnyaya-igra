import { randomBytes } from "node:crypto";
import { config } from "./config";
import { db } from "./db";
import { sendGameLink } from "./email/send";

/**
 * Отмечает заказ оплаченным, создаёт игру и отправляет письмо.
 * Можно вызывать повторно (например, если вебхук пришёл дважды) — письмо уйдёт один раз.
 */
export async function fulfillOrder(orderId: string) {
  const order = await db.order.update({
    where: { id: orderId },
    data: { status: "paid" },
    include: { game: true },
  });

  const game =
    order.game ??
    (await db.game.create({
      data: { orderId: order.id, token: randomBytes(24).toString("base64url") },
    }));

  // Атомарно «забираем» отправку, чтобы два параллельных вебхука не отправили два письма.
  const claimed = await db.game.updateMany({
    where: { id: game.id, emailSent: false },
    data: { emailSent: true },
  });
  if (claimed.count === 0) return game;

  try {
    await sendGameLink(order.email, `${config.appUrl}/play/${game.token}`);
  } catch (e) {
    await db.game.update({ where: { id: game.id }, data: { emailSent: false } });
    throw e;
  }
  return game;
}
