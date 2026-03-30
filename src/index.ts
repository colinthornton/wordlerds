import { Hono } from "hono";
import { logger } from "hono/logger";
import type { User } from "./db/schema";
import { authMiddleware } from "./middleware/auth";
import { authRoutes } from "./routes/auth";
import { serveStatic } from "hono/bun";
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
  .get("/", (c) => c.html(rootView({ user: c.var.user })));
app.route("/", guardedRoutes);

export default {
  port: Bun.env.PORT,
  fetch: app.fetch,
};
