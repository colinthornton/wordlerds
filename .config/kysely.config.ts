import { defineConfig } from "kysely-ctl";
import * as path from "node:path";
import { dialect } from "../src/db/dialect";

// https://github.com/kysely-org/kysely-ctl?tab=readme-ov-file#configuration
export default defineConfig({
  dialect,
  migrations: {
    migrationFolder: path.resolve(__dirname, "../src/db/migrations"),
  },
});
