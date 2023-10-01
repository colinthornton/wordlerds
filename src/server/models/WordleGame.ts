import {
  CharResult,
  RESULT_CORRECT,
  RESULT_INCORRECT_PLACE,
  RESULT_NOT_FOUND,
} from "~/types/CharResult";
import { dictionary } from "~/assets/dictionary";

export class WordleGame {
  private attempts: string[] = [];
  private results: CharResult[][] = [];
  private status: "PLAYING" | "GAME_OVER" = "PLAYING";

  get id() {
    return this._id;
  }

  get state(): WordleGameState {
    return {
      attempts: this.attempts,
      results: this.results,
      keys: this.keys,
      status: this.status,
    };
  }

  get keys() {
    const keys = new Map<string, CharResult>();
    this.attempts.forEach((attempt, i) => {
      attempt.split("").forEach((char, j) => {
        const current = keys.get(char) ?? RESULT_NOT_FOUND;
        keys.set(char, Math.max(current, this.results[i][j]) as CharResult);
      });
    });
    return Object.fromEntries(keys);
  }

  constructor(
    private _id: number,
    private solution: string,
    attempts: string[]
  ) {
    attempts.forEach((word, i) => this.attempt(word, i));
  }

  attempt(word: string, wordIndex: number) {
    if (wordIndex !== this.attempts.length) {
      throw new WordleGameDesyncError();
    }

    if (!dictionary.includes(word)) {
      throw new WordleInvalidWordError();
    }

    this.attempts.push(word);
    const result = this.getResult(word.split(""));
    this.results.push(this.getResult(word.split("")));

    if (result.every((r) => r === RESULT_CORRECT)) {
      this.status = "GAME_OVER";
    }

    if (this.attempts.length === 6) {
      this.status = "GAME_OVER";
    }
  }

  private getResult(attempt: string[]) {
    const solutionChars = this.solution.split("");
    const result: CharResult[] = new Array(this.solution.length).fill(
      RESULT_NOT_FOUND
    );

    for (let i = 0; i < attempt.length; i++) {
      if (attempt[i] !== solutionChars[i]) continue;
      result[i] = RESULT_CORRECT;
      solutionChars[i] = "";
    }

    for (let i = 0; i < attempt.length; i++) {
      if (result[i] === RESULT_CORRECT) continue;
      const targetIndex = solutionChars.findIndex(
        (char) => attempt[i] === char
      );
      if (targetIndex === -1) continue;
      result[i] = RESULT_INCORRECT_PLACE;
      solutionChars[targetIndex] = "";
    }

    return result;
  }
}

export class WordleInvalidWordError extends Error {}
export class WordleGameDesyncError extends Error {}

export type WordleGameState = {
  attempts: string[];
  results: CharResult[][];
  keys: Record<string, CharResult>;
  status: "PLAYING" | "GAME_OVER";
};
