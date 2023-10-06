import { eq } from "drizzle-orm";
import { game, type WordlerdDB } from "../db";
import { WordleGame } from "./WordleGame";
import { getDateString } from "~/utils/getDateString";

export async function getWordleGame(db: WordlerdDB): Promise<WordleGame> {
  const today = getDateString();
  const currentGame = await db.query.game.findFirst({
    columns: { id: true, solution: true },
    where: eq(game.date, today),
    with: {
      attempts: {
        columns: { word: true, result: true },
        with: {
          user: { columns: { name: true, avatar: true } },
        },
      },
    },
  });
  if (!currentGame) {
    throw createError({ status: 500 });
  }
  const { id, solution, attempts } = currentGame;
  return new WordleGame(id, solution, attempts);
}
