import { db } from "../db";
import type * as Schema from "../db/schema";
import type * as Wordle from "../lib/wordle";
import type { Feedback } from "../lib/wordle";
import { mapBy } from "../utils/map_by";
import type { Game } from "./game";
import { User } from "./user";

export class Guess {
  readonly id: Schema.Guess["id"];
  readonly created_at: Schema.Guess["created_at"];
  readonly updated_at: Schema.Guess["updated_at"];
  readonly word: Schema.Guess["word"];
  readonly feedback: Feedback[];
  readonly user: Schema.User;

  static async create(newGuess: Wordle.Guess, game: Game, user: User) {
    const guess = await db
      .insertInto("guesses")
      .values({
        word: newGuess.word,
        feedback: newGuess.feedback.join(""),
        game_id: game.id,
        user_id: user.id,
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

  private constructor(guess: Schema.Guess, user: User) {
    this.id = guess.id;
    this.created_at = guess.created_at;
    this.updated_at = guess.updated_at;
    this.word = guess.word;
    this.feedback = guess.feedback.split("").map(Number);
    this.user = user;
  }

  get letters() {
    return this.feedback.map((feedback, i) => ({
      letter: this.word[i] as string,
      feedback,
    }));
  }
}
