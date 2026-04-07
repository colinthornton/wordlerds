import { beforeAll } from "bun:test";
import * as path from "node:path";

// This file contains global lifecycle hooks, it's read by the --preload option of `bun test`
beforeAll(async () => {
  await Bun.file(path.resolve(__dirname, "../sqlite/wordlerds-test.sqlite"))
    .delete()
    .catch((error) => console.error(error));
  Bun.spawnSync(["bun", "run", "db", "migrate:latest"]);
});
