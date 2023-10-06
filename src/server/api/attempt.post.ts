import { z } from "zod";
import { getServerSession } from "#auth";
import { getWordleGame } from "../models/getWordleGame";
import { getDb, attempt } from "../db";
import { WordleGameState } from "../models/WordleGame";
import { CharResult } from "~/types/CharResult";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event): Promise<WordleGameState> => {
  // validate input
  const validation = z
    .object({
      word: z.string().length(5).regex(/[a-z]/),
      wordIndex: z.number().min(0).max(5),
    })
    .safeParse(await readBody(event));
  if (!validation.success) {
    throw createError({ status: 400 });
  }
  const body = validation.data;

  // authenticate
  const session = await getServerSession(event);
  if (!session?.user) {
    throw createError({ status: 401 });
  }

  // prevent multiple attempts
  const db = getDb(event);
  const wordleGame = await getWordleGame(db);
  const currentGameAttempt = await db.query.attempt.findFirst({
    columns: { id: true },
    where: and(
      eq(attempt.gameId, wordleGame.id),
      eq(attempt.userId, session.user.id)
    ),
  });
  if (currentGameAttempt) {
    throw createError({ status: 403 });
  }

  // update game state
  let result: CharResult[];
  try {
    result = wordleGame.attempt(body.word, body.wordIndex, session.user);
  } catch (error) {
    throw createError({ statusCode: 400 });
  }

  // save attempt
  const gameId = wordleGame.id;
  const word = body.word;
  await db
    .insert(attempt)
    .values({ gameId, userId: session.user.id, word, result: result.join("") });

  return wordleGame.state;
});
