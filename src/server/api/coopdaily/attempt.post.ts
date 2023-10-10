import { authOptions } from "~/server/api/auth/[...]";
import { getServerSession } from "#auth";
import { z } from "zod";
import { getCoopDailyGame } from "~/server/models/getCoopDailyGame";
import { db, coopDailyAttempt } from "~/server/db";
import { WordleGameState } from "~/server/models/WordleGame";
import { CharResult } from "~/types/CharResult";
import { eq, and } from "drizzle-orm";
import { EcodeError } from "~/types/errors";

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
  const session = await getServerSession(event, authOptions);
  if (!session?.user) {
    throw createError({ status: 401 });
  }

  // prevent multiple attempts
  const { data, wordleGame } = await getCoopDailyGame(db);
  const currentGameAttempt = await db.query.coopDailyAttempt.findFirst({
    columns: { id: true },
    where: and(
      eq(coopDailyAttempt.gameId, data.id),
      eq(coopDailyAttempt.userId, session.user.id),
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
    if (error instanceof EcodeError) {
      throw createError({ status: 400, data: { ecode: error.ecode } });
    }
    throw createError({ status: 400 });
  }

  // save attempt
  const word = body.word;
  await db.insert(coopDailyAttempt).values({
    gameId: data.id,
    userId: session.user.id,
    word,
    result: result.join(""),
  });

  return wordleGame.state;
});
