export const config = {
  appUrl: (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  priceRub: Number(process.env.PRICE_RUB ?? 299),
  paymentProvider: process.env.PAYMENT_PROVIDER ?? "mock",
};
