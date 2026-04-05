import { type MiddlewareHandler } from "hono";
import { type User } from "../db/schema";

/**
 * Redirect to sign-in page if logged out
 */
export const signInGuard: MiddlewareHandler = async (c, next) => {
  if (!c.var.user) {
    return c.redirect("/sign-in");
  }
  await next();
};
