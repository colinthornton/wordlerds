import { db } from "../db";
import type * as Schema from "../db/schema";
import { Wordle } from "../lib/wordle";
import { Guess } from "./guess";

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

  static async findLatest() {
    const game = await db
      .selectFrom("games")
      .selectAll()
      .orderBy("id", "desc")
      .executeTakeFirstOrThrow();
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
      guesses.map((g) => g.word),
    );
  }
}
