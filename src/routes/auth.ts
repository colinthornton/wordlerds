import { Hono } from "hono";
import { auth } from "../lib/auth";
import type { AuthType } from "../lib/auth";

/**
 * Routes for better-auth library
 */
export const authRoutes = new Hono<{ Bindings: AuthType }>({
  strict: false,
});

authRoutes.on(["POST", "GET"], "/*", (c) => {
  return auth.handler(c.req.raw);
});
