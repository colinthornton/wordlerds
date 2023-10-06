import { resolve } from "node:path";

export default defineNuxtConfig({
  alias: {
    cookie: resolve(__dirname, "node_modules/cookie"),
  },
  app: {
    head: {
      script: [
        {
          defer: true,
          src: "https://static.cloudflareinsights.com/beacon.min.js",
          "data-cf-beacon": JSON.stringify({
            token: process.env.CLOUDFLARE_INSIGHTS_TOKEN,
          }),
        },
      ],
    },
  },
  devtools: { enabled: false },
  modules: ["@hebilicious/authjs-nuxt"],
  runtimeConfig: {
    databaseUrl:
      process.env.NUXT_DATABASE_URL ?? "file:./src/server/db/local.db",
    databaseAuthToken: process.env.NUXT_DATABASE_AUTH_TOKEN,
    authJs: {
      secret: process.env.NUXT_AUTH_JS_SECRET,
    },
    discord: {
      clientId: process.env.NUXT_DISCORD_CLIENT_ID,
      clientSecret: process.env.NUXT_DISCORD_CLIENT_SECRET,
    },
    playerIds: process.env.NUXT_PLAYER_IDS,
    public: {
      authJs: {
        baseUrl: process.env.NUXT_PUBLIC_AUTH_JS_BASE_URL,
      },
    },
  },
  srcDir: "src",
});
