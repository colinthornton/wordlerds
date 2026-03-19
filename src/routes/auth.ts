import { Hono } from "hono";
import { auth } from "../lib/auth";

/**
 * Routes for better-auth library
 */
export const authRoutes = new Hono({
  strict: false,
});

authRoutes.on(["POST", "GET"], "/*", (c) => {
  return auth.handler(c.req.raw);
});
