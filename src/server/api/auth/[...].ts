import { NuxtAuthHandler } from "#auth";
import DiscordProvider from "next-auth/providers/discord";

export default NuxtAuthHandler({
  providers: [
    // @ts-expect-error "You need to use .default here for it to work during SSR. May be fixed via Vite at some point" - https://sidebase.io/nuxt-auth/getting-started/quick-start
    (DiscordProvider.default as typeof DiscordProvider)({
      clientId: "1158748020897218640",
      clientSecret: "p6FjnruXcw7SiIIWE8Qmt54O4nfMs3Pd",
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify",
    }),
  ],
});
