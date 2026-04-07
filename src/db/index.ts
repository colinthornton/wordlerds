import { Kysely } from "kysely";
import { dialect } from "./dialect";
import type { DB } from "./schema";

export const db = new Kysely<DB>({
  dialect,
  log: Bun.env.NODE_ENV === "test" ? undefined : ["query", "error"],
});

export type DBConnection = typeof db;
