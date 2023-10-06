import { createClient } from "@libsql/client";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../schema";
import { seedDailyGames } from "./games";
import { getDateString } from "~/utils/getDateString";

runSeeds();

async function runSeeds() {
  const client = createClient({
    url: process.env.NUXT_DATABASE_URL ?? "file:./src/server/db/local.db",
    authToken: process.env.NUXT_DATABASE_AUTH_TOKEN,
  });

  const db = drizzle(client, {
    logger: true,
    schema,
  });

  const currentCoopDailyGame = await db.query.coopDailyGame.findFirst({
    columns: { id: true },
    where: eq(schema.coopDailyGame.date, getDateString()),
  });
  if (!currentCoopDailyGame) {
    await seedDailyGames(db);
  }
}
