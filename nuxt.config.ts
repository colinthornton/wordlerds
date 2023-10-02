export default defineNuxtConfig({
  devtools: { enabled: false },
  runtimeConfig: {
    databaseUrl: "file:local.db",
    databaseAuthToken: "",
  },
  srcDir: "src",
});
