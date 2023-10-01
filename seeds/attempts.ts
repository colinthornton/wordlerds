import { db } from "~/server/db/db";
import { attempt } from "~/server/db/schema";
import { targets } from "~/assets/targets";

main();

async function main() {
  await db.delete(attempt);
}
