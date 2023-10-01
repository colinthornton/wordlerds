import { wordleGame } from "../utils/wordleGame";

export default defineEventHandler(() => {
  return wordleGame.state;
});
