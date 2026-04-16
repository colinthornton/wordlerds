import { db } from "../db";
import type * as Schema from "../db/schema";
import { solutions, Wordle } from "../lib/wordle";
import { Guess } from "./guess";
import type { User } from "./user";

export class Game {
  readonly id: Schema.Game["id"];
  readonly created_at: Schema.Game["created_at"];
  readonly updated_at: Schema.Game["updated_at"];
  readonly solution: Schema.Game["solution"];
  readonly guesses: Guess[];
  private wordle: Wordle;

  static async create(newGame: Schema.NewGame) {
    const game = await db
      .insertInto("games")
      .values(newGame)
      .returningAll()
      .executeTakeFirstOrThrow();
    return new Game(game, []);
  }

  /**
   * Create a game with a random solution
   * @param deduplicationLimit prevent selecting duplicate solution from the last `deduplicationLimit` games
   */
  static async createWithRandomSolution(deduplicationLimit = 365) {
    if (deduplicationLimit >= solutions.size) {
      throw new RangeError();
    }

    const prevSolutions = await db
      .selectFrom("games")
      .select("solution")
      .orderBy("id", "desc")
      .limit(deduplicationLimit)
      .execute()
      .then((rows) => new Set(rows.map((r) => r.solution)));
    const allowedSolutions = solutions.difference(prevSolutions);
    const solution =
      Array.from(allowedSolutions)[
        Math.floor(Math.random() * allowedSolutions.size)
      ]!;

    return this.create({ solution });
  }

  static async findLatest() {
    const game = await db
      .selectFrom("games")
      .selectAll()
      .orderBy("id", "desc")
      .limit(1)
      .executeTakeFirst();
    if (!game) return null;

    const guesses = await Guess.findAllByGame(game);
    return new Game(game, guesses);
  }

  private constructor(game: Schema.Game, guesses: Guess[]) {
    this.id = game.id;
    this.created_at = game.created_at;
    this.updated_at = game.updated_at;
    this.solution = game.solution;
    this.guesses = guesses;
    this.wordle = new Wordle(
      game.solution,
      guesses.map((g) => ({ word: g.word, feedback: g.feedback })),
    );
  }

  get state() {
    return this.wordle.state;
  }

  get letters() {
    return this.wordle.letters;
  }

  async makeGuess(word: string, user: User) {
    // Throws WordleError if invalid
    const wordleGuess = this.wordle.makeGuess(word);
    const guess = await Guess.create(wordleGuess, this, user);
    this.guesses.push(guess);
    return guess;
  }
}
