import type { Context } from "hono";
import { getCurrentGame } from "../lib/current_game";
import type { User } from "../models/user";
import { gameView } from "../views/game";

export async function game(c: Context<{ Variables: { user: User } }>) {
  const game = await getCurrentGame();

  return c.html(
    gameView({
      user: c.var.user,
      guesses: game.guesses,
      letters: game.letters,
    }),
  );
}
