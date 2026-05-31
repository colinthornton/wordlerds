import { expect, test } from "bun:test";
import { scoreGuesses } from "./wordle_score";
import { Wordle } from "./wordle";

test("double letter present", () => {
  const wordle = new Wordle("llama");
  wordle.makeGuess("hello");
  wordle.makeGuess("alloy");
  wordle.makeGuess("llama");

  const scores = scoreGuesses(wordle.solution, wordle.guesses).map(
    (g) => g.scores,
  );

  // found both "l"
  expect(scores[0]).toEqual([0, 0, 1, 1, 0]);
  // found "a", placed already found "l"
  expect(scores[1]).toEqual([1, 1, 0, 0, 0]);
  // placed already found "l" and "a", found and placed "m" and "a"
  expect(scores[2]).toEqual([1, 0, 1, 2, 2]);
});

test("gauge", () => {
  const wordle = new Wordle("gauge");
  wordle.makeGuess("chest");
  wordle.makeGuess("plier");
  wordle.makeGuess("begun");
  wordle.makeGuess("fudge");
  wordle.makeGuess("gauge");

  const scores = scoreGuesses(wordle.solution, wordle.guesses).map(
    (g) => g.scores,
  );

  expect(scores[0]).toEqual([0, 0, 1, 0, 0]);
  expect(scores[1]).toEqual([0, 0, 0, 0, 0]);
  expect(scores[2]).toEqual([0, 0, 1, 1, 0]);
  // This was bugfixed. Previously the G in FUDGE was scored 2 when it should have been
  // only 1 since it was found in BEGUN above.
  expect(scores[3]).toEqual([0, 0, 0, 1, 1]);
  expect(scores[4]).toEqual([2, 2, 1, 0, 0]);
});
