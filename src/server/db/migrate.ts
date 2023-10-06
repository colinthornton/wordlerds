import { createClient } from "@libsql/client";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "./schema";
import { seedDailyGames } from "./seeds/games";
import { getDateString } from "~/utils/getDateString";

runMigrations();

async function runMigrations() {
  const client = createClient({
    url: process.env.NUXT_DATABASE_URL ?? "file:./src/server/db/local.db",
    authToken: process.env.NUXT_DATABASE_AUTH_TOKEN,
  });

  const db = drizzle(client, {
    logger: true,
    schema,
  });

  await migrate(db, { migrationsFolder: "./src/server/db/migrations" });

  const currentCoopDailyGame = await db.query.coopDailyGame.findFirst({
    columns: { id: true },
    where: eq(schema.coopDailyGame.date, getDateString()),
  });
  if (!currentCoopDailyGame) {
    await seedDailyGames(db);
  }
}
