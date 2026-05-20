import { html } from "hono/html";
import type { Feedback } from "../lib/wordle";
import type { Guess } from "../models/guess";
import type { User } from "../models/user";
import { guesses } from "./components/guesses";
import { keyboard } from "./components/keyboard";
import { layout } from "./layout";

export const gameView = (props: {
  user: User;
  guesses: Guess[];
  letters: Record<string, Feedback>;
}) =>
  layout({
    user: props.user,
    body: html`<div data-init="@get('/eventstream')"></div>
      ${guesses({ guesses: props.guesses })}${keyboard({
        letters: props.letters,
      })}`,
  });
