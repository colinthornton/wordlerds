import { describe, expect, test } from "bun:test";
import { db } from "../db";
import { Feedback } from "../lib/wordle";
import { Guess } from "./guess";

describe(".findAllByGame", () => {
  test("returns guesses associated with the game", async () => {
    const game = await db
      .insertInto("games")
      .values({ solution: "hello" })
      .returningAll()
      .executeTakeFirstOrThrow();
    const user = await db
      .insertInto("users")
      .values({ discord_user_id: "123", name: "ted" })
      .returningAll()
      .executeTakeFirstOrThrow();

    await db
      .insertInto("guesses")
      .values([
        {
          word: "hello",
          feedback: "22222",
          game_id: game.id,
          user_id: user.id,
        },
        {
          word: "gross",
          feedback: "00100",
          game_id: game.id,
          user_id: user.id,
        },
      ])
      .executeTakeFirstOrThrow();

    const guesses = await Guess.findAllByGame(game);

    expect(guesses[0]).toMatchObject({
      word: "hello",
      feedback: [
        Feedback.Correct,
        Feedback.Correct,
        Feedback.Correct,
        Feedback.Correct,
        Feedback.Correct,
      ],
      user: {
        discord_user_id: "123",
        name: "ted",
      },
    });
    expect(guesses[1]).toMatchObject({
      word: "gross",
      feedback: [
        Feedback.NotPresent,
        Feedback.NotPresent,
        Feedback.Present,
        Feedback.NotPresent,
        Feedback.NotPresent,
      ],
      user: {
        discord_user_id: "123",
        name: "ted",
      },
    });
  });
});
