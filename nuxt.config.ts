export default defineNuxtConfig({
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
  auth: {
    origin: process.env.CF_PAGES_URL ?? "https://wordlerds.pages.dev",
  },
  devtools: { enabled: false },
  modules: ["@sidebase/nuxt-auth"],
  runtimeConfig: {
    databaseUrl: "file:./src/server/db/local.db",
    databaseAuthToken: undefined,
    authSecret: "secret",
    discordClientId: undefined,
    discordClientSecret: undefined,
    playerIds: undefined,
  },
  srcDir: "src",
});
