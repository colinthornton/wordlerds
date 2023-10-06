import * as schema from "~/server/db/schema";
import { targets } from "~/assets/targets";
import { getDateString } from "~/utils/getDateString";
import { LibSQLDatabase } from "drizzle-orm/libsql";

export async function seedGames(db: LibSQLDatabase<typeof schema>) {
  const shuffledSolutions = shuffle(targets);
  const date = new Date();
  const games = shuffledSolutions.map((solution) => {
    const game = {
      solution,
      date: getDateString(date),
    };
    date.setDate(date.getDate() + 1);
    return game;
  });
  const rows = await db.insert(schema.game).values(games).returning();
  rows.forEach((row) => console.log(row));
}

function shuffle(array: string[]) {
  let m = array.length;
  let t;
  let i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}
