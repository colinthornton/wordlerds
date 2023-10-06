import { asc, eq } from "drizzle-orm";
import { coopDailyGame, attempt, type WordlerdsDB } from "../db";
import { WordleGame } from "./WordleGame";
import { getDateString } from "~/utils/getDateString";

export async function getCoopDailyGame(db: WordlerdsDB) {
  const today = getDateString();
  const currentGame = await db.query.coopDailyGame.findFirst({
    columns: { id: true, solution: true, date: true },
    where: eq(coopDailyGame.date, today),
    with: {
      attempts: {
        columns: { word: true, result: true },
        with: {
          user: { columns: { id: true, name: true, avatar: true } },
        },
        orderBy: [asc(attempt.createdAt)],
      },
    },
  });
  if (!currentGame) {
    throw createError({ status: 500 });
  }
  const { id, solution, attempts } = currentGame;
  return {
    data: currentGame,
    wordleGame: new WordleGame(id, solution, attempts),
  };
}
