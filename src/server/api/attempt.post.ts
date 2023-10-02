import { z } from "zod";
import { getWordleGame } from "../models/getWordleGame";
import { getDb, attempt } from "../db";
import { WordleGameState } from "../models/WordleGame";
import { CharResult } from "~/types/CharResult";

export default defineEventHandler(async (event): Promise<WordleGameState> => {
  // validate input
  const validation = z
    .object({
      word: z.array(z.string().length(1).regex(/[a-z]/)).length(5),
      wordIndex: z.number().min(0).max(5),
    })
    .safeParse(await readBody(event));
  if (!validation.success) {
    throw createError({ status: 400 });
  }
  const body = validation.data;

  // update game state
  const wordleGame = await getWordleGame(event);
  let result: CharResult[];
  try {
    result = wordleGame.attempt(body.word.join(""), body.wordIndex);
  } catch (error) {
    throw createError({ statusCode: 400 });
  }

  // save attempt
  const gameId = wordleGame.id;
  const word = body.word.join("");
  const db = await getDb(event);
  await db.insert(attempt).values({ gameId, word, result: result.join("") });

  return wordleGame.state;
});
