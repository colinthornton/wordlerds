import { Hono } from "hono";
import { html } from "hono/html";
import { logger } from "hono/logger";
import { type AuthType } from "./lib/auth";
import { authRoutes } from "./routes/auth";
import { oauthRoutes } from "./routes/oauth";
import { authMiddleware } from "./middleware/auth";

const app = new Hono<{ Variables: AuthType }>();

app.use(logger());
app.use("*", authMiddleware);

app.route("/api/auth", authRoutes);
app.route("/oauth", oauthRoutes);

app.get("/", (c) => {
  const user = c.get("user");
  if (!user) {
    return c.html(html`<a href="/oauth/discord">Sign in with Discord</a>`);
  }

  return c.json({
    user,
  });
});

export default {
  port: Bun.env.PORT,
  fetch: app.fetch,
};
