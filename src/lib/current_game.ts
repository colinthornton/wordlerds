import { Game } from "../models/game";

let currentGame: Game | null = null;

/**
 * Get singleton of current multiplayer game in progress.
 * Automatically creates new game when previous game finished.
 */
export async function getCurrentGame(): Promise<Game> {
  if (!currentGame) currentGame = await Game.findLatest();
  if (!currentGame || currentGame.state !== "IN_PROGRESS") {
    currentGame = await Game.createWithRandomSolution();
  }
  return currentGame;
}
