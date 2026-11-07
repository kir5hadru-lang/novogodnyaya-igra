import { describe, expect, it } from "vitest";
import { buildScenario, isCurrentScenario, parseAnswers } from "./build";
import { INTERESTS, VIBES, WISHES, YEARS } from "./questions";
import type { Answers } from "./types";

const base: Answers = {
  name: "Маша",
  year: "rollercoaster",
  vibe: "cozy",
  interests: ["travel", "pets"],
  wish: "health",
  from: "Дима",
};

describe("buildScenario", () => {
  it("один и тот же seed даёт одну и ту же игру", () => {
    expect(buildScenario(base, "abc")).toEqual(buildScenario(base, "abc"));
  });

  it("в игре есть все мини-игры по порядку", () => {
    const kinds = buildScenario(base, "x").steps.map((s) => s.kind).filter((k) => k !== "story");
    expect(kinds).toEqual(["tree", "catch", "memory", "wish", "gift"]);
  });

  it("карточек для пар всегда 6 и они разные, даже без увлечений", () => {
    for (const interests of [[], ["food"], ["travel", "pets", "music"]] as Answers["interests"][]) {
      const step = buildScenario({ ...base, interests }, "s").steps.find((s) => s.kind === "memory");
      expect(step?.kind === "memory" && new Set(step.emojis).size).toBe(6);
    }
  });

  it("ловим предметы из увлечений", () => {
    const step = buildScenario(base, "s").steps.find((s) => s.kind === "catch");
    expect(step?.kind === "catch" && step.items).toContain("✈️");
  });

  it("ни в одной комбинации не остаётся плейсхолдеров и нет форм вида «(а)»", () => {
    for (const y of YEARS)
      for (const v of VIBES)
        for (const w of WISHES)
          for (const i of INTERESTS) {
            const s = buildScenario(
              { ...base, year: y.value, vibe: v.value, wish: w.value, interests: [i.value] },
              `${y.value}${v.value}${w.value}${i.value}`,
            );
            const json = JSON.stringify(s);
            expect(json).not.toMatch(/\{name\}|\{year\}|\(а\)|\(ась\)|\(на\)/);
            expect(json).toContain("Маша");
          }
  });

  it("пожелания по увлечениям склеиваются по-русски", () => {
    const s = buildScenario({ ...base, interests: ["travel", "food", "pets"] }, "s");
    expect(s.final.text).toContain("побольше билетов в новые города, вкусных ужинов и пушистых обнимашек.");
  });

  it("в каждом пожелании по увлечению нет своего «и» — иначе склейка выйдет кривой", () => {
    for (const i of INTERESTS) {
      const s = buildScenario({ ...base, interests: [i.value] }, "s");
      const extra = s.final.text.split("А ещё — побольше ")[1].split(".")[0];
      expect(extra).not.toMatch(/\sи\s/);
    }
  });

  it("подпись берётся из поля «от кого», если оно заполнено", () => {
    expect(buildScenario(base, "s").final.signature).toBe("С любовью, Дима");
    expect(buildScenario({ ...base, from: "" }, "s").final.signature).not.toContain("Дима");
  });

  it("старые сценарии распознаются как устаревшие", () => {
    expect(isCurrentScenario(buildScenario(base, "s"))).toBe(true);
    expect(isCurrentScenario({ title: "old", scenes: [] })).toBe(false);
  });
});

describe("parseAnswers", () => {
  it("отклоняет пустое имя и неизвестные значения", () => {
    expect(parseAnswers({ ...base, name: "  " })).toBeNull();
    expect(parseAnswers({ ...base, vibe: "evil" })).toBeNull();
    expect(parseAnswers({ ...base, year: undefined })).toBeNull();
    expect(parseAnswers(null)).toBeNull();
  });

  it("чистит увлечения и обрезает имя", () => {
    const a = parseAnswers({ ...base, name: "А".repeat(100), interests: ["food", "food", "hack", "games", "music", "pets"] });
    expect(a?.name.length).toBe(40);
    expect(a?.interests).toEqual(["food", "games", "music"]);
  });
});
