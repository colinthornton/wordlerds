import { CharResult, RESULT_CORRECT } from "~/utils/CharResult";

export class WordleGame {
  private target: string = "";
  private attempts: string[][] = [];
  private results: CharResult[][] = [];
  private status: "PLAYING" | "GAME_OVER" = "PLAYING";

  get state() {
    return {
      attempts: this.attempts,
      results: this.results,
      status: this.status,
    };
  }

  constructor(private targets: string[], private dictionary: string[]) {
    this.newGame();
  }

  newGame() {
    this.target = this.targets[Math.floor(Math.random() * this.targets.length)];
    this.attempts = [];
    this.results = [];
    this.status = "PLAYING";
  }

  attempt(word: string[], wordIndex: number) {
    if (wordIndex !== this.attempts.length) {
      throw new WordleGameDesyncError();
    }

    if (!this.dictionary.includes(word.join(""))) {
      throw new WordleInvalidWordError();
    }

    this.attempts.push(word);
    const result = getResult(this.target, word);
    this.results.push(result);

    if (result.every((r) => r === RESULT_CORRECT)) {
      this.status = "GAME_OVER";
    }

    if (this.attempts.length === 6) {
      this.status = "GAME_OVER";
    }

    return this.state;
  }
}

export class WordleInvalidWordError extends Error {}
export class WordleGameDesyncError extends Error {}
