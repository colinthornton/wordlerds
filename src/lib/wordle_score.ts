import { Feedback, type Guess } from "./wordle";

export interface ScoredGuess extends Guess {
  scores: number[];
}

const enum SolutionLetter {
  NotFound,
  Found,
  Placed,
}

const foundPoints = 1;
const placedPoints = 1;

const wordLength = 5;

export const scoreGuesses = (
  solution: string,
  guesses: Guess[],
): ScoredGuess[] => {
  const solutionLetters = solution.split("");
  const solutionStates = [
    SolutionLetter.NotFound,
    SolutionLetter.NotFound,
    SolutionLetter.NotFound,
    SolutionLetter.NotFound,
    SolutionLetter.NotFound,
  ];

  return guesses.map((guess) => {
    // indexes map to solution letters, the value is the index of the matching letter in the guess
    const indexes = [-1, -1, -1, -1, -1];
    for (let i = 0; i < wordLength; i++) {
      const feedback = guess.feedback[i]!;
      if (feedback !== Feedback.Correct) continue;
      indexes[i] = i;
    }
    for (let i = 0; i < wordLength; i++) {
      const feedback = guess.feedback[i]!;
      if (feedback !== Feedback.Present) continue;
      // find first matching letter that is not already marked
      const letter = guess.word[i]!;
      for (let j = 0; j < wordLength; j++) {
        if (indexes[j] !== -1) continue;
        const solutionLetter = solutionLetters[j];
        if (solutionLetter !== letter) continue;
        indexes[j] = i;
        break;
      }
    }

    const scores = [0, 0, 0, 0, 0];
    for (let i = 0; i < wordLength; i++) {
      const state = solutionStates[i];
      if (state === SolutionLetter.Placed) continue;

      const guessIndex = indexes[i]!;
      if (guessIndex === -1) continue;

      const feedback = guess.feedback[guessIndex]!;
      if (state === SolutionLetter.NotFound) {
        scores[guessIndex]! += foundPoints;
        solutionStates[i] = SolutionLetter.Found;
      }
      if (feedback === Feedback.Correct) {
        scores[guessIndex]! += placedPoints;
        solutionStates[i] = SolutionLetter.Placed;
      }
    }

    return { ...guess, scores };
  });
};
