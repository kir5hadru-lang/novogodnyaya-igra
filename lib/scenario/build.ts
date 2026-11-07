import { INTERESTS, MAX_INTERESTS, MAX_NAME, VIBES, WISHES, YEARS } from "./questions";
import {
  AFTER_TREE,
  BASE_ITEMS,
  BEFORE_MEMORY,
  BEFORE_WISH,
  FINAL_EMOJI,
  GIFT_TEXT,
  INTEREST_ITEMS,
  INTEREST_WISHES,
  INTROS,
  TITLES,
  VIBE_CLOSINGS,
  WISH_TEXTS,
  YEAR_LINES,
} from "./templates";
import { SCENARIO_VERSION, type Answers, type Scenario, type Step } from "./types";

const MEMORY_PAIRS = 6;

// Детерминированный ГПСЧ: одинаковый seed — одинаковая игра.
function rng(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], rand: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function joinRu(parts: string[]) {
  if (parts.length <= 1) return parts.join("");
  return `${parts.slice(0, -1).join(", ")} и ${parts[parts.length - 1]}`;
}

/** Проверяет ответы из запроса и приводит их к безопасному виду. null — если что-то не так. */
export function parseAnswers(input: unknown): Answers | null {
  if (!input || typeof input !== "object") return null;
  const o = input as Record<string, unknown>;
  const clean = (v: unknown) =>
    typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, MAX_NAME) : "";
  const has = (list: { value: string }[], v: unknown) => list.some((x) => x.value === v);

  const name = clean(o.name);
  if (!name) return null;
  if (!has(YEARS, o.year) || !has(VIBES, o.vibe) || !has(WISHES, o.wish)) return null;
  if (!Array.isArray(o.interests)) return null;
  const interests = [...new Set(o.interests)].filter((i) => has(INTERESTS, i)).slice(0, MAX_INTERESTS);

  return {
    name,
    from: clean(o.from),
    year: o.year as Answers["year"],
    vibe: o.vibe as Answers["vibe"],
    wish: o.wish as Answers["wish"],
    interests: interests as Answers["interests"],
  };
}

export function buildScenario(a: Answers, seed: string): Scenario {
  const rand = rng(seed);
  const fill = (t: string) => t.replaceAll("{name}", a.name).replaceAll("{year}", YEAR_LINES[a.year]);

  const themed = a.interests.flatMap((i) => INTEREST_ITEMS[i]);
  // Для ловли: любимое + немного новогоднего.
  const catchItems = [...new Set([...themed, ...BASE_ITEMS.slice(0, themed.length ? 2 : 6)])];
  // Для карточек: сначала любимое, добиваем новогодним.
  const memoryEmojis = [...new Set([...shuffle(themed, rand), ...shuffle(BASE_ITEMS, rand)])].slice(0, MEMORY_PAIRS);

  const intro = INTROS[a.vibe];
  const steps: Step[] = [
    { kind: "story", emoji: intro.emoji, text: fill(intro.text), button: "Поехали ✨" },
    { kind: "story", emoji: "🎄", text: "Первое дело — ёлка. Стоит голая и грустная. Надо срочно это исправить.", button: "Наряжать!" },
    { kind: "tree" },
    { kind: "story", emoji: "🎅", text: AFTER_TREE[a.vibe], button: "Ловить!" },
    { kind: "catch", items: catchItems },
    { kind: "story", emoji: "🌨️", text: BEFORE_MEMORY, button: "Искать пары" },
    { kind: "memory", emojis: memoryEmojis },
    { kind: "story", emoji: "🥂", text: BEFORE_WISH, button: "Загадать желание" },
    { kind: "wish" },
    { kind: "gift", text: fill(GIFT_TEXT) },
  ];

  const extra = a.interests.length
    ? ` А ещё — побольше ${joinRu(a.interests.map((i) => INTEREST_WISHES[i]))}.`
    : "";

  return {
    version: SCENARIO_VERSION,
    title: TITLES[a.vibe],
    name: a.name,
    vibe: a.vibe,
    steps,
    final: {
      heading: `С Новым годом, ${a.name}! ${FINAL_EMOJI[a.vibe]}`,
      text: `${WISH_TEXTS[a.wish]}${extra} ${VIBE_CLOSINGS[a.vibe]}`,
      signature: a.from ? `С любовью, ${a.from}` : "С Новым годом! 🎄",
    },
  };
}

export function isCurrentScenario(s: unknown): s is Scenario {
  return !!s && typeof s === "object" && (s as Scenario).version === SCENARIO_VERSION;
}
