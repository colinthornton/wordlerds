import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
export * from "./schema";

const isDev = process.env.NODE_ENV === "development";

const client = createClient({
  url: isDev ? "file:local.db" : (process.env.DATEBASE_URL as string),
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, {
  schema,
  logger: isDev,
});
