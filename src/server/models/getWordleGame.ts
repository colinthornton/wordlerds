import { eq } from "drizzle-orm";
import { getDb, attempt, game } from "../db";
import { WordleGame } from "./WordleGame";
import { H3Event } from "h3";

export async function getWordleGame(event: H3Event): Promise<WordleGame> {
  const db = await getDb(event);
  const today = new Date().toISOString().slice(0, 10);
  const rows = await db
    .select({
      gameId: game.id,
      solution: game.solution,
      attempt: attempt.word,
    })
    .from(game)
    .where(eq(game.date, today))
    .leftJoin(attempt, eq(game.id, attempt.gameId));
  if (!rows.length) {
    throw createError({ status: 500 });
  }
  const { gameId, solution } = rows[0];
  const attempts = rows
    .filter(({ attempt }) => attempt)
    .map(({ attempt }) => attempt) as string[];
  return new WordleGame(gameId, solution, attempts);
}
