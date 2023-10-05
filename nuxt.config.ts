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
  devtools: { enabled: false },
  modules: ["@sidebase/nuxt-auth"],
  runtimeConfig: {
    databaseUrl: "file:./src/server/db/local.db",
    databaseAuthToken: "",
  },
  srcDir: "src",
});
