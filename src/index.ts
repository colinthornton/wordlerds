import { Hono } from "hono";
import { html } from "hono/html";
import { logger } from "hono/logger";
import type { User } from "./db/schema";
import { authMiddleware } from "./middleware/auth";
import { authRoutes } from "./routes/auth";
import { oauthRoutes } from "./routes/oauth";

const app = new Hono<{ Variables: { user: User | null } }>();

app.use(logger());
app.use("*", authMiddleware);

app.route("/api/auth", authRoutes);
app.route("/oauth", oauthRoutes);

app.get("/", (c) => {
  const user = c.get("user");
  if (!user) {
    return c.html(html`<a href="/oauth/discord">Sign in with Discord</a>`);
  }

  return c.html(html`<pre><code>${JSON.stringify(user, null, 2)}</code></pre>`);
});

export default {
  port: Bun.env.PORT,
  fetch: app.fetch,
};
