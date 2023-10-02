import { createClient } from "@libsql/client";
import { LibSQLDatabase, drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { H3Event } from "h3";
import * as schema from "./schema";
import { seedGames } from "~~/seeds/games";

let db: LibSQLDatabase<typeof schema>;

export async function getDb(event: H3Event) {
  if (!db) {
    const client = createClient({
      url: useRuntimeConfig(event).databaseUrl,
      authToken: useRuntimeConfig(event).databaseAuthToken,
    });

    db = drizzle(client, {
      schema,
      logger: process.env.NODE_ENV === "development",
    });

    if (process.env.NODE_ENV !== "development") {
      await migrate(db, { migrationsFolder: "./migrations" });
    }

    const games = await db
      .select({ id: schema.game.id })
      .from(schema.game)
      .limit(1);
    if (!games.length) {
      await seedGames(event);
    }
  }

  return db;
}

export * from "./schema";
