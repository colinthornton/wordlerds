import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("games")
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("created_at", "text", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("updated_at", "text", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("solution", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("guesses")
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("created_at", "text", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("updated_at", "text", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("word", "text", (col) => col.notNull())
    .addColumn("feedback", "text", (col) => col.notNull())
    .addColumn("game_id", "integer", (col) =>
      col.notNull().references("games.id"),
    )
    .addColumn("user_id", "integer", (col) =>
      col.notNull().references("users.id"),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("guesses").ifExists().execute();

  await db.schema.dropTable("games").ifExists().execute();
}
