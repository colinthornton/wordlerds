import { ServerSentEventGenerator } from "@starfederation/datastar-sdk/web";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { z } from "zod";
import type { User } from "./db/schema";
import { solutions, Wordle } from "./lib/wordle";
import { authMiddleware } from "./middleware/auth";
import { authRoutes } from "./routes/auth";
import { attempts } from "./views/components/attempts";
import { keyboard } from "./views/components/keyboard";
import { rootView } from "./views/root";
import { signInView } from "./views/sign-in";

const app = new Hono().use(logger());

const publicRoutes = new Hono()
  .route("/api/auth", authRoutes)
  .get("/public/*", serveStatic({ root: "./" }));
app.route("/", publicRoutes);

const unguardedRoutes = new Hono<{ Variables: { user: User | null } }>()
  .use(authMiddleware)
  .get("/sign-in", (c) => {
    if (c.get("user")) {
      return c.redirect("/");
    }

    return c.html(signInView());
  });
app.route("/", unguardedRoutes);

const guardedRoutes = new Hono<{ Variables: { user: User } }>()
  .use(authMiddleware)
  .use(async (c, next) => {
    if (!c.get("user")) {
      return c.redirect("/sign-in");
    }
    await next();
  })
  .get("/", (c) => {
    return c.html(
      rootView({
        user: c.var.user,
        attempts: game.attempts,
        letters: game.letters,
      }),
    );
  })
  .post("/attempts", async (c) => {
    const reader = await ServerSentEventGenerator.readSignals(c.req.raw);
    if (!reader.success) {
      throw new HTTPException(500);
    }

    const maybeSignals = z
      .object({ word: z.string() })
      .safeParse(reader.signals);
    if (!maybeSignals.success) {
      throw new HTTPException(400);
    }
    const signals = maybeSignals.data;

    game.makeAttempt(signals.word);

    return ServerSentEventGenerator.stream((s) => {
      s.patchSignals(JSON.stringify({ word: "" }));
      s.patchElements(attempts({ attempts: game.attempts }).toString());
      s.patchElements(keyboard({ letters: game.letters }).toString());
    });
  });
app.route("/", guardedRoutes);

export default {
  port: Bun.env.PORT,
  fetch: app.fetch,
};

// temporary for testing
let game: Wordle;
function newWordle() {
  const solution = Array.from(solutions)[
    Math.floor(Math.random() * solutions.size)
  ] as string;
  game = new Wordle(solution);
}
newWordle();
