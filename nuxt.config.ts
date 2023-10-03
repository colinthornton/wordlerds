export default defineNuxtConfig({
  devtools: { enabled: false },
  runtimeConfig: {
    databaseUrl: "file:./src/server/db/local.db",
    databaseAuthToken: "",
  },
  srcDir: "src",
});
