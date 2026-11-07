import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlayClient from "@/components/game/PlayClient";
import { db } from "@/lib/db";
import { isCurrentScenario } from "@/lib/scenario/build";
import type { Scenario } from "@/lib/scenario/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Новогодняя игра 🎄", robots: { index: false } };

const DEMO_TOKEN = "demo";

export default async function PlayPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  if (token === DEMO_TOKEN) return <PlayClient token={token} demo initialScenario={null} />;

  const game = await db.game.findUnique({ where: { token } });
  if (!game) notFound();

  // Игры, собранные старой версией, просим пройти тест заново.
  const parsed: unknown = game.scenario ? JSON.parse(game.scenario) : null;
  const scenario: Scenario | null = isCurrentScenario(parsed) ? parsed : null;
  return <PlayClient token={token} demo={false} initialScenario={scenario} />;
}
