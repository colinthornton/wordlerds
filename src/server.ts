import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import * as handlers from "./handlers";
import * as middleware from "./middleware";

const app = new Hono()
  .use(logger())
  .get("/public/*", serveStatic({ root: "./" }))
  .get("/oauth/discord", handlers.oAuthDiscord)
  .use(middleware.auth)
  .get("/sign-in", handlers.signIn)
  .use(middleware.signInGuard)
  .get("/", handlers.game)
  .get("/eventstream", handlers.eventstream)
  .post("/guesses", handlers.guesses)
  .get("/score", handlers.score);

export const server = Bun.serve({
  port: Bun.env.PORT,
  fetch: app.fetch,
});
