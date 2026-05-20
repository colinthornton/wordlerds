import type { Context } from "hono";
import { CompiledQuery } from "kysely";
import { db } from "../db";
import { Feedback } from "../lib/wordle";
import { Guess } from "../models/guess";
import type { User } from "../models/user";
import { scoreView } from "../views/score";

export async function score(c: Context<{ Variables: { user: User } }>) {
  const monthGuesses = await Guess.findCurrentMonth();
  const monthStats = new Map<
    number, // user ID
    {
      user: User;
      score: number;
      maxStreak: number;
      guesses: number;
      correct: number;
      present: number;
      notPresent: number;
      scored: number;
      accuracy: number;
    }
  >();
  for (const guess of monthGuesses) {
    if (!monthStats.has(guess.user.id)) {
      monthStats.set(guess.user.id, {
        user: guess.user,
        score: 0,
        maxStreak: 0,
        guesses: 0,
        correct: 0,
        present: 0,
        notPresent: 0,
        accuracy: 0,
        scored: 0,
      });
    }
    const acc = monthStats.get(guess.user.id)!;
    const score = acc.score + guess.score;
    const maxStreak = Math.max(acc.maxStreak, guess.streak);
    const guesses = acc.guesses + 1;
    const correct =
      acc.correct + guess.feedback.filter((f) => f === Feedback.Correct).length;
    const present =
      acc.present + guess.feedback.filter((f) => f === Feedback.Present).length;
    const notPresent =
      acc.notPresent +
      guess.feedback.filter((f) => f === Feedback.NotPresent).length;
    const scored = acc.scored + guess.scores.filter((s) => s > 0).length;
    const accuracy = scored / (guesses * 5);
    monthStats.set(guess.user.id, {
      user: acc.user,
      score,
      maxStreak,
      guesses,
      correct,
      present,
      notPresent,
      scored,
      accuracy,
    });
  }
  const sortedMonthStats = Array.from(monthStats.values()).sort(
    (a, b) => b.score - a.score,
  );

  const { rows } = await db.executeQuery<{ start: number; end: number }>(
    CompiledQuery.raw(
      `SELECT
          unixepoch('now', 'start of month', 'subsec') * 1000 as start,
          unixepoch('now', 'start of month', '1 month', 'subsec') * 1000 as end
        ;`,
    ),
  );
  const range: [number, number] = [rows[0]!.start, rows[0]!.end];

  return c.html(
    scoreView({ user: c.var.user, stats: sortedMonthStats, range }),
  );
}
