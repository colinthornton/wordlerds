import type { Config } from "drizzle-kit";

export default {
  schema: "./src/server/db/schema.ts",
  out: "./src/server/db/migrations",
  driver: "turso",
  dbCredentials: {
    url: process.env.NUXT_DATABASE_URL ?? "file:./src/server/db/local.db",
    authToken: process.env.NUXT_DATABASE_AUTH_TOKEN,
  },
  breakpoints: true,
  verbose: true,
  strict: true,
} satisfies Config;
