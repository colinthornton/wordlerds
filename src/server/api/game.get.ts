import { getDb } from "../db";
import { getWordleGame } from "../models/getWordleGame";
import { WordleGameState } from "../models/WordleGame";

export default defineEventHandler(async (event): Promise<WordleGameState> => {
  const db = getDb(event);
  const wordleGame = await getWordleGame(db);
  return wordleGame.state;
});
