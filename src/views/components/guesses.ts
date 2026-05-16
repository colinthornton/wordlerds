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
    <div class="w-full grid place-items-center">
      <div class="-mr-1.5 relative">
        ${avatar({ user: guess.user })}
        <span class="absolute -top-3 left-1.5 -z-10"
          >${guess.multiplier > 1 ? "🔥" : ""}</span
        >
        <span class="absolute -top-2 -left-0.5 -z-10"
          >${guess.multiplier > 2 ? "🔥" : ""}</span
        >
        <span class="absolute -top-2 left-3.5 -z-10"
          >${guess.multiplier > 2 ? "🔥" : ""}</span
        >
      </div>
    </div>
    ${guess.letters.map(box)}
  </div>`;
};

const box = (props: { letter: string; feedback: Feedback; score: number }) =>
  html`<div
    class="grid place-items-center border-2 relative text-3xl font-bold uppercase ${boxColor(
      props.feedback,
    )}"
  >
    ${props.letter}
    ${props.score > 0
      ? html`<span
          class="badge-primary absolute -top-1 -right-1 text-[xx-small]"
          >+${props.score}</span
        >`
      : ""}
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
