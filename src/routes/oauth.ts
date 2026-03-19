import { Hono } from "hono";
import { auth } from "../lib/auth";
import { html } from "hono/html";

/**
 * OAuth signin
 */
export const oauthRoutes = new Hono();

oauthRoutes.get("/discord", async (c) => {
  const { headers, response } = await auth.api.signInSocial({
    headers: c.req.raw.headers,
    returnHeaders: true,
    body: { provider: "discord" },
  });

  // hacky, copy all the headers from the better-auth call in order
  // to use its CSRF protection
  if (response.redirect && response.url) {
    headers.forEach((v, k) => {
      c.header(k, v);
    });

    return c.redirect(response.url);
  }

  return c.redirect("/");
});
