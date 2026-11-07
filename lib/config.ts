// Адрес сайта для ссылок в письмах: APP_URL, иначе основной домен проекта на Vercel, иначе localhost.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const config = {
  appUrl: (process.env.APP_URL || (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000")).replace(/\/$/, ""),
  priceRub: Number(process.env.PRICE_RUB ?? 299),
  paymentProvider: process.env.PAYMENT_PROVIDER ?? "mock",
};
