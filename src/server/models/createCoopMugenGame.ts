import { targets } from "~/assets/targets";
import { coopMugenGame, type WordlerdsDB } from "../db";

export async function createCoopMugenGame(db: WordlerdsDB) {
  const solution = targets[Math.floor(Math.random() * targets.length)];
  return db.insert(coopMugenGame).values({ solution }).returning().get();
}
