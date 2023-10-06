import { db } from "../db";
import { getCoopDailyGame } from "../models/getCoopDailyGame";

export default defineEventHandler(async () => {
  const { data, wordleGame } = await getCoopDailyGame(db);
  return {
    mode: "coopdaily",
    id: data.id,
    date: data.date,
    state: wordleGame.state,
  };
});
