import { type MiddlewareHandler } from "hono";
import { getDiscordSession } from "../lib/discord_session";
import { User } from "../models/user";

/**
 * Set login user data on the context
 */
export const auth: MiddlewareHandler<{
  Variables: { user: User | null };
}> = async (c, next) => {
  const discordUser = await getDiscordSession(c);
  const user = discordUser ? await User.createOrUpdate(discordUser) : null;
  c.set("user", user);
  await next();
};
