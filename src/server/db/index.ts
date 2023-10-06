import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const { databaseUrl, databaseAuthToken } = useRuntimeConfig();

const client = createClient({
  url: databaseUrl,
  authToken: databaseAuthToken,
});

export const db = drizzle(client, {
  schema,
  logger: process.env.NODE_ENV === "development",
});

export * from "./schema";
