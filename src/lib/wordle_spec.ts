import { expect, test, describe } from "bun:test";
import {
  HardModeError,
  Wordle,
  Feedback,
  WordNotInDictionaryError,
  WordNotInSolutionsError,
} from "./wordle";

describe("#state", () => {
  test("IN_PROGRESS for new game", () => {
    const game = new Wordle("hello");

    expect(game.state).toEqual("IN_PROGRESS");
  });

  test("IN_PROGRESS for unsolved game at 5 attempts", () => {
    const game = new Wordle("hello", [
      "guess",
      "guess",
      "guess",
      "guess",
      "guess",
    ]);

    expect(game.state).toEqual("IN_PROGRESS");
  });

  test("LOSS for unsolved game at 6 attempts", () => {
    const game = new Wordle("hello", [
      "guess",
      "guess",
      "guess",
      "guess",
      "guess",
      "guess",
    ]);

    expect(game.state).toEqual("LOSS");
  });

  test("WIN for solved game", () => {
    const game = new Wordle("hello", ["hello"]);

    expect(game.state).toEqual("WIN");
  });

  test("LOSS for unsolved game at 6 attempts", () => {
    const game = new Wordle("hello", [
      "guess",
      "guess",
      "guess",
      "guess",
      "guess",
      "hello",
    ]);

    expect(game.state).toEqual("WIN");
  });
});

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

  test("true for max guesses", () => {
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
    game.makeGuess("guess");

    expect(game.guesses).toEqual([
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
    game.makeGuess("llama");

    expect(game.guesses).toEqual([
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

  test("correct come after same letter", () => {
    // edge case: in testing I had "toast" show up with the first "T" marked present and the final "T" marked not present
    const game = new Wordle("coast", ["prime", "lousy", "toast"]);

    expect(game.guesses.at(-1)!.feedback).toEqual([
      Feedback.NotPresent,
      Feedback.Correct,
      Feedback.Correct,
      Feedback.Correct,
      Feedback.Correct,
    ]);
  });
});

describe("errors", () => {
  test("invalid solution", () => {
    expect(() => new Wordle("invalid")).toThrow(WordNotInSolutionsError);
  });

  test("not in dictionary", () => {
    const game = new Wordle("guess");

    expect(() => game.makeGuess("lorem")).toThrow(WordNotInDictionaryError);
  });

  describe("hard mode", () => {
    test("must play correct letters in same place", () => {
      const game = new Wordle("hardy", ["hovel"]);

      // missing initial "h"
      expect(() => game.makeGuess("there")).toThrow(HardModeError);
    });

    test("must play present letter", () => {
      const game = new Wordle("gourd", ["death"]);

      // missing present "d"
      expect(() => game.makeGuess("price")).toThrow(HardModeError);
    });

    test("must play all present letters", () => {
      const game = new Wordle("llama", ["droll"]);

      // missing second "l"
      expect(() => game.makeGuess("lever")).toThrow(HardModeError);
      expect(() => game.makeGuess("level")).not.toThrow();
    });

    test("must play all present letters when one is correct", () => {
      const game = new Wordle("droll", ["level"]);

      expect(() => game.makeGuess("panel")).toThrow(HardModeError);
    });
  });
});
