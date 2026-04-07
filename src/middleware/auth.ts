import { type MiddlewareHandler } from "hono";
import { auth } from "../lib/auth";
import { User } from "../models/user";

/**
 * Set login user data on the context
 */
export const authMiddleware: MiddlewareHandler = async (c, next) => {
  if (Bun.env.NODE_ENV === "development") {
    const user = await User.findById(1);
    if (user) {
      c.set("user", user);
      await next();
      return;
    }
  }

  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    await next();
    return;
  }

  const user = await User.createOrUpdate({
    discord_user_id: session.user.discordUserId,
    name: session.user.name,
    avatar: session.user.image,
  });
  c.set("user", user);

  await next();
};
