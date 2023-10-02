import { getWordleGame } from "../models/getWordleGame";
import { WordleGameState } from "../models/WordleGame";

export default defineEventHandler(async (event): Promise<WordleGameState> => {
  const wordleGame = await getWordleGame(event);
  return wordleGame.state;
});
