import { expect, test } from "bun:test";
import { scoreGuesses } from "./wordle_score";
import { Wordle } from "./wordle";

test("double letter present", () => {
  const wordle = new Wordle("llama");
  wordle.makeGuess("hello");
  wordle.makeGuess("alloy");
  wordle.makeGuess("llama");

  const result = scoreGuesses(wordle.solution, wordle.guesses);

  // found both "l"
  expect(result[0]!.scores).toEqual([0, 0, 1, 1, 0]);
  // found "a", placed already found "l"
  expect(result[1]!.scores).toEqual([1, 1, 0, 0, 0]);
  // placed already found "l" and "a", found and placed "m" and "a"
  expect(result[2]!.scores).toEqual([1, 0, 1, 2, 2]);
});
