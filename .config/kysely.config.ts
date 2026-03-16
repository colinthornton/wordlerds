import { defineConfig } from "kysely-ctl";
import * as path from "node:path";

import { db as kysely } from "../src/db";

// https://github.com/kysely-org/kysely-ctl?tab=readme-ov-file#configuration
export default defineConfig({
  kysely,
  migrations: {
    migrationFolder: path.resolve(__dirname, "../src/db/migrations"),
  },
});
