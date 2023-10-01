import { getWordleGame } from "../models/getWordleGame";
import { WordleGameState } from "../models/WordleGame";

export default defineEventHandler(async (): Promise<WordleGameState> => {
  const wordleGame = await getWordleGame();
  return wordleGame.state;
});
