import { sql } from "kysely";
import { db } from "../db";
import type * as Schema from "../db/schema";

export class User {
  readonly id: Schema.User["id"];
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly discord_user_id: Schema.User["discord_user_id"];
  readonly name: Schema.User["name"];
  readonly avatar: Schema.User["avatar"];

  static async createOrUpdate(user: Schema.NewUser) {
    const existingUser = await db
      .selectFrom("users")
      .selectAll()
      .where("users.discord_user_id", "=", user.discord_user_id)
      .executeTakeFirst();

    if (!existingUser) {
      return new User(
        await db
          .insertInto("users")
          .values(user)
          .returningAll()
          .executeTakeFirstOrThrow(),
      );
    } else if (
      existingUser.name !== user.name ||
      existingUser.avatar !== user.avatar
    ) {
      return new User(
        await db
          .updateTable("users")
          .where("id", "=", existingUser.id)
          .set({ updated_at: sql`CURRENT_TIMESTAMP`, ...user })
          .returningAll()
          .executeTakeFirstOrThrow(),
      );
    } else {
      return new User(existingUser);
    }
  }

  static async findById(id: Schema.User["id"]) {
    const user = await db
      .selectFrom("users")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
    if (!user) return null;

    return new User(user);
  }

  static async findAllByGuesses(guesses: Schema.Guess[]) {
    const users = await db
      .selectFrom("users")
      .selectAll()
      .where(
        "id",
        "in",
        guesses.map((g) => g.user_id),
      )
      .execute();
    return users.map((user) => new User(user));
  }

  private constructor(user: Schema.User) {
    this.id = user.id;
    this.created_at = new Date(user.created_at);
    this.updated_at = new Date(user.updated_at);
    this.discord_user_id = user.discord_user_id;
    this.name = user.name;
    this.avatar = user.avatar;
  }
}
