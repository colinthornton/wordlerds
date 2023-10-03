import { type WordlerdDB, game } from "~/server/db";
import { targets } from "~/assets/targets";

export async function seedGames(db: WordlerdDB) {
  const shuffledSolutions = shuffle(targets);
  const date = new Date();
  const games = shuffledSolutions.map((solution) => {
    const game = {
      solution,
      date: date.toISOString().slice(0, 10),
    };
    date.setDate(date.getDate() + 1);
    return game;
  });
  const rows = await db.insert(game).values(games).returning();
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
