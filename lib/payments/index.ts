import { config } from "../config";
import { mockProvider } from "./mock";
import { yookassaProvider } from "./yookassa";

export type CreatedPayment = { paymentId: string; confirmationUrl: string };

export interface PaymentProvider {
  create(order: { id: string; email: string; amount: number }): Promise<CreatedPayment>;
}

export function getPaymentProvider(): PaymentProvider {
  return config.paymentProvider === "yookassa" ? yookassaProvider : mockProvider;
}
