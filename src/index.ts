import { ServerSentEventGenerator } from "@starfederation/datastar-sdk/web";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { CompiledQuery } from "kysely";
import { z } from "zod";
import { db } from "./db";
import { sendGuessWebhook } from "./jobs/guess_webhook_job";
import { scheduleGameOpenWebhook } from "./jobs/open_game_webhook_job";
import {
  Feedback,
  HardModeError,
  solutions,
  Wordle,
  WordNotInDictionaryError,
} from "./lib/wordle";
import { authMiddleware } from "./middleware/auth";
import { signInGuard } from "./middleware/sign_in_guard";
import { Game } from "./models/game";
import { Guess } from "./models/guess";
import type { User } from "./models/user";
import { authRoutes } from "./routes/auth";
import { guesses } from "./views/components/guesses";
import { keyboard } from "./views/components/keyboard";
import {
  alreadyGuessedToast,
  hardModeToast,
  notInDictionaryToast,
  toast,
} from "./views/components/toasts";
import { rootView } from "./views/root";
import { scoreView } from "./views/score";
import { signInView } from "./views/sign-in";

const app = new Hono()
  .use(logger())
  .route("/api/auth", authRoutes)
  .get("/public/*", serveStatic({ root: "./" }))
  .use<{ Variables: { user: User | null } }>(authMiddleware)
  .get("/sign-in", (c) => {
    if (c.var.user) {
      return c.redirect("/");
    }

    return c.html(signInView());
  })
  .use<{ Variables: { user: User } }>(signInGuard)
  .get("/", async (c) => {
    let game = await Game.findLatest();
    if (!game || game.state !== "IN_PROGRESS") {
      game = await Game.createWithRandomSolution();
      scheduleGameOpenWebhook(game);
    }

    return c.html(
      rootView({
        user: c.var.user,
        guesses: game.guesses,
        letters: game.letters,
      }),
    );
  })
  .post("/guesses", async (c) => {
    const [reader, game] = await Promise.all([
      ServerSentEventGenerator.readSignals(c.req.raw),
      Game.findLatest(),
    ]);
    if (!(reader.success && game)) {
      throw new HTTPException(500);
    }

    if (!game.open) {
      const guessedUserIds = new Set(
        game.guesses.map((guess) => guess.user.id),
      );
      if (guessedUserIds.has(c.var.user.id)) {
        return ServerSentEventGenerator.stream((s) => {
          s.patchElements(alreadyGuessedToast().toString(), {
            selector: "#toaster",
            mode: "append",
          });
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
        if (game.state !== "IN_PROGRESS") {
          const toastOptions =
            game.state === "WIN"
              ? {
                  title: `"${signals.word}" was correct!`,
                  emoji: "966369258735038524",
                }
              : {
                  title: `The word was "${game.solution}"`,
                  emoji: "1139222642226900992",
                };
          s.patchElements(toast(toastOptions).toString(), {
            selector: "#toaster",
            mode: "append",
          });
          newWordle();
        }
        s.patchSignals(JSON.stringify({ word: "" }));
        s.patchElements(guesses({ guesses: game.guesses }).toString());
        s.patchElements(keyboard({ letters: game.letters }).toString());
      });
    } catch (error) {
      if (error instanceof WordNotInDictionaryError) {
        return ServerSentEventGenerator.stream((s) => {
          s.patchElements(notInDictionaryToast(signals.word).toString(), {
            selector: "#toaster",
            mode: "append",
          });
        });
      }

      if (error instanceof HardModeError) {
        return ServerSentEventGenerator.stream((s) => {
          s.patchElements(hardModeToast().toString(), {
            selector: "#toaster",
            mode: "append",
          });
        });
      }
    }
  })
  .get("/score", async (c) => {
    const user = c.get("user");

    const monthGuesses = await Guess.findCurrentMonth();
    const monthStats = new Map<
      number, // user ID
      {
        user: User;
        score: number;
        maxStreak: number;
        guesses: number;
        correct: number;
        present: number;
        notPresent: number;
        scored: number;
        accuracy: number;
      }
    >();
    for (const guess of monthGuesses) {
      if (!monthStats.has(guess.user.id)) {
        monthStats.set(guess.user.id, {
          user: guess.user,
          score: 0,
          maxStreak: 0,
          guesses: 0,
          correct: 0,
          present: 0,
          notPresent: 0,
          accuracy: 0,
          scored: 0,
        });
      }
      const acc = monthStats.get(guess.user.id)!;
      const score = acc.score + guess.score;
      const maxStreak = Math.max(acc.maxStreak, guess.streak);
      const guesses = acc.guesses + 1;
      const correct =
        acc.correct +
        guess.feedback.filter((f) => f === Feedback.Correct).length;
      const present =
        acc.present +
        guess.feedback.filter((f) => f === Feedback.Present).length;
      const notPresent =
        acc.notPresent +
        guess.feedback.filter((f) => f === Feedback.NotPresent).length;
      const scored = acc.scored + guess.scores.filter((s) => s > 0).length;
      const accuracy = scored / (guesses * 5);
      monthStats.set(guess.user.id, {
        user: acc.user,
        score,
        maxStreak,
        guesses,
        correct,
        present,
        notPresent,
        scored,
        accuracy,
      });
    }
    const sortedMonthStats = Array.from(monthStats.values()).sort(
      (a, b) => b.score - a.score,
    );

    const { rows } = await db.executeQuery<{ start: number; end: number }>(
      CompiledQuery.raw(
        `SELECT
          unixepoch('now', 'start of month', 'subsec') * 1000 as start,
          unixepoch('now', 'start of month', '1 month', 'subsec') * 1000 as end
        ;`,
      ),
    );
    const range: [number, number] = [rows[0]!.start, rows[0]!.end];

    return c.html(scoreView({ user, stats: sortedMonthStats, range }));
  });

const server = Bun.serve({
  port: Bun.env.PORT,
  fetch: app.fetch,
});

// temporary for testing
let game: Wordle;
function newWordle() {
  const solution = Array.from(solutions)[
    Math.floor(Math.random() * solutions.size)
  ] as string;
  game = new Wordle(solution);
}
newWordle();
