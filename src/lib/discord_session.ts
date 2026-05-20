import type { Context } from "hono";
import { getSignedCookie, setSignedCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import {
  DiscordAPI,
  type DiscordGuildMember,
  type DiscordOAuthToken,
} from "./discord_api";

export type DiscordUser = {
  discord_user_id: string;
  name: string;
  avatar?: string;
};

export async function setDiscordSession(
  c: Context,
  token: DiscordOAuthToken,
): Promise<DiscordUser> {
  const discordAPI = new DiscordAPI(
    Bun.env.DISCORD_CLIENT_ID!,
    Bun.env.DISCORD_CLIENT_SECRET!,
  );

  const guildMember = await discordAPI.fetchGuildMember(
    token,
    Bun.env.DISCORD_GUILD_ID!,
  );
  if (!guildMember) {
    throw new HTTPException(403);
  }
  const discordUser = toDiscordUser(guildMember);

  await Promise.all([
    setSignedCookie(
      c,
      "discord_user",
      JSON.stringify(discordUser),
      Bun.env.COOKIE_SECRET!,
      {
        maxAge: token.expires_in,
        httpOnly: true,
        path: "/",
        sameSite: "Lax",
        secure: true,
        prefix: "secure",
      },
    ),
    setSignedCookie(
      c,
      "discord_refresh_token",
      token.refresh_token,
      Bun.env.COOKIE_SECRET!,
      {
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
        path: "/",
        sameSite: "Lax",
        secure: true,
        prefix: "secure",
      },
    ),
  ]);

  return discordUser;
}

export async function getDiscordSession(
  c: Context,
): Promise<DiscordUser | null> {
  const [maybeDiscordUserJSON, refreshToken] = await Promise.all([
    getSignedCookie(c, Bun.env.COOKIE_SECRET!, "discord_user", "secure"),
    getSignedCookie(
      c,
      Bun.env.COOKIE_SECRET!,
      "discord_refresh_token",
      "secure",
    ),
  ]);

  if (maybeDiscordUserJSON) {
    const maybeDiscordUser = JSON.parse(maybeDiscordUserJSON);
    const { success: discordUserValid, data: discordUser } = z
      .object({
        discord_user_id: z.string(),
        name: z.string(),
        avatar: z.string().optional(),
      })
      .safeParse(maybeDiscordUser);
    if (discordUserValid) {
      return discordUser;
    }
  }

  if (refreshToken) {
    const discordAPI = new DiscordAPI(
      Bun.env.DISCORD_CLIENT_ID!,
      Bun.env.DISCORD_CLIENT_SECRET!,
    );

    const token = await discordAPI.fetchOAuthToken({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });
    if (!token) {
      return null;
    }

    const discordUser = await setDiscordSession(c, token);
    return discordUser;
  }

  return null;
}

function toDiscordUser(guildMember: DiscordGuildMember): DiscordUser {
  return {
    discord_user_id: guildMember.user.id,
    // https://docs.discord.com/developers/reference#image-formatting
    avatar: guildMember.avatar
      ? `https://cdn.discordapp.com/guilds/${Bun.env.DISCORD_GUILD_ID!}/users/${
          guildMember.user.id
        }/avatars/${guildMember.avatar}.webp`
      : guildMember.user.avatar
      ? `https://cdn.discordapp.com/avatars/${guildMember.user.id}/${guildMember.user.avatar}.webp`
      : undefined,
    name:
      guildMember.nick ||
      guildMember.user.global_name ||
      guildMember.user.username,
  };
}
