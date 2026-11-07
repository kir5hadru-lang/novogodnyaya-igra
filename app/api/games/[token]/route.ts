import { NextResponse } from "next/server";
import { buildScenario, parseAnswers } from "@/lib/scenario/build";
import { db } from "@/lib/db";

// Сохраняет ответы теста и возвращает собранный сценарий.
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const game = await db.game.findUnique({ where: { token } });
  if (!game) return NextResponse.json({ error: "Игра не найдена" }, { status: 404 });

  const answers = parseAnswers(await req.json().catch(() => null));
  if (!answers) return NextResponse.json({ error: "Заполните все ответы" }, { status: 400 });

  const scenario = buildScenario(answers, token);
  await db.game.update({
    where: { id: game.id },
    data: { answers: JSON.stringify(answers), scenario: JSON.stringify(scenario) },
  });
  return NextResponse.json({ scenario });
}
