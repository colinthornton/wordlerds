import { eq } from "drizzle-orm";
import { CharResult } from "~/types/CharResult";
import { game, type WordlerdDB } from "../db";
import { WordleGame } from "./WordleGame";
import { getDateString } from "~/utils/getDateString";

export async function getWordleGame(db: WordlerdDB): Promise<WordleGame> {
  const today = getDateString();
  const currentGame = await db.query.game.findFirst({
    columns: { id: true, solution: true },
    where: eq(game.date, today),
    with: { attempts: { columns: { word: true, result: true } } },
  });
  if (!currentGame) {
    throw createError({ status: 500 });
  }
  const { id, solution, attempts } = currentGame;
  return new WordleGame(
    id,
    solution,
    attempts.map(({ word }) => word),
    attempts.map(({ result }) => result.split("").map(Number) as CharResult[])
  );
}
