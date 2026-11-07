export type Year = "rollercoaster" | "rocket" | "hard" | "good";
export type Vibe = "cozy" | "party" | "family" | "adventure";
export type Interest = "travel" | "food" | "games" | "music" | "sport" | "movies" | "work" | "pets";
export type Wish = "health" | "love" | "money" | "adventure" | "calm";

export type Answers = {
  name: string;
  year: Year;
  vibe: Vibe;
  interests: Interest[];
  wish: Wish;
  /** Необязательная подпись в финале. */
  from: string;
};

export type Step =
  | { kind: "story"; emoji: string; text: string; button: string }
  | { kind: "tree" }
  | { kind: "catch"; items: string[] }
  | { kind: "memory"; emojis: string[] }
  | { kind: "wish" }
  | { kind: "gift"; text: string };

export const SCENARIO_VERSION = 2;

export type Scenario = {
  version: typeof SCENARIO_VERSION;
  title: string;
  name: string;
  vibe: Vibe;
  steps: Step[];
  final: { heading: string; text: string; signature: string };
};
