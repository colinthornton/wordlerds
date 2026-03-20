import { Database } from "bun:sqlite";
import { BunSqliteDialect } from "kysely-bun-sqlite";

const database = new Database("sqlite/wordlerds.sqlite");
database.run("PRAGMA journal_mode = WAL;");

export const dialect = new BunSqliteDialect({
  database,
});
