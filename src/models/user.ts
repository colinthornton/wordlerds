import { sql } from "kysely";
import { type DBConnection } from "../db";
import type { NewUser } from "../db/schema";

export async function createOrUpdate(db: DBConnection, user: NewUser) {
  const existingUser = await db
    .selectFrom("users")
    .selectAll()
    .where("users.discord_user_id", "=", user.discord_user_id)
    .executeTakeFirst();

  if (!existingUser) {
    await db.insertInto("users").values(user).executeTakeFirst();
  } else if (
    existingUser.name !== user.name ||
    existingUser.avatar !== user.avatar
  ) {
    await db
      .updateTable("users")
      .where("id", "=", existingUser.id)
      .set({ updated_at: sql`CURRENT_TIMESTAMP`, ...user })
      .execute();
  } else {
    return existingUser;
  }

  return db
    .selectFrom("users")
    .selectAll()
    .where("discord_user_id", "=", user.discord_user_id)
    .executeTakeFirstOrThrow();
}
