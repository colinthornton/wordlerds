import { html } from "hono/html";
import { Feedback } from "../../lib/wordle";

export const keyboard = (props: { letters: Record<string, Feedback> }) =>
  html`<div class="flex flex-col gap-2 w-full max-w-121 touch-manipulation">
    ${keys.map(
      (row) =>
        html`<div class="flex gap-2 justify-center">
          ${row.map((key) => button(key, props.letters))}
        </div>`,
    )}
  </div>`;

const keys = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["", "a", "s", "d", "f", "g", "h", "j", "k", "l", ""],
  ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"],
];

const button = (key: string, letters: Record<string, Feedback>) => {
  switch (key) {
    case "":
      return html`<div class="flex-[0.5] -mx-1"></div>`;
    case "Enter":
      return html`<button
        class="btn-icon flex-[1.5] uppercase font-bold h-14 p-0 text-[20px]"
      >
        <svg
          class="size-5"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
        >
          <path
            d="M6 12 3.269 3.126A59.768 59.768 0 0 1 21.485 12 59.77 59.77 0 0 1 3.27 20.876L5.999 12Zm0 0h7.5"
          />
        </svg>
      </button>`;
    case "Backspace":
      return html`<button
        class="btn-icon flex-[1.5] uppercase font-bold h-14 p-0"
      >
        <svg
          class="size-5"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
        >
          <path
            d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.375-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33Z"
          />
        </svg>
      </button>`;
    default:
      let color = "";
      switch (letters[key]) {
        case Feedback.NotPresent:
          color = "bg-not-present text-secondary-foreground";
          break;
        case Feedback.Present:
          color = "bg-present";
          break;
        case Feedback.Correct:
          color = "bg-correct";
          break;
      }
      return html`<button
        class="btn flex-1 uppercase font-bold h-14 p-0 ${color}"
      >
        ${key}
      </button>`;
  }
};
