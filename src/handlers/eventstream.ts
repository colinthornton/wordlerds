import { ServerSentEventGenerator } from "@starfederation/datastar-sdk/web";
import type { Context } from "hono";
import { getCurrentGame } from "../lib/current_game";
import type { Observer } from "../lib/observable";
import type { Game } from "../models/game";
import { server } from "../server";
import { guesses } from "../views/components/guesses";
import { keyboard } from "../views/components/keyboard";
import { toast } from "../views/components/toasts";

export async function eventstream(c: Context) {
  // prevent Bun from killing connection
  server.timeout(c.req.raw, 0);

  const game = await getCurrentGame();
  const observer: Observer<Game> = { update() {} };
  game.subscribe(observer);

  return ServerSentEventGenerator.stream(
    (s) => {
      observer.update = (game) => {
        try {
          s.patchSignals(JSON.stringify({ word: "" }));
          s.patchElements(guesses({ guesses: game.guesses }).toString());
          s.patchElements(keyboard({ letters: game.letters }).toString());

          const lastGuess = game.guesses.at(-1);
          if (lastGuess && lastGuess.user.id !== c.get("user").id) {
            toast(s, {
              title: "You're too slow!",
              emoji: "1139646440583467140",
            });
          }
        } catch (error) {
          game.unsubscribe(observer);
        }
      };

      s.patchElements(guesses({ guesses: game.guesses }).toString());
      s.patchElements(keyboard({ letters: game.letters }).toString());
    },
    {
      keepalive: true,
      onAbort() {
        game.unsubscribe(observer);
      },
    },
  );
}
