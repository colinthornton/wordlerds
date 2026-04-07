import { beforeEach, describe, expect, test } from "bun:test";
import { db } from "../db";
import { Feedback, solutions } from "../lib/wordle";
import { Guess } from "./guess";
import { Game } from "./game";

beforeEach(async () => {
  await db.deleteFrom("games").execute();
});

describe(".create", () => {
  test("creates a new game", async () => {
    const game = await Game.create({ solution: "hello" });

    expect(
      await db.selectFrom("games").selectAll().executeTakeFirst(),
    ).toMatchObject({ solution: "hello" });
  });
});

describe(".findLatest", () => {
  test("selects latest game by ID", async () => {
    await db
      .insertInto("games")
      .values([{ solution: "first" }, { solution: "later" }])
      .executeTakeFirstOrThrow();

    const game = await Game.findLatest();

    expect(game).toHaveProperty("solution", "later");
  });
});
