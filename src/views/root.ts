import { html } from "hono/html";
import type { User } from "../db/schema";
import type { Feedback, Guess } from "../lib/wordle";
import { guesses } from "./components/guesses";
import { keyboard } from "./components/keyboard";
import { layout } from "./layout";

export const rootView = (props: {
  user: User;
  guesses: Guess[];
  letters: Record<string, Feedback>;
}) =>
  layout({
    user: props.user,
    body: html`${guesses({ guesses: props.guesses })}${keyboard({
      letters: props.letters,
    })}`,
  });
