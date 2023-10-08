import {
  CharResult,
  RESULT_CORRECT,
  RESULT_INCORRECT_PLACE,
  RESULT_NOT_FOUND,
} from "~/types/CharResult";
import { WordleGameDesyncError, WordleInvalidWordError } from "~/types/errors";
import { dictionary } from "~/assets/dictionary";

export class WordleGame {
  private attempts: WordleGameState["attempts"] = [];
  private status: "PLAYING" | "GAME_OVER" = "PLAYING";

  get id() {
    return this._id;
  }

  get state(): WordleGameState {
    return {
      attempts: this.attempts,
      keys: this.keys,
      status: this.status,
    };
  }

  get keys() {
    const keys = new Map<string, CharResult>();
    this.attempts.forEach((attempt) => {
      attempt.word.split("").forEach((char, j) => {
        const current = keys.get(char) ?? RESULT_NOT_FOUND;
        keys.set(char, Math.max(current, attempt.result[j]) as CharResult);
      });
    });
    return Object.fromEntries(keys);
  }

  constructor(
    private _id: number,
    private solution: string,
    attempts: {
      word: string;
      result: string;
      user: {
        id: number;
        name: string;
        avatar: string;
      };
    }[]
  ) {
    attempts.forEach((attempt, i) =>
      this.attempt(
        attempt.word,
        i,
        attempt.user,
        attempt.result.split("").map(Number) as CharResult[]
      )
    );
  }

  attempt(
    word: string,
    wordIndex: number,
    user: { id: number; name: string; avatar: string },
    result?: CharResult[]
  ) {
    if (wordIndex !== this.attempts.length) {
      throw new WordleGameDesyncError();
    }

    if (!dictionary.includes(word)) {
      throw new WordleInvalidWordError();
    }

    if (!result) {
      result = this.getResult(word.split(""));
    }
    this.attempts.push({ word, user, result });

    if (result.every((r) => r === RESULT_CORRECT)) {
      this.status = "GAME_OVER";
    }

    if (this.attempts.length === 6) {
      this.status = "GAME_OVER";
    }

    return result;
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

export type WordleGameState = {
  attempts: {
    word: string;
    user: {
      id: number;
      name: string;
      avatar: string;
    };
    result: CharResult[];
  }[];
  keys: Record<string, CharResult>;
  status: "PLAYING" | "GAME_OVER";
};
