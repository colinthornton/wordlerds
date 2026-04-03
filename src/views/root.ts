import { html } from "hono/html";
import type { User } from "../db/schema";
import type { Attempt, Feedback } from "../lib/wordle";
import { attempts } from "./components/attempts";
import { keyboard } from "./components/keyboard";
import { layout } from "./layout";

export const rootView = (props: {
  user: User;
  attempts: Attempt[];
  letters: Record<string, Feedback>;
}) =>
  layout({
    user: props.user,
    body: html`${attempts({ attempts: props.attempts })}${keyboard({
      letters: props.letters,
    })}`,
  });
