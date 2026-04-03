import { html } from "hono/html";
import { Feedback, type Attempt } from "../../lib/wordle";

export const attempts = (props: { attempts: Attempt[] }) => {
  return html`<div
    class="grid grid-rows-6 gap-1.5 max-w-full w-87.5 h-105 my-8"
  >
    ${props.attempts.map(row)}${placeholders(6 - props.attempts.length)}
  </div>`;
};

const row = (attempt: Attempt) => {
  const letters = attempt.feedback.map((feedback, i) => ({
    letter: attempt.word[i] as string,
    feedback,
  }));

  return html`<div class="grid grid-cols-5 gap-1.5">${letters.map(box)}</div>`;
};

const box = (props: { letter: string; feedback: Feedback }) =>
  html`<div
    class="grid place-items-center border-2 border-neutral-700 text-3xl font-bold uppercase ${boxColor(
      props.feedback,
    )}"
  >
    ${props.letter}
  </div>`;

const boxColor = (feedback: Feedback) => {
  switch (feedback) {
    case Feedback.NotPresent:
      return "bg-natural-800";
    case Feedback.Present:
      return "bg-present text-primary-foreground";
    case Feedback.Correct:
      return "bg-correct text-primary-foreground";
    default:
      return "";
  }
};

const placeholders = (rows: number) =>
  Array.from({ length: rows }).map(
    () =>
      html`<div class="grid grid-cols-5 gap-1.5">
        ${Array.from({ length: 5 }).map(
          () => html`<div class="border-2 border-neutral-700"></div>`,
        )}
      </div>`,
  );
