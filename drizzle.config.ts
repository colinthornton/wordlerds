import type { Config } from "drizzle-kit";

export default {
  schema: "./src/server/db/schema.ts",
  out: "./src/server/db/migrations",
  driver: "turso",
  dbCredentials: {
    url: "file:local.db",
  },
  breakpoints: true,
  verbose: true,
  strict: true,
} satisfies Config;
