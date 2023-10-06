import DiscordProvider from "@auth/core/providers/discord";
import type { AuthConfig } from "@auth/core/types";
import { NuxtAuthHandler } from "#auth";
import { z } from "zod";
import { db, user as userTable } from "~/server/db";

const runtimeConfig = useRuntimeConfig();

export const authOptions: AuthConfig = {
  secret: runtimeConfig.authJs.secret,
  providers: [
    DiscordProvider({
      clientId: runtimeConfig.discord.clientId,
      clientSecret: runtimeConfig.discord.clientSecret,
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify", // don't need email
    }),
  ],
  callbacks: {
    signIn({ profile }) {
      return runtimeConfig.playerIds.split(",").includes(profile?.id as string);
    },
    async jwt({ trigger, token, user, profile }) {
      if (trigger === "signIn") {
        // https://discord.com/developers/docs/resources/user#user-object
        const discordProfile = z
          .object({
            id: z.string(),
            username: z.string(),
            global_name: z.string().optional(),
          })
          .parse(profile);
        const defaultUser = z
          .object({
            image: z.string(),
          })
          .parse(user);

        const value = {
          discord_id: discordProfile.id,
          name: discordProfile.global_name ?? discordProfile.username,
          avatar: defaultUser.image,
        };
        const dbUser = await db
          .insert(userTable)
          .values(value)
          .onConflictDoUpdate({
            target: userTable.discord_id,
            set: { name: value.name, avatar: value.avatar },
          })
          .returning()
          .get();
        Object.assign(token, dbUser);
      }
      return token;
    },
    session({ token, session }) {
      const user = z
        .object({
          id: z.number(),
          discord_id: z.string(),
          name: z.string(),
          avatar: z.string(),
        })
        .parse(token);
      session.user = user;
      return session;
    },
  },
};

export default NuxtAuthHandler(authOptions, runtimeConfig);

declare module "@auth/core/types" {
  interface Session {
    user?: typeof userTable.$inferSelect;
  }
}
