import type { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface DB {
  games: GameTable;
  guesses: GuessTable;
  users: UserTable;
}

export interface GameTable {
  id: Generated<number>;
  created_at: Generated<string>;
  updated_at: Generated<string>;
  solution: string;
  opens_at: string | null;
}
export type Game = Selectable<GameTable>;
export type NewGame = Insertable<GameTable>;
export type GameUpdate = Updateable<GameTable>;

export interface GuessTable {
  id: Generated<number>;
  created_at: Generated<string>;
  updated_at: Generated<string>;
  word: string;
  feedback: string;
  game_id: number;
  user_id: number;
  scores: string; // nullable in DB but data backfilled
  total_score: number; // nullable in DB but data backfilled
  streak: number; // nullable in DB but data backfilled
}
export type Guess = Selectable<GuessTable>;
export type NewGuess = Insertable<GuessTable>;
export type GuessUpdate = Updateable<GuessTable>;

export interface UserTable {
  id: Generated<number>;
  created_at: Generated<string>;
  updated_at: Generated<string>;
  discord_user_id: string;
  name: string;
  avatar: string | null;
}
export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
