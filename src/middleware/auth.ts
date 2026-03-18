import { type MiddlewareHandler } from "hono";
import { auth, type AuthType } from "../lib/auth";

/**
 * Set authentication data on the context
 */
export const authMiddleware: MiddlewareHandler<{
  Variables: AuthType;
}> = async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    await next();
    return;
  }

  c.set("user", session.user);
  c.set("session", session.session);
  await next();
};
