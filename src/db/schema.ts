import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";

export interface DB {
  users: UserTable;
}

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
