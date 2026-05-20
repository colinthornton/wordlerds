import { type MiddlewareHandler } from "hono";
import { getDiscordSession } from "../lib/discord_session";
import { User } from "../models/user";

const cookieSecret = Bun.env.COOKIE_SECRET!;

/**
 * Set login user data on the context
 */
export const authMiddleware: MiddlewareHandler<{
  Variables: { user: User | null };
}> = async (c, next) => {
  // if (Bun.env.NODE_ENV === "development") {
  //   const user = await User.findById(1);
  //   if (user) {
  //     c.set("user", user);
  //     await next();
  //     return;
  //   }
  // }

  const discordUser = await getDiscordSession(c);
  const user = discordUser ? await User.createOrUpdate(discordUser) : null;
  c.set("user", user);
  await next();
};
