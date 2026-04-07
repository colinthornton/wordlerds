import { Database } from "bun:sqlite";
import { BunSqliteDialect } from "kysely-bun-sqlite";

const filename =
  Bun.env.NODE_ENV === "production"
    ? "wordlerds"
    : `wordlerds-${Bun.env.NODE_ENV}`;
const database = new Database(`sqlite/${filename}.sqlite`);
database.run("PRAGMA journal_mode = WAL;");
database.run("PRAGMA foreign_keys = TRUE;");

export const dialect = new BunSqliteDialect({
  database,
});
