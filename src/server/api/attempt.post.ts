import { z } from "zod";
import { getServerSession } from "#auth";
import { getWordleGame } from "../models/getWordleGame";
import { getDb, user, attempt } from "../db";
import { WordleGameState } from "../models/WordleGame";
import { CharResult } from "~/types/CharResult";
import { eq, and, ne } from "drizzle-orm";

export default defineEventHandler(async (event): Promise<WordleGameState> => {
  // authenticate
  const session = await getServerSession(event);
  const username = session?.user?.name;
  const avatar = session?.user?.image;
  if (typeof username !== "string" || !username.length) {
    throw createError({ status: 401 });
  }
  const db = getDb(event);
  const authUser = await db
    .insert(user)
    .values({ username, avatar })
    .onConflictDoUpdate({
      target: user.username,
      set: { avatar },
    })
    .returning()
    .get();

  // prevent multiple attempts
  const wordleGame = await getWordleGame(db);
  const currentGameAttempt = await db.query.attempt.findFirst({
    columns: { id: true },
    where: and(
      eq(attempt.gameId, wordleGame.id),
      eq(attempt.userId, authUser.id)
    ),
  });
  if (currentGameAttempt) {
    throw createError({ status: 403 });
  }

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
  let result: CharResult[];
  try {
    result = wordleGame.attempt(body.word.join(""), body.wordIndex, authUser);
  } catch (error) {
    throw createError({ statusCode: 400 });
  }

  // save attempt
  const gameId = wordleGame.id;
  const word = body.word.join("");
  await db
    .insert(attempt)
    .values({ gameId, userId: authUser.id, word, result: result.join("") });

  return wordleGame.state;
});
