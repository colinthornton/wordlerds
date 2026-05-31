import { Feedback, type Guess } from "./wordle";

export interface ScoredGuess extends Guess {
  scores: number[];
}

// Points gained for finding a letter. A letter is considered found when it's the
// first instance of it being marked "Present" in a game.
const foundPoints = 1;
// Points gained for placing a letter. A letter is considered placed when it's
// marked "Correct".
const placedPoints = 1;

const wordLength = 5;

export const scoreGuesses = (
  solution: string,
  guesses: Guess[],
): ScoredGuess[] => {
  const prevFoundLetters = new Map(
    solution.split("").map((letter) => [letter, 0]),
  );
  const letterPlaced = new Array<boolean>(wordLength).fill(false);

  return guesses.map((guess) => {
    const scores = [0, 0, 0, 0, 0];
    const foundLetters = new Map<string, number>(
      solution.split("").map((letter) => [letter, 0]),
    );

    for (let i = 0; i < wordLength; i++) {
      if (!letterPlaced[i]) continue;

      const letter = solution[i]!;
      foundLetters.set(letter, foundLetters.get(letter)! + 1);
    }

    for (let i = 0; i < wordLength; i++) {
      const feedback = guess.feedback[i];
      if (feedback === Feedback.NotPresent) continue;

      const letter = guess.word[i]!;
      if (letterPlaced[i] && letter === solution[i]!) continue;
      foundLetters.set(letter, foundLetters.get(letter)! + 1);

      const newlyFound =
        foundLetters.get(letter)! > prevFoundLetters.get(letter)!;
      if (newlyFound) {
        scores[i]! += foundPoints;
      }

      if (feedback === Feedback.Correct) {
        letterPlaced[i] = true;
        scores[i]! += placedPoints;
      }
    }

    for (const [letter, count] of foundLetters) {
      if (count > prevFoundLetters.get(letter)!) {
        prevFoundLetters.set(letter, count);
      }
    }

    return { ...guess, scores };
  });
};
