import { describe, expect, test } from "bun:test";
import { db } from "../db";
import { solutions } from "../lib/wordle";
import { Game } from "./game";

describe(".create", () => {
  test("creates a new game", async () => {
    await Game.create({ solution: "hello" });

    expect(
      await db.selectFrom("games").selectAll().executeTakeFirst(),
    ).toMatchObject({ solution: "hello" });
  });
});

describe(".createWithRandomSolution", () => {
  test("creates a new game", async () => {
    await Game.createWithRandomSolution();

    expect(
      await db
        .selectFrom("games")
        .select(({ fn }) => fn.count("id").as("count"))
        .executeTakeFirst(),
    ).toEqual({ count: 1 });
  });

  test("prevents duplicate solutions from previous `deduplicateLimit` games", async () => {
    const solutionsMinusHello = new Set(solutions);
    solutionsMinusHello.delete("hello");
    await db
      .insertInto("games")
      .values(Array.from(solutionsMinusHello).map((solution) => ({ solution })))
      .executeTakeFirstOrThrow();

    const game = await Game.createWithRandomSolution(solutionsMinusHello.size);

    expect(game).toHaveProperty("solution", "hello");
  });

  test("throws range error when `deduplicationLimit` gte to solution set size", () => {
    expect(() => Game.createWithRandomSolution(2314)).not.toThrow(RangeError);
    expect(() => Game.createWithRandomSolution(2315)).toThrow(RangeError);
    expect(() => Game.createWithRandomSolution(2316)).toThrow(RangeError);
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

  test("returns null when no games exist", async () => {
    const game = await Game.findLatest();

    expect(game).toBeNull();
  });
});
