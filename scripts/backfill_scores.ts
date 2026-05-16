import { sql } from "kysely";
import { db } from "../src/db";
import type { Guess } from "../src/db/schema";
import { scoreGuesses } from "../src/lib/wordle_score";
import { mapBy } from "../src/utils/map_by";

export async function backfillScores() {
  const games = await db
    .selectFrom("games")
    .selectAll()
    .orderBy("id", "asc")
    .execute();

  let prevGameGuesses: Map<number, Guess> = new Map();
  for (const game of games) {
    const guesses = await db
      .selectFrom("guesses")
      .selectAll()
      .where("game_id", "=", game.id)
      .orderBy("id", "asc")
      .execute();

    const scoredGuesses = scoreGuesses(
      game.solution,
      guesses.map((g) => ({
        word: g.word,
        feedback: g.feedback.split("").map(Number),
      })),
    );

    const updatedGuesses = guesses.map((guess, i) => {
      const scores = scoredGuesses[i]!.scores;
      const total_score = scores.reduce((a, b) => a + b, 0);
      const prevGameGuess = prevGameGuesses.get(guess.user_id);
      const streak = prevGameGuess?.streak ? prevGameGuess.streak + 1 : 1;
      return { ...guess, scores: scores.join(""), total_score, streak };
    });

    await Promise.all(
      updatedGuesses.map((guess) => {
        const { id, scores, total_score, streak } = guess;
        return db
          .updateTable("guesses")
          .set({
            scores,
            total_score,
            streak,
            updated_at: sql`CURRENT_TIMESTAMP`,
          })
          .where("id", "=", id)
          .where((eb) =>
            eb.or([
              eb("scores", "is", null),
              eb("scores", "!=", scores),
              eb("total_score", "is", null),
              eb("total_score", "!=", total_score),
              eb("streak", "is", null),
              eb("streak", "!=", streak),
            ]),
          )
          .executeTakeFirstOrThrow();
      }),
    );

    prevGameGuesses = mapBy(updatedGuesses, "user_id");
  }
}

backfillScores();
