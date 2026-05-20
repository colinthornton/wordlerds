import type { Context } from "hono";
import type { User } from "../models/user";
import { signInView } from "../views/sign-in";

export function signIn(c: Context<{ Variables: { user: User | null } }>) {
  if (c.var.user) {
    return c.redirect("/");
  }

  return c.html(signInView());
}
