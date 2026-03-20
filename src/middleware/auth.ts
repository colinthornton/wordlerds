import { type MiddlewareHandler } from "hono";
import { db } from "../db";
import { auth } from "../lib/auth";
import * as User from "../models/user";

/**
 * Set login user data on the context
 */
export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    await next();
    return;
  }

  const user = await User.createOrUpdate(db, {
    discord_user_id: session.user.discordUserId,
    name: session.user.name,
    avatar: session.user.image,
  });
  c.set("user", user);

  await next();
};
