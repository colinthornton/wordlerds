import z from "zod";

export type DiscordOAuthToken = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
};

export type DiscordGuildMember = {
  nick: string | null;
  avatar: string | null;
  user: {
    id: string;
    username: string;
    global_name: string | null;
    avatar: string | null;
  };
};

export class DiscordAPI {
  constructor(
    readonly clientID: string,
    readonly clientSecret: string,
  ) {}

  oAuthAuthorizeURL(params: { state: string; redirect_uri: string }) {
    const url = new URL("https://discord.com/oauth2/authorize");
    url.searchParams.set("client_id", this.clientID);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("redirect_uri", params.redirect_uri);
    url.searchParams.set("scope", "guilds.members.read");
    url.searchParams.set("state", params.state);
    url.searchParams.set("prompt", "consent");
    return url;
  }

  async fetchOAuthToken(
    params:
      | {
          grant_type: "authorization_code";
          code: string;
          redirect_uri: string;
        }
      | { grant_type: "refresh_token"; refresh_token: string },
  ): Promise<DiscordOAuthToken | null> {
    const maybeToken = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: this.clientID,
        client_secret: this.clientSecret,
        ...params,
      }),
    }).then((res) => res.json());
    const { success: tokenValid, data: token } = z
      .object({
        access_token: z.string(),
        expires_in: z.number(),
        refresh_token: z.string(),
      })
      .safeParse(maybeToken);
    if (!tokenValid) {
      return null;
    }

    return token;
  }

  async fetchGuildMember(
    token: DiscordOAuthToken,
    guildID: string,
  ): Promise<DiscordGuildMember | null> {
    const maybeGuildMember = await fetch(
      `https://discord.com/api/v10/users/@me/guilds/${guildID}/member`,
      { headers: { Authorization: `Bearer ${token.access_token}` } },
    ).then((res) => res.json());
    const { success: guildMemberValid, data: guildMember } = z
      .object({
        nick: z.string().nullable(),
        avatar: z.string().nullable(),
        user: z.object({
          id: z.string(),
          username: z.string(),
          global_name: z.string().nullable(),
          avatar: z.string().nullable(),
        }),
      })
      .safeParse(maybeGuildMember);
    if (!guildMemberValid) {
      return null;
    }

    return guildMember;
  }
}
