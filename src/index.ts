import { ServerSentEventGenerator } from "@starfederation/datastar-sdk/web";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { z } from "zod";
import type { User } from "./db/schema";
import {
  HardModeError,
  solutions,
  Wordle,
  WordNotInDictionaryError,
} from "./lib/wordle";
import { authMiddleware } from "./middleware/auth";
import { signInGuard } from "./middleware/sign_in_guard";
import { authRoutes } from "./routes/auth";
import { guesses } from "./views/components/guesses";
import { keyboard } from "./views/components/keyboard";
import {
  hardModeToast,
  notInDictionaryToast,
  toast,
} from "./views/components/toasts";
import { rootView } from "./views/root";
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
  .get("/", (c) => {
    return c.html(
      rootView({
        user: c.var.user,
        guesses: game.guesses,
        letters: game.letters,
      }),
    );
  })
  .post("/guesses", async (c) => {
    const reader = await ServerSentEventGenerator.readSignals(c.req.raw);
    if (!reader.success) {
      throw new HTTPException(500);
    }

    const { success: signalsValid, data: signals } = z
      .object({ word: z.string() })
      .safeParse(reader.signals);
    if (!signalsValid) {
      throw new HTTPException(400);
    }

    try {
      game.makeGuess(signals.word);
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
