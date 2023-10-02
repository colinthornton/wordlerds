import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
export * from "./schema";

const client = createClient({
  url: useRuntimeConfig().databaseUrl,
  authToken: useRuntimeConfig().databaseAuthToken,
});

export const db = drizzle(client, {
  schema,
  logger: process.env.NODE_ENV === "development",
});
