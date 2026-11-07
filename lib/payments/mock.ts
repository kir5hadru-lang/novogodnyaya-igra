import type { PaymentProvider } from "./index";

// Заглушка: «оплата» проходит сразу. Работает, только пока PAYMENT_PROVIDER=mock.
export const mockProvider: PaymentProvider = {
  async create(order) {
    return {
      paymentId: `mock_${order.id}`,
      confirmationUrl: `/api/payments/mock?order=${encodeURIComponent(order.id)}`,
    };
  },
};
