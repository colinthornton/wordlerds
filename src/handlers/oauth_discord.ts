import { type Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { DiscordAPI } from "../lib/discord_api";
import { setDiscordSession } from "../lib/discord_session";

/**
 * OAuth flow for Discord
 */
export async function oAuthDiscord(c: Context) {
  const { code, state } = c.req.query();
  const redirectURI = c.req.url.split("?")[0]!;
  const discordAPI = new DiscordAPI(
    Bun.env.DISCORD_CLIENT_ID!,
    Bun.env.DISCORD_CLIENT_SECRET!,
  );

  // redirect to Discord
  if (!(code && state)) {
    const state = getRandomState();
    setCookie(c, "discord_oauth_state", state, {
      maxAge: 60 * 10,
      httpOnly: true,
      path: "/",
      sameSite: "Lax",
      secure: true,
      prefix: "secure",
    });
    return c.redirect(
      discordAPI.oAuthAuthorizeURL({ state, redirect_uri: redirectURI }),
    );
  }

  // CSRF protection
  const discordOauthState = getCookie(c, "discord_oauth_state", "secure");
  if (state !== discordOauthState) {
    throw new HTTPException(401);
  }

  const token = await discordAPI.fetchOAuthToken({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectURI,
  });
  if (!token) {
    throw new HTTPException(400);
  }

  await setDiscordSession(c, token);
  return c.redirect("/");
}

function getRandomState() {
  return `${Math.random().toString(36).slice(2)}-${Math.random()
    .toString(36)
    .slice(2)}-${Math.random().toString(36).slice(2)}`;
}
