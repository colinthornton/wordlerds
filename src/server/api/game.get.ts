import { CharResult } from "~/utils/CharResult";
import { wordleGame } from "../utils/wordleGame";

export default defineEventHandler(
  (): {
    attempts: string[][];
    results: CharResult[][];
    status: "PLAYING" | "GAME_OVER";
  } => {
    return wordleGame.state;
  }
);
