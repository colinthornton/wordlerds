import {
  RESULT_CORRECT,
  RESULT_INCORRECT_PLACE,
  RESULT_NOT_FOUND,
} from "~/utils/CharResult";

export function getResult(target: string | string[], attempt: string[]) {
  return attempt.map((letter, i) => {
    if (target[i] === letter) {
      return RESULT_CORRECT;
    }
    if (target.includes(letter)) {
      return RESULT_INCORRECT_PLACE;
    }
    return RESULT_NOT_FOUND;
  });
}
