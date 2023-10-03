import { createClient } from "@libsql/client";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "./schema";
import { seedGames } from "./seeds/games";

runMigrations();

async function runMigrations() {
  const client = createClient({
    url: process.env.NUXT_DATABASE_URL as string,
    authToken: process.env.NUXT_DATABASE_AUTH_TOKEN,
  });

  const db = drizzle(client, {
    logger: true,
    schema,
  });

  await migrate(db, { migrationsFolder: "./src/server/db/migrations" });

  const currentGame = await db.query.game.findFirst({
    columns: { id: true },
    where: eq(schema.game.date, new Date().toISOString().slice(10)),
  });
  if (!currentGame) {
    await seedGames(db);
  }
}
