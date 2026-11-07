import type { Interest, Vibe, Wish, Year } from "./types";

type Option<T> = { value: T; label: string; emoji: string; reaction: string };

export const YEARS: Option<Year>[] = [
  { value: "rollercoaster", emoji: "🎢", label: "Как американские горки", reaction: "То вверх, то вниз. Знакомо 😮‍💨" },
  { value: "rocket", emoji: "🚀", label: "Пролетел — не заметил", reaction: "Тогда сегодня никуда не спешим" },
  { value: "hard", emoji: "🌧️", label: "Долгий и непростой", reaction: "Обнимаю. Дальше будет только тепло" },
  { value: "good", emoji: "🌿", label: "Спокойный и хороший", reaction: "Лучшее, что может быть ✨" },
];

export const VIBES: Option<Vibe>[] = [
  { value: "cozy", emoji: "🛋️", label: "Плед, мандарины и любимый фильм", reaction: "Уже чувствую запах мандаринов 🍊" },
  { value: "party", emoji: "🎉", label: "Шумно, весело и до утра", reaction: "Отлично, музыку погромче 🎶" },
  { value: "family", emoji: "🥗", label: "Большой стол, и все свои", reaction: "И оливье в тазике, конечно" },
  { value: "adventure", emoji: "🏔️", label: "Где-нибудь далеко от дома", reaction: "Рюкзак собран, едем 🎒" },
];

export const INTERESTS: Omit<Option<Interest>, "reaction">[] = [
  { value: "travel", emoji: "✈️", label: "Путешествия" },
  { value: "food", emoji: "🍕", label: "Вкусно поесть" },
  { value: "games", emoji: "🎮", label: "Игры" },
  { value: "music", emoji: "🎧", label: "Музыка" },
  { value: "sport", emoji: "🏂", label: "Спорт" },
  { value: "movies", emoji: "🍿", label: "Кино и сериалы" },
  { value: "work", emoji: "💡", label: "Любимое дело" },
  { value: "pets", emoji: "🐈", label: "Котики и пёсики" },
];

export const WISHES: Option<Wish>[] = [
  { value: "health", emoji: "🔋", label: "Сил и энергии", reaction: "Заряжаем на все 100%" },
  { value: "love", emoji: "🫶", label: "Тепла и близких рядом", reaction: "Самое важное 💛" },
  { value: "money", emoji: "💸", label: "Денег, и побольше", reaction: "Честно и по делу 😄" },
  { value: "adventure", emoji: "🧭", label: "Новых впечатлений", reaction: "Будет что вспомнить" },
  { value: "calm", emoji: "🕊️", label: "Спокойствия", reaction: "Тихо, мирно, хорошо" },
];

export const MAX_INTERESTS = 3;
export const MAX_NAME = 40;
