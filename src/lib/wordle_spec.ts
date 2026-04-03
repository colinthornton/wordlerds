import { expect, test, describe } from "bun:test";
import {
  HardModeError,
  Wordle,
  Feedback,
  WordNotInDictionaryError,
  WordNotInSolutionsError,
} from "./wordle";

describe("#gameOver", () => {
  test("false for new game", () => {
    const game = new Wordle("guess");

    expect(game.gameOver).toBeFalse();
  });

  test("true for early solved game", () => {
    const game = new Wordle("guess", ["guess"]);

    expect(game.gameOver).toBeTrue();
  });

  test("true for late solved game", () => {
    const game = new Wordle("guess", [
      "games",
      "games",
      "games",
      "games",
      "games",
      "guess",
    ]);

    expect(game.gameOver).toBeTrue();
  });

  test("true for max attempts", () => {
    const game = new Wordle("guess", [
      "games",
      "games",
      "games",
      "games",
      "games",
      "games",
    ]);

    expect(game.gameOver).toBeTrue();
  });
});

describe("feedback", () => {
  test("finds solution", () => {
    const game = new Wordle("guess");
    game.makeAttempt("guess");

    expect(game.attempts).toEqual([
      {
        word: "guess",
        feedback: [
          Feedback.Correct,
          Feedback.Correct,
          Feedback.Correct,
          Feedback.Correct,
          Feedback.Correct,
        ],
      },
    ]);
  });

  test("multiple present letters", () => {
    const game = new Wordle("droll");
    game.makeAttempt("llama");

    expect(game.attempts).toEqual([
      {
        word: "llama",
        feedback: [
          Feedback.Present,
          Feedback.Present,
          Feedback.NotPresent,
          Feedback.NotPresent,
          Feedback.NotPresent,
        ],
      },
    ]);
  });
});

describe("errors", () => {
  test("invalid solution", () => {
    expect(() => new Wordle("invalid")).toThrow(WordNotInSolutionsError);
  });

  test("not in dictionary", () => {
    const game = new Wordle("guess");

    expect(() => game.makeAttempt("lorem")).toThrow(WordNotInDictionaryError);
  });

  describe("hard mode", () => {
    test("must play correct letters in same place", () => {
      const game = new Wordle("hardy", ["hovel"]);

      // missing initial "h"
      expect(() => game.makeAttempt("there")).toThrow(HardModeError);
    });

    test("must play present letter", () => {
      const game = new Wordle("gourd", ["death"]);

      // missing present "d"
      expect(() => game.makeAttempt("price")).toThrow(HardModeError);
    });

    test("must play all present letters", () => {
      const game = new Wordle("llama", ["droll"]);

      // missing second "l"
      expect(() => game.makeAttempt("lever")).toThrow(HardModeError);
      expect(() => game.makeAttempt("level")).not.toThrow();
    });

    test("must play all present letters when one is correct", () => {
      const game = new Wordle("droll", ["level"]);

      expect(() => game.makeAttempt("panel")).toThrow(HardModeError);
    });
  });
});
