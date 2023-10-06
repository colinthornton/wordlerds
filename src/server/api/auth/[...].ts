import { NuxtAuthHandler } from "#auth";
import DiscordProvider from "next-auth/providers/discord";
import { z } from "zod";
import { getDb, user as userTable } from "~/server/db";

let nuxtAuthHandler: ReturnType<typeof NuxtAuthHandler>;

export default defineEventHandler((event) => {
  if (!nuxtAuthHandler) {
    const db = getDb(event);
    const { authSecret, discordClientId, discordClientSecret, playerIds } =
      useRuntimeConfig(event);

    nuxtAuthHandler = NuxtAuthHandler({
      debug: process.env.NODE_ENV === "development",
      secret: authSecret,
      providers: [
        DiscordProvider({
          clientId: discordClientId,
          clientSecret: discordClientSecret,
          authorization:
            "https://discord.com/api/oauth2/authorize?scope=identify",
        }),
      ],
      callbacks: {
        signIn({ user }) {
          return playerIds.split(",").includes(user.id);
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
    });
  }

  return nuxtAuthHandler(event);
});

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: typeof userTable.$inferSelect;
  }
}
