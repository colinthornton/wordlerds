import { db } from "../db";
import type * as Schema from "../db/schema";
import type { Feedback } from "../lib/wordle";
import { mapBy } from "../utils/map_by";

export class Guess {
  readonly id: Schema.Guess["id"];
  readonly created_at: Schema.Guess["created_at"];
  readonly updated_at: Schema.Guess["updated_at"];
  readonly word: Schema.Guess["word"];
  readonly feedback: Feedback[];
  readonly user: Schema.User;

  static async findAllByGame(game: Schema.Game) {
    const guesses = await db
      .selectFrom("guesses")
      .selectAll()
      .where("game_id", "=", game.id)
      .execute();
    const users = await db
      .selectFrom("users")
      .selectAll()
      .where(
        "id",
        "in",
        guesses.map((g) => g.user_id),
      )
      .execute();
    const userMap = mapBy(users, "id");
    return guesses.map((g) => new Guess(g, userMap.get(g.user_id)!));
  }

  private constructor(guess: Schema.Guess, user: Schema.User) {
    this.id = guess.id;
    this.created_at = guess.created_at;
    this.updated_at = guess.updated_at;
    this.word = guess.word;
    this.feedback = guess.feedback.split("").map(Number);
    this.user = user;
  }
}
