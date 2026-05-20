import { ServerSentEventGenerator } from "@starfederation/datastar-sdk/web";
import { type MiddlewareHandler } from "hono";
import { User } from "../models/user";

/**
 * Redirect to sign-in page if logged out
 */
export const signInGuard: MiddlewareHandler<{
  Variables: { user: User };
}> = async (c, next) => {
  if (!c.var.user) {
    if (c.req.header("Accept")?.includes("text/event-stream")) {
      return ServerSentEventGenerator.stream((s) => {
        s.executeScript("window.location.assign('/sign-in')");
      });
    }

    return c.redirect("/sign-in");
  }

  await next();
};
