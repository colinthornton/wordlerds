import { db } from "../db";
import type * as Schema from "../db/schema";
import type { Observer, Subject } from "../lib/observable";
import { solutions, Wordle } from "../lib/wordle";
import { scoreGuesses } from "../lib/wordle_score";
import { Guess } from "./guess";
import type { User } from "./user";

export class Game implements Subject<Game> {
  readonly id: Schema.Game["id"];
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly solution: Schema.Game["solution"];
  readonly opens_at: Date | null;
  readonly guesses: Guess[];
  private wordle: Wordle;
  private observers = new Set<Observer<Game>>();

  static async create(newGame: Schema.NewGame) {
    if (!newGame.opens_at) {
      const twentyFourHours = 24 * 60 * 60 * 1000;
      const thirtySixHours = 36 * 60 * 60 * 1000;
      const delay = Math.floor(
        Math.random() * (thirtySixHours - twentyFourHours) + twentyFourHours,
      );
      newGame.opens_at = new Date(Date.now() + delay).toISOString();
    }

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

  static async findById(id: number) {
    const game = await db
      .selectFrom("games")
      .selectAll()
      .where("games.id", "=", id)
      .limit(1)
      .executeTakeFirst();
    if (!game) return null;

    const guesses = await Guess.findAllByGame(game);
    return new Game(game, guesses);
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
    this.created_at = new Date(game.created_at);
    this.updated_at = new Date(game.updated_at);
    this.solution = game.solution;
    this.opens_at = game.opens_at ? new Date(game.opens_at) : null;
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

  get open() {
    if (!this.opens_at) return true;
    return Date.now() >= this.opens_at.getTime();
  }

  get opens_in() {
    if (!this.opens_at) return 0;
    return this.opens_at.getTime() - Date.now();
  }

  async makeGuess(word: string, user: User) {
    // Throws WordleError if invalid
    this.wordle.makeGuess(word);
    const scoredGuess = scoreGuesses(
      this.wordle.solution,
      this.wordle.guesses,
    ).at(-1)!;
    const guess = await Guess.create(scoredGuess, this, user);
    this.guesses.push(guess);
    this.notify();
    return guess;
  }

  subscribe(observer: Observer<Game>): void {
    this.observers.add(observer);
  }

  unsubscribe(observer: Observer<Game>): void {
    this.observers.delete(observer);
  }

  private notify() {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }
}
