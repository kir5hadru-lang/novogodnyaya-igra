# Ёлка-квест — новогодняя игра-поздравление

Один сайт на Next.js:

| Роут | Что там |
|---|---|
| `/` | Лендинг |
| `/checkout` | Ввод почты и переход к оплате |
| `/success` | «Ссылка отправлена на почту» |
| `/play/<token>` | Игра: мини-тест → сцены → поздравление |
| `/play/demo` | Демо без оплаты (ничего не сохраняет) |

## Запуск локально

```bash
npm install
cp .env.example .env
npx prisma db push
npm run dev
```

В режиме `PAYMENT_PROVIDER=mock` оплата проходит сразу. Пока не задан `RESEND_API_KEY`, письмо не отправляется, а ссылка на игру печатается в консоль сервера.

## Где что менять

- Вопросы теста: `lib/scenario/questions.ts`
- Тексты сцен и поздравлений: `lib/scenario/templates.ts`
- Как из ответов собирается игра: `lib/scenario/build.ts` (тесты: `npm test`)
- Цена: `PRICE_RUB` в `.env`

## Запуск в продакшен (Vercel)

1. База: в `prisma/schema.prisma` поменять `provider` на `"postgresql"`, подключить Vercel Postgres или Supabase и задать `DATABASE_URL`.
2. Почта: зарегистрироваться в Resend, подтвердить свой домен и задать `RESEND_API_KEY` и `EMAIL_FROM`.
3. Оплата: в ЮKassa получить `shopId` и секретный ключ, задать `PAYMENT_PROVIDER=yookassa`, `YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY`. В личном кабинете указать вебхук `https://<домен>/api/payments/webhook` на событие `payment.succeeded`. Если чеки по 54-ФЗ не нужны, убрать блок `receipt` в `lib/payments/yookassa.ts`.
4. `APP_URL=https://<домен>` — из него строится ссылка в письме.
