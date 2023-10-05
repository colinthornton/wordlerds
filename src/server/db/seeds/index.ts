import { createClient } from "@libsql/client";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../schema";
import { seedGames } from "./games";

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

  const currentGame = await db.query.game.findFirst({
    columns: { id: true },
    where: eq(schema.game.date, new Date().toISOString().slice(10)),
  });
  if (!currentGame) {
    await seedGames(db);
  }
}
