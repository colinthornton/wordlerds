import { createClient } from "@libsql/client";
import { LibSQLDatabase, drizzle } from "drizzle-orm/libsql";
import { H3Event } from "h3";
import * as schema from "./schema";

export type WordlerdDB = LibSQLDatabase<typeof schema>;

let db: WordlerdDB;

export function getDb(event: H3Event) {
  if (!db) {
    const client = createClient({
      url: useRuntimeConfig(event).databaseUrl,
      authToken: useRuntimeConfig(event).databaseAuthToken,
    });

    db = drizzle(client, {
      schema,
      logger: process.env.NODE_ENV === "development",
    });
  }

  return db;
}

export * from "./schema";
