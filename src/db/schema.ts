import type { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface DB {
  games: GameTable;
  guesses: GuessTable;
  users: UserTable;
}

export interface GameTable {
  id: Generated<number>;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
  solution: string;
}
export type Game = Selectable<GameTable>;
export type NewGame = Insertable<GameTable>;
export type GameUpdate = Updateable<GameTable>;

export interface GuessTable {
  id: Generated<number>;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
  word: string;
  feedback: string;
  game_id: number;
  user_id: number;
}
export type Guess = Selectable<GuessTable>;
export type NewGuess = Insertable<GuessTable>;
export type GuessUpdate = Updateable<GuessTable>;

export interface UserTable {
  id: Generated<number>;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
  discord_user_id: string;
  name: string;
  avatar: string | null;
}
export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
