export const RESULT_NOT_FOUND = 0;
export const RESULT_INCORRECT_PLACE = 1;
export const RESULT_CORRECT = 2;
export type CharResult =
  | typeof RESULT_NOT_FOUND
  | typeof RESULT_INCORRECT_PLACE
  | typeof RESULT_CORRECT;
