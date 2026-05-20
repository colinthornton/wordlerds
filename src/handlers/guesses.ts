import { ServerSentEventGenerator } from "@starfederation/datastar-sdk/web";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import { sendGuessWebhook } from "../jobs/guess_webhook_job";
import { getCurrentGame } from "../lib/current_game";
import { HardModeError, WordNotInDictionaryError } from "../lib/wordle";
import type { User } from "../models/user";
import {
  alreadyGuessedToast,
  hardModeToast,
  notInDictionaryToast,
  toast,
} from "../views/components/toasts";

export async function guesses(c: Context<{ Variables: { user: User } }>) {
  const [reader, game] = await Promise.all([
    ServerSentEventGenerator.readSignals(c.req.raw),
    getCurrentGame(),
  ]);
  if (!(reader.success && game)) {
    throw new HTTPException(500);
  }

  if (!game.open) {
    const guessedUserIds = new Set(game.guesses.map((guess) => guess.user.id));
    if (guessedUserIds.has(c.var.user.id)) {
      return ServerSentEventGenerator.stream((s) => {
        alreadyGuessedToast(s);
      });
    }
  }

  const { success: signalsValid, data: signals } = z
    .object({ word: z.string() })
    .safeParse(reader.signals);
  if (!signalsValid) {
    throw new HTTPException(400);
  }

  try {
    const guess = await game.makeGuess(signals.word, c.var.user);

    sendGuessWebhook(guess.id);

    return ServerSentEventGenerator.stream((s) => {
      if (game.state === "WIN") {
        s.executeScript("fireConfetti()");
      }
      if (game.state === "LOSS") {
        toast(s, {
          title: `The word was "${game.solution}"`,
          emoji: "1139222642226900992",
        });
      }
    });
  } catch (error) {
    if (error instanceof WordNotInDictionaryError) {
      return ServerSentEventGenerator.stream((s) => {
        notInDictionaryToast(s, signals.word);
      });
    }

    if (error instanceof HardModeError) {
      return ServerSentEventGenerator.stream((s) => {
        hardModeToast(s);
      });
    }
  }
}
