import { beforeEach, describe, expect, test } from "bun:test";
import { db } from "../db";
import { User } from "./user";

beforeEach(async () => {
  await db.deleteFrom("guesses").execute();
  await db.deleteFrom("users").execute();
});

describe(".createOrUpdate", () => {
  test("creates a new user", async () => {
    await User.createOrUpdate({
      discord_user_id: "123",
      name: "newuser",
      avatar: "https://example.com/coolpic",
    });

    expect(
      await db.selectFrom("users").selectAll().executeTakeFirst(),
    ).toMatchObject({
      discord_user_id: "123",
      name: "newuser",
      avatar: "https://example.com/coolpic",
    });
  });

  test("updates an existing user", async () => {
    await db
      .insertInto("users")
      .values({
        discord_user_id: "123",
        name: "ted",
        avatar: "https://example.com/coolpic",
      })
      .executeTakeFirstOrThrow();

    await User.createOrUpdate({
      discord_user_id: "123",
      name: "teddy",
      avatar: "https://example.com/coolerpic",
    });

    expect(
      await db
        .selectFrom("users")
        .select(({ fn }) => [fn.count("id").as("count")])
        .executeTakeFirst(),
    ).toEqual({ count: 1 });
    expect(
      await db.selectFrom("users").selectAll().executeTakeFirst(),
    ).toMatchObject({
      discord_user_id: "123",
      name: "teddy",
      avatar: "https://example.com/coolerpic",
    });
  });

  test("returns existing user with no changes", async () => {
    await db
      .insertInto("users")
      .values({
        discord_user_id: "123",
        name: "ted",
        avatar: "https://example.com/coolpic",
      })
      .executeTakeFirstOrThrow();

    await User.createOrUpdate({
      discord_user_id: "123",
      name: "ted",
      avatar: "https://example.com/coolpic",
    });

    expect(
      await db
        .selectFrom("users")
        .select(({ fn }) => [fn.count("id").as("count")])
        .executeTakeFirst(),
    ).toEqual({ count: 1 });
    expect(
      await db.selectFrom("users").selectAll().executeTakeFirst(),
    ).toMatchObject({
      discord_user_id: "123",
      name: "ted",
      avatar: "https://example.com/coolpic",
    });
  });
});

describe(".findById", () => {
  test("finds existing user by id", async () => {
    await db
      .insertInto("users")
      .values({ id: 123, discord_user_id: "123", name: "test" })
      .executeTakeFirstOrThrow();

    const user = await User.findById(123);

    expect(user).toMatchObject({ discord_user_id: "123", name: "test" });
  });

  test("returns null when not found", async () => {
    const user = await User.findById(123);

    expect(user).toBeNull();
  });
});
