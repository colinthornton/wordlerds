import { Database } from "bun:sqlite";
import { BunSqliteDialect } from "kysely-bun-sqlite";
import { Kysely } from "kysely";

import type { DB } from "./schema"; // this is the Database interface we defined earlier

const database = new Database("worlderds.sqlite");
database.run("PRAGMA journal_mode = WAL;");

const dialect = new BunSqliteDialect({
  database,
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({
  dialect,
});
