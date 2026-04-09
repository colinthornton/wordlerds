import { html } from "hono/html";
import { Feedback } from "../../lib/wordle";
import { Guess } from "../../models/guess";
import { avatar } from "./avatar";

export const guesses = (props: { guesses: Guess[] }) => {
  return html`<div
    id="guesses"
    class="grid grid-rows-6 gap-1.5 max-w-full w-87.5 h-87.5 my-8 border-l"
  >
    ${props.guesses.map(row)}${props.guesses.length < 6 && input()}
    ${props.guesses.length < 5 && placeholders(5 - props.guesses.length)}
  </div>`;
};

// displays rows of previous attempts
const row = (guess: Guess) => {
  return html`<div class="grid grid-cols-6 gap-1.5">
    <div class="place-self-center -mr-1.5">${avatar({ user: guess.user })}</div>
    ${guess.letters.map(box)}
  </div>`;
};

const box = (props: { letter: string; feedback: Feedback }) =>
  html`<div
    class="grid place-items-center border-2 text-3xl font-bold uppercase ${boxColor(
      props.feedback,
    )}"
  >
    ${props.letter}
  </div>`;

const boxColor = (feedback: Feedback) => {
  switch (feedback) {
    case Feedback.NotPresent:
      return "bg-neutral-800";
    case Feedback.Present:
      return "bg-present text-primary-foreground";
    case Feedback.Correct:
      return "bg-correct text-primary-foreground";
    default:
      return "";
  }
};

// displays current user's input row
const input = () =>
  html`<div class="grid grid-cols-6 gap-1.5">
    <div></div>
    ${Array.from({ length: 5 }).map(
      (_, i) =>
        html`<div
          class="grid place-items-center border-2 text-3xl font-bold uppercase"
          data-text="$word[${i}] ?? ''"
        ></div>`,
    )}
  </div> `;

// displays rows of empty boxes
const placeholders = (rows: number) =>
  Array.from({ length: rows }).map(
    () =>
      html`<div class="grid grid-cols-6 gap-1.5">
        <div></div>
        ${Array.from({ length: 5 }).map(
          () => html`<div class="border-2"></div>`,
        )}
      </div>`,
  );
