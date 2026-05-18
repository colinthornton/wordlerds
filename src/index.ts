import { ServerSentEventGenerator } from "@starfederation/datastar-sdk/web";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { CompiledQuery } from "kysely";
import { z } from "zod";
import { db } from "./db";
import { sendGuessWebhook } from "./jobs/guess_webhook_job";
import { getCurrentGame } from "./lib/current_game";
import type { Observer } from "./lib/observable";
import {
  Feedback,
  HardModeError,
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
    const game = await getCurrentGame();

    return c.html(
      rootView({
        user: c.var.user,
        guesses: game.guesses,
        letters: game.letters,
      }),
    );
  })
  .get("/eventstream", async (c) => {
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
  })
  .post("/guesses", async (c) => {
    const [reader, game] = await Promise.all([
      ServerSentEventGenerator.readSignals(c.req.raw),
      getCurrentGame(),
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
