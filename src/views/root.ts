import { html } from "hono/html";
import type { User } from "../db/schema";
import { layout } from "./layout";
import { keyboard } from "./components/keyboard";

export const rootView = (props: { user: User }) =>
  layout({
    user: props.user,
    body: html`${keyboard({})}`,
  });
