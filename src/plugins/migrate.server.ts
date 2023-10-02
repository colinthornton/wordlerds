import { migrate } from "drizzle-orm/libsql/migrator";
import { db, game } from "~/server/db";
import { seedGames } from "~~/seeds/games";

export default defineNuxtPlugin(({ hook }) => {
  hook("app:created", async () => {
    if (process.env.NODE_ENV !== "development") {
      await migrate(db, { migrationsFolder: "./migrations" });
    }
    const games = await db.select({ id: game.id }).from(game).limit(1);
    if (!games.length) {
      await seedGames();
    }
  });
});
