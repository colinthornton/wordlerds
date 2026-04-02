import { html } from "hono/html";
import type { User } from "../db/schema";
import { layout } from "./layout";
import { keyboard } from "./components/keyboard";
import type { WordleLetter } from "../lib/wordle";

export const rootView = (props: {
  user: User;
  letters: Record<string, WordleLetter>;
}) =>
  layout({
    user: props.user,
    body: html`${keyboard({ letters: props.letters })}`,
  });
