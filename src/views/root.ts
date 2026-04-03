import { html } from "hono/html";
import type { User } from "../db/schema";
import { layout } from "./layout";
import { keyboard } from "./components/keyboard";
import type { WordleLetter } from "../lib/wordle";
import { attempts } from "./components/attempts";

export const rootView = (props: {
  user: User;
  attempts: { word: string; result: WordleLetter[] }[];
  letters: Record<string, WordleLetter>;
}) =>
  layout({
    user: props.user,
    body: html`${attempts({ attempts: props.attempts })}${keyboard({
      letters: props.letters,
    })}`,
  });
