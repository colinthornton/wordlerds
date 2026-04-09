import { beforeAll } from "bun:test";
import { CompiledQuery } from "kysely";
import * as path from "node:path";
import { beforeEach } from "node:test";
import { db } from "../src/db";

// This file contains global lifecycle hooks, it's read by the --preload option of `bun test`
beforeAll(async () => {
  await Promise.all(
    [
      "wordlerds-test.sqlite",
      "wordlerds-test.sqlite-shm",
      "wordlerds-test.sqlite-wal",
    ].map((filename) =>
      Bun.file(path.resolve(__dirname, "../sqlite/", filename))
        .delete()
        .catch(console.error),
    ),
  );
  Bun.spawnSync(["bun", "run", "db", "migrate:latest"]);
});

beforeEach(async () => {
  await db.executeQuery(CompiledQuery.raw("PRAGMA foreign_keys = FALSE;"));
  await Promise.all([
    db.deleteFrom("games").execute(),
    db.deleteFrom("guesses").execute(),
    db.deleteFrom("users").execute(),
  ]);
  await db.executeQuery(CompiledQuery.raw("PRAGMA foreign_keys = TRUE;"));
});
