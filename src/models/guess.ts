import { sql } from "kysely";
import { db } from "../db";
import type * as Schema from "../db/schema";
import type { Feedback } from "../lib/wordle";
import type { ScoredGuess } from "../lib/wordle_score";
import { mapBy } from "../utils/map_by";
import type { Game } from "./game";
import { User } from "./user";

export class Guess {
  readonly id: Schema.Guess["id"];
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly word: Schema.Guess["word"];
  readonly feedback: Feedback[];
  readonly scores: number[];
  readonly total_score: Schema.Guess["total_score"];
  readonly streak: Schema.Guess["streak"];
  readonly user: User;

  static async create(newGuess: ScoredGuess, game: Game, user: User) {
    const prevGameGuess = await db
      .selectFrom("guesses")
      .select("streak")
      .where("user_id", "=", user.id)
      .where("game_id", "=", game.id - 1)
      .limit(1)
      .executeTakeFirst();
    const streak = prevGameGuess?.streak ? prevGameGuess.streak + 1 : 1;
    const guess = await db
      .insertInto("guesses")
      .values({
        word: newGuess.word,
        feedback: newGuess.feedback.join(""),
        game_id: game.id,
        user_id: user.id,
        scores: newGuess.scores.join(""),
        total_score: newGuess.scores.reduce((a, b) => a + b),
        streak,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return new Guess(guess, user);
  }

  static async findById(id: number) {
    const guess = await db
      .selectFrom("guesses")
      .selectAll()
      .where("guesses.id", "=", id)
      .limit(1)
      .executeTakeFirst();
    if (!guess) return null;

    const user = await User.findById(guess.user_id);
    if (!user) return null;

    return new Guess(guess, user);
  }

  static async findAllByGame(game: Schema.Game) {
    const guesses = await db
      .selectFrom("guesses")
      .selectAll()
      .where("game_id", "=", game.id)
      .execute();
    const users = await User.findAllByGuesses(guesses);
    const userMap = mapBy(users, "id");
    return guesses.map((g) => new Guess(g, userMap.get(g.user_id)!));
  }

  static async findLast7Days() {
    const guesses = await db
      .selectFrom("guesses")
      .selectAll()
      .where(
        "created_at",
        ">=",
        sql<string>`datetime('now', 'start of day', '-7 days')`,
      )
      .where("created_at", "<", sql<string>`datetime('now', 'start of day')`)
      .execute();
    const users = await User.findAllByGuesses(guesses);
    const userMap = mapBy(users, "id");
    return guesses.map((g) => new Guess(g, userMap.get(g.user_id)!));
  }

  private constructor(guess: Schema.Guess, user: User) {
    this.id = guess.id;
    this.created_at = new Date(guess.created_at);
    this.updated_at = new Date(guess.updated_at);
    this.word = guess.word;
    this.feedback = guess.feedback.split("").map(Number);
    this.scores = guess.scores.split("").map(Number);
    this.total_score = guess.total_score;
    this.streak = guess.streak;
    this.user = user;
  }

  get letters() {
    return this.feedback.map((feedback, i) => ({
      letter: this.word[i]!,
      feedback,
      score: this.scores[i]! * this.multiplier,
    }));
  }

  get multiplier() {
    return Math.min(this.streak, 3);
  }

  get score() {
    return this.total_score * this.multiplier;
  }
}
