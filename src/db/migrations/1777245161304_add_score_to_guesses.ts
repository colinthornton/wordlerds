import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("guesses").addColumn("scores", "text").execute();
  await db.schema
    .alterTable("guesses")
    .addColumn("total_score", "integer")
    .execute();
  await db.schema
    .alterTable("guesses")
    .addColumn("streak", "integer")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("guesses").dropColumn("streak").execute();
  await db.schema.alterTable("guesses").dropColumn("total_score").execute();
  await db.schema.alterTable("guesses").dropColumn("scores").execute();
}
