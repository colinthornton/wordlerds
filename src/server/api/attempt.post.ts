import { z } from "zod";
import { wordleGame } from "../utils/wordleGame";

export default defineEventHandler(async (event) => {
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
  try {
    const state = wordleGame.attempt(body.word, body.wordIndex);
    if (state.status === "GAME_OVER") {
      wordleGame.newGame();
    }
    return state;
  } catch (error) {
    throw createError({ statusCode: 400 });
  }
});
