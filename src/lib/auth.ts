import { betterAuth } from "better-auth";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

/**
 * https://better-auth.com/docs/reference/options
 */
export const auth = betterAuth({
  user: {
    additionalFields: {
      discordUserId: {
        type: "string",
        required: true,
      },
    },
  },
  socialProviders: {
    discord: {
      clientId: Bun.env.DISCORD_CLIENT_ID!,
      clientSecret: Bun.env.DISCORD_CLIENT_SECRET!,
      disableDefaultScope: true,
      scope: ["guilds.members.read"],
      prompt: "consent",
      overrideUserInfoOnSignIn: true,
      /**
       * Hit the guild member endpoint to ensure we only allow members of the Ussie guild
       */
      async getUserInfo(token) {
        const maybeGuildMember = await fetch(
          `https://discord.com/api/v10/users/@me/guilds/${Bun.env.DISCORD_GUILD_ID}/member`,
          { headers: { Authorization: `Bearer ${token.accessToken}` } },
        ).then((res) => res.json());

        // https://docs.discord.com/developers/resources/guild#guild-member-object
        const { success: isGuildMember, data: guildMember } = z
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
        if (!isGuildMember) {
          throw new HTTPException(403, { message: "Only Ussies Allowed" });
        }

        return {
          user: {
            id: guildMember.user.id, // this gets overwritten for some reason, use discordUserId
            email: "fake@example.com", // I don't want to collect emails but better-auth requires one
            emailVerified: false,
            image: guildMember.avatar
              ? `https://cdn.discordapp.com/guilds/${Bun.env.DISCORD_GUILD_ID}/users/${guildMember.user.id}/avatars/${guildMember.avatar}.webp`
              : guildMember.user.avatar
                ? `https://cdn.discordapp.com/avatars/${guildMember.user.id}/${guildMember.user.avatar}.webp`
                : undefined, // https://docs.discord.com/developers/reference#image-formatting
            name:
              guildMember.nick ||
              guildMember.user.global_name ||
              guildMember.user.username,
            discordUserId: guildMember.user.id,
          },
          data: guildMember,
        };
      },
    },
  },
});
