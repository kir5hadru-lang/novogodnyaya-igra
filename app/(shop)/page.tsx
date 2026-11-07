import Link from "next/link";
import { config } from "@/lib/config";

const STEPS = [
  { emoji: "📧", title: "Укажите почту", text: "Оплатите заказ — ссылка на игру сразу придёт на email." },
  { emoji: "📝", title: "Ответьте на 6 вопросов", text: "Каким был год, как вы любите встречать праздник и что вас радует. Меньше минуты." },
  { emoji: "🎮", title: "Играйте и дарите", text: "Игра соберётся под ответы. Ссылку можно переслать кому угодно." },
];

const FEATURES = [
  { emoji: "🎄", text: "Нарядить ёлку и зажечь гирлянду" },
  { emoji: "🧺", text: "Поймать подарки — с вашими любимыми вещами" },
  { emoji: "🃏", text: "Найти пары в новогодней метели" },
  { emoji: "🔥", text: "Написать желание и сжечь, как под куранты" },
  { emoji: "🎁", text: "Распаковать подарок с личной открыткой" },
  { emoji: "📱", text: "Всё в браузере, на телефоне и компьютере" },
];

const FAQ = [
  {
    q: "Когда придёт ссылка?",
    a: "Сразу после оплаты. Если письма нет — проверьте папку «Спам» или напишите нам.",
  },
  { q: "Можно ли подарить игру другу?", a: "Да. Просто перешлите ссылку из письма — тест может пройти он сам или вы за него." },
  { q: "Можно ли пройти тест заново?", a: "Да, в конце игры есть кнопка «Пройти тест заново»." },
  { q: "Нужно ли что-то устанавливать?", a: "Нет, игра открывается в обычном браузере." },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4">
      <section className="py-16 text-center sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">Новый год 2027</p>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-6xl">
          Новогодняя игра-поздравление, которая собирается под человека
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-snow/75">
          Маленькая уютная игра на пять минут: ёлка, подарки, загаданное желание и тёплая открытка в конце.
          Каждая собирается под конкретного человека.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/checkout" className="rounded-full bg-gold px-7 py-4 text-lg font-bold text-night shadow-lg shadow-gold/20 hover:brightness-110">
            Получить игру за {config.priceRub} ₽
          </Link>
          <Link href="/play/demo" className="rounded-full px-7 py-4 text-lg font-semibold ring-1 ring-white/25 hover:bg-white/10">
            Попробовать демо
          </Link>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-center font-display text-3xl font-bold">Как это работает</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="rounded-3xl bg-night-2/70 p-6 ring-1 ring-white/10">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{s.emoji}</span>
                <span className="text-sm font-bold text-gold">Шаг {i + 1}</span>
              </div>
              <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-snow/70">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-center font-display text-3xl font-bold">Что внутри</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.text} className="flex items-center gap-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
              <span className="text-3xl">{f.emoji}</span>
              <span className="text-lg">{f.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-md rounded-3xl bg-gradient-to-b from-night-2 to-night p-8 text-center ring-2 ring-gold/60">
          <div className="text-5xl">🎁</div>
          <h2 className="mt-4 font-display text-2xl font-bold">Одна игра</h2>
          <p className="mt-2 font-display text-5xl font-extrabold text-gold">{config.priceRub} ₽</p>
          <ul className="mt-6 space-y-2 text-left text-snow/80">
            <li>✓ Персональный сценарий</li>
            <li>✓ Ссылка на почту сразу после оплаты</li>
            <li>✓ Можно переслать и подарить</li>
          </ul>
          <Link href="/checkout" className="mt-8 block rounded-full bg-gold px-6 py-4 font-bold text-night hover:brightness-110">
            Заказать
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-2xl py-12">
        <h2 className="text-center font-display text-3xl font-bold">Вопросы</h2>
        <div className="mt-8 space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
              <summary className="cursor-pointer list-none font-semibold marker:hidden">
                <span className="mr-2 inline-block transition group-open:rotate-90">›</span>
                {f.q}
              </summary>
              <p className="mt-3 text-snow/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
