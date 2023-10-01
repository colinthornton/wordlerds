import {
  RESULT_CORRECT,
  RESULT_INCORRECT_PLACE,
  RESULT_NOT_FOUND,
} from "~/utils/CharResult";

export function getResult(target: string | string[], attempt: string[]) {
  const targetChars =
    typeof target === "string" ? target.split("") : target.slice();
  const result = new Array(target.length).fill(RESULT_NOT_FOUND);

  for (let i = 0; i < attempt.length; i++) {
    const targetIndex = targetChars.findIndex((char) => char === attempt[i]);
    if (targetIndex === -1) {
      continue;
    }
    if (targetIndex === i) {
      result[i] = RESULT_CORRECT;
      targetChars[targetIndex] = "";
    } else {
      result[i] = RESULT_INCORRECT_PLACE;
      targetChars[targetIndex] = "";
    }
  }

  return result;
}
