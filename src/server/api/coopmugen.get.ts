import { db } from "../db";
import { getCoopMugenGame } from "../models/getCoopMugenGame";

export default defineEventHandler(async () => {
  const { data, wordleGame } = await getCoopMugenGame(db);
  return {
    mode: "coopmugen",
    id: data.id,
    state: wordleGame.state,
  };
});
